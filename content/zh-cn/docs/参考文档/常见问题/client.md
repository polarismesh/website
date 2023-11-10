---
title: "客户端相关"
linkTitle: "客户端相关"
weight: 1
---

#### 北极星如何采集业务的服务调用监控信息

- 北极星业务监控指标是由 Polaris SDK 直接和 Prometheus 服务端进行数据通信
- Prometheus 感知 Polaris SDK 的方式借助了 Prometheus Service Discovery 能力，当选择 Polaris SDK 通过 Pull 模式上报监控数据时，北极星服务端能够感知到当前所有处于运行状态的 Polaris SDK 实例，然后通过 Prometheus Service Discovery 的方式通知到 Prometheus。

#### 在北极星监控页面看不到服务调用指标

> 排查点 1: 客户端是否开启了相关监控上报的功能开关

监控功能开关如何开启请参考各语言客户端中的可观测性章节

- [Spring Cloud Tencent](https://github.com/Tencent/spring-cloud-tencent/wiki/%E7%9B%91%E6%8E%A7%E6%95%B0%E6%8D%AE%E4%B8%8A%E6%8A%A5)
- [Polaris Java](/docs/使用指南/java应用开发/sdk/可观测性/)
- [Polaris Go](/docs/使用指南/go应用开发/sdk/可观测性/)

> 排查点 2: 确认主调方是否有执行服务调用结果上报

- 当前北极星的服务调用监控依赖主调方主动上报，因此需要确认业务应用的主调方 (Consumer) 是否引入了北极星相关客户端依赖，比如 Polaris Java、Polaris Go、Spring Cloud Tencent、DubboGo Polaris 等等
- 如果用户是直接使用 Polaris Java、Polaris Go, 则需要自行调用 ConsumerAPI 中的 UpdateServiceCallResult 方法完成服务调用监控数据上报
  - [Polaris Java](/docs/使用指南/java应用开发/sdk/可观测性/)
  - [Polaris Go](/docs/使用指南/go应用开发/sdk/可观测性/)

> 排查点 3: 确认 prometheus、pushgateway 组件是否部署以及是否正常运行

- 单机版安装包已经包括了 prometheus、pushgateway 组件, 开箱即用, 如果是虚拟机部署的, 当虚拟机重启时，需要自行启动每个相关组件进程。
- 集群版安装时，用户需要自己部署生产可用的 prometheus、pushgateway 集群，请参考[集群部署文-监控组件安装](/docs/使用指南/服务端安装/集群版安装/#安装监控组件)

> 排查点 4: prometheus 指标采集分为了两种: Pull 模式以及 Push 模式，需要根据自己的网络情况合理选择 pull 模式或者 push 模式

![123](../image/polaris-client-metrics.png)
 
