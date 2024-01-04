---
title: "Pre-Release v1.18.0-beta"
linkTitle: "Pre-Release v1.18.0-beta"
weight: 1
---


## 下载地址

- [Github Release v1.18.0-beta](https://github.com/polarismesh/polaris/releases/tag/v1.18.0-beta)

## 特性说明

#### Nacos客户端协议全功能版本兼容

在 1.18.0-beta 版本中，社区正式将 **apiserver-nacos** 插件纳入官方默认插件，并完善了 **nacos1.x**/**nacos2.x** 的客户端功能特性兼容。用户无需替换自己的 **nacos-client** 依赖，只需更换接入地址即可接入北极星的注册发现以及配置管理。

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

Sidecar Mesh 场景下，每个 Sidecar 进程都会收到 XDS Server 推送下来的全量服务数据。假设一个 Workload-1 他仅仅调用了 Service-1/Service-2 两个服务，但是大部份的 XDS Server 都会将全量的 Service 推送给 Workload-1 的 Sidecar。这样子带来的后果就是每个 Sidecar 的内存、资源消耗会随着服务量级的增长而增长。

![](../images/release-v1.18/envoy-sideacr-xds-memory.png)

为了解决上述问题。社区在 1.18.0-beta 版本中实现了 Envoy XDS 中的 [OCDS 能力](https://www.envoyproxy.io/docs/envoy/latest/configuration/http/http_filters/on_demand_updates_filter)。默认只推送全量的 VHDS 到 Sidecar 中，Cluster/Endpoint 资源根据实际请求进行按需加载。

- 需要搭配 [polaris-controller v1.7.0-beta](https://github.com/polarismesh/polaris-controller/releases/tag/v1.7.0-beta) 版本一起使用

#### 支持 Mesh Sidecar 场景下的分布式限流

在 1.18.0-beta 版本中，我们针对 Mesh Sidecar 的场景，支持将 Polaris 的分布式限流通过由 Polaris-Sidecar 组件实现的 RLS 提供给 Envoy 的限流 Filter，使得用户在 Mesh 场景下可以享受 Polaris 的分布式限流能力

- 需要搭配 [polaris-controller v1.7.0-beta](https://github.com/polarismesh/polaris-controller/releases/tag/v1.7.0-beta) 版本一起使用

#### 配置中心支持灰度发布

为了让用户有更好的配置中心使用体验，社区在 v1.18.0-beta 版本中支持配置灰度能力，当前灰度能力支持用户自定义客户端标签进行灰度控制下发；针对存量老版本客户端仅支持根据客户端IP进行灰度控制台下发。

## 版本变化

### 特性

- [[PR #1175]](https://github.com/polarismesh/polaris/pull/1175) feat(xds): add OutlierDetection and HealthCheck
- [[PR #1174]](https://github.com/polarismesh/polaris/pull/1174) feat:support push envoy rls filter xds
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
- [[PR #1212]](https://github.com/polarismesh/polaris/pull/1212) 修复清理软删除实例时没有同步清理 instance_metadata 以及 health_check 表的数据
- [[PR #1213]](https://github.com/polarismesh/polaris/pull/1214) 修复xDS 生成 cacheKey 时缺失 gatewayService
- [[PR #1201]](https://github.com/polarismesh/polaris/pull/1216) 修复 arm64 环境无法使用 docker image
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

**Full Changelog**: https://github.com/polarismesh/polaris/compare/v1.17.8...v1.18.0-alpha

## 参与 PolarisMesh 社区

欢迎大家使用体验、Star、Fork、Issue，也欢迎大家参与 PolarisMesh 开源共建！

仓库地址：https://github.com/polarismesh/polaris

项目文档： https://polarismesh.cn/#/

往期发布：https://github.com/polarismesh/polaris/releases