---
title: "Release v1.17"
linkTitle: "Release v1.17"
weight: 2
---

## 下载地址

- [Github Release v1.17.0](https://github.com/polarismesh/polaris/releases/tag/v1.17.0)


## 特性说明

#### 支持集群部署不依赖 Redis（BETA）

为了减低中小公司在部署北极星时需要维护 redis 以及 mysql 组件所带来的运维工作量，在 1.17.0 中我们提供北极星集群部署的去 redis 组件的集群部署方案，方便用户快速搭建北极星，减低使用北极星的成本。

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

#### XDS 规则下发时支持服务别名

通过北极星的服务别名机制，支持将服务别名一并通过 XDS 的格式进行下发，解决 XDS 跨命名空间资源下发的问题

## What's Changed

### Feature

- [PR #1068](https://github.com/polarismesh/polaris/pull/1068) eureka注册发现支持命名空间隔离
- [PR #1070](https://github.com/polarismesh/polaris/pull/1070) feat:support service alias from xds
- [PR #1082](https://github.com/polarismesh/polaris/pull/1082) feat:support heartbeat without redis in cluster

### Enhancement

- [PR #1056](https://github.com/polarismesh/polaris/pull/1056) refactor admin job execute interval config
- [PR #1063](https://github.com/polarismesh/polaris/pull/1063) refactor: maintain rename to admin
- [PR #1065](https://github.com/polarismesh/polaris/pull/1065) refactor: service governance rule not bind service instance
- [PR #1066](https://github.com/polarismesh/polaris/pull/1066) 支持根据实例ID获取实例列表
- [PR #1079](https://github.com/polarismesh/polaris/pull/1079) 添加windows启动停止脚本
- [PR #1081](https://github.com/polarismesh/polaris/pull/1081) GetInstances接口过滤条件为可选
- [PR #1086](https://github.com/polarismesh/polaris/pull/1086) 修复高并发场景下鉴权CheckPermission方法导致内存溢出问题
- [PR #1099](https://github.com/polarismesh/polaris/pull/1099) add CleanDeletedClients admin-job

### BugFix

- [PR #1057](https://github.com/polarismesh/polaris/pull/1057) 修复有子目录的配置文件无法导入问题
- [PR #1060](https://github.com/polarismesh/polaris/pull/1060) fix:限流规则disable查询条件失效
- [PR #1076](https://github.com/polarismesh/polaris/pull/1076) fix:http 客户端接口鉴权行为保持和gRPC一致
- [PR #1085](https://github.com/polarismesh/polaris/pull/1085) Fix prometheus.yml bug
- [PR #1102](https://github.com/polarismesh/polaris/pull/1102) fix: remove standalone docker exec not exist shell

### Test

- [PR #1062](https://github.com/polarismesh/polaris/pull/1062) test: add polaris.checker health check unit test


## New Contributors
* @self-made-boy made their first contribution in https://github.com/polarismesh/polaris/pull/1068
* @kuwoo made their first contribution in https://github.com/polarismesh/polaris/pull/1085
* @vLiang486 made their first contribution in https://github.com/polarismesh/polaris/pull/1079
* @Sad-polar-bear made their first contribution in https://github.com/polarismesh/polaris/pull/1086

**Full Changelog**: https://github.com/polarismesh/polaris/compare/v1.16.4...v1.17.0

## 参与 PolarisMesh 社区

欢迎大家使用体验、Star、Fork、Issue，也欢迎大家参与 PolarisMesh 开源共建！

仓库地址：https://github.com/polarismesh/polaris

项目文档： https://polarismesh.cn/#/

往期发布：https://github.com/polarismesh/polaris/releases