---
title: "Release v1.18.0"
linkTitle: "Release v1.18.0"
weight: 1
---


## 下载地址

- [Github Release v1.18.0](https://github.com/polarismesh/polaris/releases/tag/v1.18.0)

## 特性说明

#### Nacos客户端协议全功能版本兼容

在 1.18.0 版本中，社区正式将 **apiserver-nacos** 插件纳入官方默认插件，并完善了 **nacos1.x**/**nacos2.x** 的客户端功能特性兼容。用户无需替换自己的 **nacos-client** 依赖，只需更换接入地址即可接入北极星的注册发现以及配置管理。

- nacos1.x
  - 注册发现
    - [x] 实例注册
    - [x] 服务发现
    - [x] 心跳上报
    - [x] 基于 UDP 的服务端主动推送
  - 配置管理
    - [x] 配置发布
    - [x] 配置查询
    - [x] 配置监听
- nacos2.x
  - 注册发现
    - [x] 实例注册
    - [x] 服务发现
    - [x] 基于 gRPC 长连接的实例信息维护
    - [x] 基于 gRPC 的服务端主动推送
  - 配置管理
    - [x] 配置发布
    - [x] 配置查询
    - [x] 配置监听

```yaml
apiservers:
  - name: service-nacos
    option:
      listenIP: "0.0.0.0"
      # nacos http 协议监听端口，grpc 端口默认在该基础上 +1000
      listenPort: 8848
      # 设置 nacos 默认命名空间对应 Polaris 命名空间信息
      defaultNamespace: default
      connLimit:
        openConnLimit: false
        maxConnPerHost: 128
        maxConnLimit: 10240
```

#### 支持 Mesh Sidecar 场景下的 Cluster/Endpoint 按需加载

Sidecar Mesh 场景下，每个 Sidecar 进程都会收到 xDS Server 推送下来的全量服务数据。假设一个 Workload-1 他仅仅调用了 Service-1/Service-2 两个服务，但是大部份的 xDS Server 都会将全量的 Service 推送给 Workload-1 的 Sidecar。这样子带来的后果就是每个 Sidecar 的内存、资源消耗会随着服务量级的增长而增长。

![](../images/release-v1.18/envoy-sideacr-xds-memory.png)

为了解决上述问题。社区在 1.18.0 版本中实现了 Envoy xDS 中的 [OCDS 能力](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/on_demand_updates_filter)。默认只推送全量的 VHDS 到 Sidecar 中，Cluster/Endpoint 资源根据实际请求进行按需加载。

同时我们也优化了服务端关于 xDS 规则生成的内存占用，不再使用 envoy go-control-plane 中的 SnapshotCache 实现，而是选择了 LinearCache，根据每类 xDS 资源的生成特点进行存放在不同的 LinearCache 中，尽可能将公共的 xDS 资源只生成一份，其余的需要按照 mtls、odcds 场景的规则则各自存在对应的 LinearCache 中。

- 需要搭配 [polaris-controller v1.7.0](https://github.com/polarismesh/polaris-controller/releases/tag/v1.7.0) 版本一起使用
- 由于当前 Envoy 的按需加载能力，当 On-Demand VHDS 和 On-Demand Cluster 同时启用时存在 BUG，因此目前仅实现了 On-Demand Cluster 的能力，待和 Envoy 社区推进解决该 BUG 后用户可享受真正的 Envoy 按需加载能力，[社区 issue](https://github.com/envoyproxy/envoy/issues/24726)

#### 支持 Mesh Sidecar 场景下的分布式限流

在 1.18.0 版本中，我们针对 Mesh Sidecar 的场景，支持将 Polaris 的分布式限流通过由 Polaris-Sidecar 组件实现的 RLS 提供给 Envoy 的限流 Filter，使得用户在 Mesh 场景下可以享受 Polaris 的分布式限流能力

![](../images/release-v1.18/envoy_rls.png)

- 需要搭配 [polaris-controller v1.7.0](https://github.com/polarismesh/polaris-controller/releases/tag/v1.7.0) 版本一起使用

#### 配置中心支持灰度发布

为了让用户有更好的配置中心使用体验，社区在 v1.18.0 版本中支持配置灰度能力，当前灰度能力支持用户自定义客户端标签进行灰度控制下发；针对存量老版本客户端仅支持根据客户端IP进行灰度控制台下发。

![](../images/release-v1.18/config_beta_publish_op_2.png)

> polaris-go 配置客户端标签

```yaml
global:
  serverConnector:
    addresses:
      - 127.0.0.1:8091
  client:
    labels:
      ${label_key}: ${label_value}
```

> polaris-java

开发中...

#### 配置中心和 Kubernetes ConfigMap 无缝打通

当前通过 polaris-controller 组件将 Kubernetes 上的 Service 信息同步至北极星中，用户便可以针对 Kubernetes 上的 POD 进行相应的服务治理。但是对于 ConfigMap 这一配置资源的管理却还是只能停留在 Kubernetes；假如北极星能够接管用户的 ConfigMap 管理，用户只需要在北极星控制台上进行配置文件创建、发布即可将配置同步到 ConfigMap 中那么用户还能够享受到配置审计、发布历史、配置回滚等增强功能。因此在 1.18.0 版本中我们支持了北极星和 Kubernetes ConfigMap 资源的数据打通能力，用户只需要部署 polaris-controller 1.7.0 版本即可，相关使用文档参考 [K8s 配置同步](/docs/使用指南/k8s和网格代理/k8s-配置同步/)

## 版本变化

### 特性

- [[PR #1174]](https://github.com/polarismesh/polaris/pull/1174) feat:support push envoy rls filter xds
- [[PR #1175]](https://github.com/polarismesh/polaris/pull/1175) feat(xds): add OutlierDetection and HealthCheck
- [[PR #1215]](https://github.com/polarismesh/polaris/pull/1215) 服务端支持流量无损停机
- [[PR #1237]](https://github.com/polarismesh/polaris/pull/1237) feat: allow empty db password
- [[PR #1253]](https://github.com/polarismesh/polaris/pull/1253) feat:envoy ratelimit action suppoer all spec label & add hds feature
- [[PR #1271]](https://github.com/polarismesh/polaris/pull/1271) 配置中心支持灰度发布
- [[PR #1276]](https://github.com/polarismesh/polaris/pull/1276) refactor:优化xds生成逻辑 & 合并社区 nacosserver 插件
- [[PR #1285]](https://github.com/polarismesh/polaris/pull/1285) feat:新增配置控制是否允许自动创建服务
- [[PR #1304]](https://github.com/polarismesh/polaris/pull/1304) feat:xdsv3 support envoy odcds

### 优化

- [[PR #1170]](https://github.com/polarismesh/polaris/pull/1170) refactor:Adjust xds rule build
- [[PR #1179]](https://github.com/polarismesh/polaris/pull/1179) refactor: remove the template code used by map to improve code readability
- [[PR #1232]](https://github.com/polarismesh/polaris/pull/1232) refactor:statis log add traffic direction info
- [[PR #1235]](https://github.com/polarismesh/polaris/pull/1235) in order to improve the processing of service discovery QPS when using api-http server
- [[PR #1250]](https://github.com/polarismesh/polaris/pull/1250) 增强eureka delta api的稳定性
- [[PR #1283]](https://github.com/polarismesh/polaris/pull/1283) 无效请求不需要上报prometheus

### 测试覆盖

- [[PR #1309]](https://github.com/polarismesh/polaris/pull/1309) test:add unit test for service visible feature

### BUG 修复

- [[PR #1162]](https://github.com/polarismesh/polaris/pull/1162) 调整与Eureka实例的状态兼容逻辑
- [[PR #1173]](https://github.com/polarismesh/polaris/pull/1173) 单机版为用户关联用户组时，会默认勾选所有用户组
- [[PR #1184]](https://github.com/polarismesh/polaris/pull/1184) 修复通过服务别名拉取时，服务信息为源服务信息问题
- [[PR #1188]](https://github.com/polarismesh/polaris/pull/1188) 用户组token鉴权bug修复；用户名校验规则修改：允许包含英文句号
- [[PR #1192]](https://github.com/polarismesh/polaris/pull/1192) 修复batchConfig批量注销实例配置问题
- [[PR #1196]](https://github.com/polarismesh/polaris/pull/1196) 修复心跳上报写redis异常时未将异常结果返回问题
- [[PR #1197]](https://github.com/polarismesh/polaris/pull/1208) 修复熔断/探测规则更新绑定服务信息后缓存遗留脏数据
- [[PR #1201]](https://github.com/polarismesh/polaris/pull/1216) 修复 arm64 环境无法使用 docker image
- [[PR #1212]](https://github.com/polarismesh/polaris/pull/1212) 修复清理软删除实例时没有同步清理 instance_metadata 以及 health_check 表的数据
- [[PR #1213]](https://github.com/polarismesh/polaris/pull/1214) 修复xDS 生成 cacheKey 时缺失 gatewayService
- [[PR #1233]](https://github.com/polarismesh/polaris/pull/1233) fix: Dockerfile 8761 port duplicate
- [[PR #1240]](https://github.com/polarismesh/polaris/pull/1240) fix typo: firtstUpdate -> firstUpdate
- [[PR #1273]](https://github.com/polarismesh/polaris/pull/1273) 解决配置中心标签 value 和 key 相同的问题
- [[PR #1281]](https://github.com/polarismesh/polaris/pull/1281) fix release_history search bug
- [[PR #1287]](https://github.com/polarismesh/polaris/pull/1287) fix:修复checkLeader任务卡住 & 修复nacos2.x逻辑兼容问题
- [[PR #1291]](https://github.com/polarismesh/polaris/pull/1291) fix: statis plugin will happen nil pointer dereference on item
- [[PR #1301]](https://github.com/polarismesh/polaris/pull/1301) 入口流量匹配规则缺失


## New Contributors
* @skywli made their first contribution in https://github.com/polarismesh/polaris/pull/1175
* @qnnn made their first contribution in https://github.com/polarismesh/polaris/pull/1184
* @WTIFS made their first contribution in https://github.com/polarismesh/polaris/pull/1188
* @xiaolaji422 made their first contribution in https://github.com/polarismesh/polaris/pull/1215
* @codingcn made their first contribution in https://github.com/polarismesh/polaris/pull/1233
* @nxsre made their first contribution in https://github.com/polarismesh/polaris/pull/1273
* @qdsordinarydream made their first contribution in https://github.com/polarismesh/polaris/pull/1283
* @Lin-1997 made their first contribution in https://github.com/polarismesh/polaris/pull/1291
* @njy17 made their first contribution in https://github.com/polarismesh/polaris/pull/1301

**Full Changelog**: https://github.com/polarismesh/polaris/compare/v1.17.8...v1.18.0

## 参与 PolarisMesh 社区

欢迎大家使用体验、Star、Fork、Issue，也欢迎大家参与 PolarisMesh 开源共建！

仓库地址：https://github.com/polarismesh/polaris

项目文档： https://polarismesh.cn/#/

往期发布：https://github.com/polarismesh/polaris/releases