---
title: "使用 Envoy"
linkTitle: "使用 Envoy"
weight: 2
---


## 部署polaris

### kubernetes环境使用

如果已经部署好了polaris，可忽略这一步。

polaris支持在kubernetes环境中进行部署，注意必须保证暴露HTTP端口为8090，gRPC端口为8091。具体部署方案请参考：

- [单机版部署指南](/docs/使用指南/服务端安装/单机版安装/#使用-k8s-安装)
- [集群版部署指南](/docs/使用指南/服务端安装/集群版安装/#使用-k8s-安装)

### 虚拟机环境使用

如果已经部署好了polaris，可忽略这一步。

polaris支持在linux虚拟机环境中进行部署，注意必须保证暴露HTTP端口为8090，gRPC端口为8091。具体部署方案请参考：

- [单机版部署指南](/docs/使用指南/服务端安装/单机版安装/#使用-linux-安装)
- [集群版部署指南](/docs/使用指南/服务端安装/集群版安装/#使用-linux-安装)

## Envoy Gateway 启动配置

```yaml
node:
  # Envoy 的 node 配置必须遵守以下规则
  id: "gateway~${envoy gateway 网关服务所在的命名空间}/${UUID}~${envoy 节点IP}"
  metadata:
    gateway_service: ${envoy gateway 网关服务名称}
    gateway_namespace: ${envoy gateway 网关服务所在的命名空间}

dynamic_resources:
  ads_config:
    api_type: GRPC
    transport_api_version: V3
    grpc_services:
      - google_grpc:
          target_uri: ${北极星服务端IP}:15010
          stat_prefix: polarismesh
          channel_args:
            args:
              grpc.http2.max_ping_strikes:
                int_value: 0
              grpc.keepalive_time_ms:
                int_value: 10000
              grpc.keepalive_timeout_ms:
                int_value: 20000
```

{{< note >}}
- 当前推荐 envoy 版本为 **envoyproxy/envoy-contrib:v1.21.4**
- 必须在北极星创建 envoy gateway 的服务，其服务名为 ${node.metadata.gateway_service}, 所在命名空间为 ${node.metadata.gateway_namespace}
{{< /note >}}


## 创建 Envoy Gateway 使用的路由规则

假定现在有两个服务 **service-a** 以及 **service-b**，希望 Envoy Gateway 能够按照以下规则路由到特定的服务

- 路由到 service-a
  - 条件 1: http path 为 /api/v1/service-a
- 路由到 service-b
  - 添加 1: http path 为 /api/v1/service-b

那么需要按照下列步骤准备

> 准备 Envoy 启动配置

- 参考 [Envoy Gateway 启动配置](#envoy-gateway-启动配置) 创建 **gateway_xds_test.yaml**
  ```yaml
  # 这里只给出 node 节点部份的配置
  node:
    id: "gateway~default/c962adc3-673e-4637-9ba8-969d755ef66a~127.0.0.1"
    cluster: "CLUSTER_NAME"
    metadata:
      gateway_service: EnvoyGateway
      gateway_namespace: default
  ```
- 在北极星上创建服务，服务名为 **EnvoyGateway**, 所在命名空间为 **default**

> 创建路由到 service-a 的路由规则

![](../images/envoy/routeto-service-a.png)

> 创建路由到 service-b 的路由规则

![](../images/envoy/routeto-service-b.png)

> 运行 Envoy Gateway


```bash
docker run -it --rm  -p 15001:15001 -p 15000:15000 -v $(pwd)/gateway_xds_test.yaml:/gateway_xds_test.yaml envoyproxy/envoy-contrib:v1.21.4 -c /gateway_xds_test.yaml
```

> 查看 Envoy Gateway 收到的 XDS 规则

进入 envoy 容器执行以下命令

```
curl http://127.0.0.1:15000/config_dump
```

如果 **RoutesConfigDump** 如下，则 XDS 规则获取成功

```json
{
    "@type":"type.googleapis.com/envoy.admin.v3.RoutesConfigDump",
    "dynamic_route_configs":[
        {
            "version_info":"2023-04-01T01:06:47+08:00/9",
            "route_config":{
                "@type":"type.googleapis.com/envoy.config.route.v3.RouteConfiguration",
                "name":"polaris-router",
                "virtual_hosts":[
                    {
                        "name":"gateway-virtualhost",
                        "domains":[
                            "*"
                        ],
                        "routes":[
                            {
                                "match":{
                                    "path":"/api/v1/service-a"
                                },
                                "route":{
                                    "weighted_clusters":{
                                        "clusters":[
                                            {
                                                "name":"service-a",
                                                "weight":100,
                                                "metadata_match":{
                                                    "filter_metadata":{
                                                        "envoy.lb":{
                                                            "env":"prod"
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        "total_weight":100
                                    }
                                }
                            },
                            {
                                "match":{
                                    "path":"/api/v1/service-b"
                                },
                                "route":{
                                    "weighted_clusters":{
                                        "clusters":[
                                            {
                                                "name":"service-b",
                                                "weight":100,
                                                "metadata_match":{
                                                    "filter_metadata":{
                                                        "envoy.lb":{
                                                            "env":"prod"
                                                        }
                                                    }
                                                }
                                            }
                                        ],
                                        "total_weight":100
                                    }
                                }
                            },
                            {
                                "match":{
                                    "prefix":"/"
                                },
                                "route":{
                                    "cluster":"PassthroughCluster"
                                }
                            }
                        ]
                    }
                ],
                "validate_clusters":false
            },
            "last_updated":"2023-03-31T17:06:47.547Z"
        }
    ]
}
```

> 请求验证

```bash
curl http://127.0.0.1:15000/api/v1/service-a

# 期望输出：I'm service-a

curl http://127.0.0.1:15000/api/v1/service-b

# 期望输出：I'm service-b
```


## 附录：Demo 程序

```go
package main

import (
	"io"
	"log"
	"net/http"
	"os"
)

func main() {
	handler := func(w http.ResponseWriter, req *http.Request) {
		io.WriteString(w, "I'm "+os.Getenv("SERVICE_NAME"))
	}

	http.HandleFunc("/", handler)
	log.Fatal(http.ListenAndServe(":"+os.Getenv("PORT"), nil))
}
```
