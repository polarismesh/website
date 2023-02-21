---
title: "CMDB插件开发"
linkTitle: "CMDB插件开发"
weight: 2
---

{{< note >}}
该文档仅适用于服务端版本 >= 1.14.0
{{< /note >}}

## 背景

在进行服务发现发现时，我们都希望能够做到同机房、同地域的就近路由，以减少网络调用的延迟。而要做到就近路由，就必须知道主调节点和被调节点的地域信息，因此我们可以通过开发北极星服务端的 CMDB 插件，对接至自己的 CMDB 系统，从而填充每个实例的地域信息，以到达实现就近路由的目标。

为了方便快速的将北极星的 CMDB 扩展点对接至用户的 CMDB 系统，我们设计了一套通用的 CMDB OpenAPI，开发者只需要按照该 OpenAPI 实现一个 CMDB 查询服务端，即可将北极星快速对接到自己的 CMDB 系统中去。

## 协议定义

#### 发起 CMDB 查询请求

```json
METHOD: POST
HEADER: Authorization: 访问 Token // 可选

BODY
{
    "request_id": String,
    "page_no": Number,
    "page_size": Number // 固定，每次 100 拉取
}
```

#### CMDB Server 的返回响应

```json
{
    "total": Number, // 总数
    "size": Number, // 当前放回条数
    "code": Number,
    "info": String,
    "data": [
        {
            "ip": "127.0.0.1",
            "type": "host", # 固定
            "region": {
                "name": String
            }，
            "zone": {
                "name": String
            }，
            "campus": {
                "name": String
            }，

        }
    ]
}
```

## 服务端启用

修改 polaris-server.yaml 配置

```yaml
# 插件配置
plugin:
  cmdb:
    name: memory
    option:
      url: "{ CMDB 查询服务端 OpenAPI 地址 }"
      interval: 60s
```

然后重启北极星服务端即可
