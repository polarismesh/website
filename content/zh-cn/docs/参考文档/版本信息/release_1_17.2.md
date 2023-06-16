---
title: "Release v1.17.2"
linkTitle: "Release v1.17.2"
weight: 1
---

## 下载地址

- [Github Release v1.17.2](https://github.com/polarismesh/polaris/releases/tag/v1.17.2)

## 特性说明

#### 配置文件支持加密

配置文件中经常会涉及一些敏感信息，例如帐号密码等参数。这时需对这些敏感信息进行加密，提供信息安全性。因此在 1.17.2 版本中配置中心正式支持配置加密功能，进一步提升配置中心的功能完备性。具体使用文档参考 [配置加密](/docs/使用指南/控制台使用/配置中心/配置加密/)

启用该能力的配置文件示例

```yaml
plugin:
  crypto:
    entries:
      # 配置加密功能中，服务端提供的加密算法插件配置
      - name: AES
```

#### 支持集群部署不依赖 Redis 能力正式发布

在 1.17.2 中社区正式提供北极星集群部署的去 redis 组件的集群部署方案，方便用户快速搭建北极星，减低使用北极星的成本。

启用该能力的配置文件示例

```yaml
healthcheck:
  open: true
  service: polaris.checker
  slotNum: 30
  minCheckInterval: 1s
  maxCheckInterval: 30s
  clientReportInterval: 120s
  batch:
    heartbeat:
      open: true
      queueSize: 10240
      waitTime: 32ms
      maxBatchCount: 32
      concurrency: 64
  checkers:
    - name: heartbeatLeader
```

#### 北极星存储层支持 Postgresql (实验性)

在 1.17.2 中, 社区开发者 [@bingxindan](https://github.com/bingxindan) 带了存储层基于 **postgresql** 的支持, 可通过引入 [store-postgresql](https://github.com/polaris-contrib/store-postgresql) 插件自编译开启存储层使用 **postgresql** 的特性。

{{< note >}}
该特性目前处于 **实验性** 状态, 还未达到生产可用状态, 在使用中有任何问题可以在[插件仓库](https://github.com/polaris-contrib/store-postgresql)中提 ISSUE 进行反馈
{{</ note >}}

#### 北极星协议层支持 Nacos 2.x 注册发现 (实验性)

在 1.17.2 中, 社区开发者 [@chatless](https://github.com/chatless) 带了协议层对 **nacos2.x** 的支持, 可通过引入 [apiserver-nacos](https://github.com/polaris-contrib/apiserver-nacos) 插件自编译开启协议层支持 **nacos2.x** 客户端接入的特性。

{{< note >}}
该特性目前处于 **实验性** 状态, 还未达到生产可用状态, 在使用中有任何问题可以在[插件仓库](https://github.com/polaris-contrib/apiserver-nacos)中提 ISSUE 进行反馈
{{</ note >}}

## What's Changed

### Feature

- [[PR #1124](https://github.com/polarismesh/polaris/pull/1124)] Support configuration encryption function
- [[PR #1126](https://github.com/polarismesh/polaris/pull/1126)] 解耦AuthServer，将功能拆解到UserOperator及StrategyOperator
- [[PR #1135](https://github.com/polarismesh/polaris/pull/1135)] Add support for config upsert and publish

### Enhancement

- [[PR #1131](https://github.com/polarismesh/polaris/pull/1130)] Support sending the last heartbeat health time of the instance to the data plane 
- [[PR #1137](https://github.com/polarismesh/polaris/pull/1137)] Optimize store layer error code return and instance query cache
- [[PR #1141](https://github.com/polarismesh/polaris/pull/1141)] docs(update): 完善OpenAPI swagger 文档
- [[PR #1147](https://github.com/polarismesh/polaris/pull/1147)] optimize the code style of the configuration center

### BugFix

- [[PR #1143](https://github.com/polarismesh/polaris/pull/1143)] fix:hotfix remove user mobile and email
- [[PR #1144](https://github.com/polarismesh/polaris/pull/1144)] doc：CircuitBreakerStore文档注释错误
- [[PR #1151](https://github.com/polarismesh/polaris/pull/1151)] Fix the failure of the metrics function after restarting the container
- [[PR #1155](https://github.com/polarismesh/polaris/pull/1155)] The server nil panic problem after the health check function is turned off

## New Contributors
* @KarKLi made their first contribution in https://github.com/polarismesh/polaris/pull/1126
* @fabian4 made their first contribution in https://github.com/polarismesh/polaris/pull/1135
* @baker-yuan made their first contribution in https://github.com/polarismesh/polaris/pull/1144
* @Asher-Wall made their first contribution in https://github.com/polarismesh/polaris/pull/1141

**Full Changelog**: https://github.com/polarismesh/polaris/compare/v1.17.1...v1.17.2

## 参与 PolarisMesh 社区

欢迎大家使用体验、Star、Fork、Issue，也欢迎大家参与 PolarisMesh 开源共建！

仓库地址：https://github.com/polarismesh/polaris

项目文档： https://polarismesh.cn/#/

往期发布：https://github.com/polarismesh/polaris/releases