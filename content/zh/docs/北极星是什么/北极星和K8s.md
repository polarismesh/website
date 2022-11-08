---
title: "北极星和k8s"
linkTitle: "北极星和k8s"
weight: 103
---


## k8s service

![k8s-service](../图片/北极星和k8s/k8s-service.png)

k8s 通过 service 提供服务发现和负载均衡功能：

- 用户创建 service，service 通过标签绑定相应的 pod，每个 service 关联一个 cluster ip
- k8s 先依赖 kubedns、coredns 或者其他 dns 插件，将 service 解析成 cluster ip
- 再通过 iptables 或者 IPVS，将 cluster ip 的请求转发给相应的 pod

k8s service 当前的实现存在不足之处：

- 当 service 超过一定数量时，iptables 和 IPVS 存在性能问题，不适合大体量的业务
- iptables 和 IPVS 支持的负载均衡算法有限，在内核里实现，无法在应用层扩展
- 不提供动态路由、熔断降级、访问限流、访问鉴权等常用的服务治理功能
- 不兼容 spring cloud 等微服务框架的服务注册和发现方式，无法打通

## 在k8s上使用北极星

![k8s-polaris](../图片/北极星和k8s/k8s-polaris.png)

使用北极星补充 k8s 的服务发现和治理功能：

- 既支持 k8s service 自动注册，也支持使用 SDK 和框架进行注册，两者统一管理
- 除了 k8s 原有的 DNS 访问方式，还支持高性能和无侵入两种服务网格方案
- 高性能服务网格提供多语言 SDK，以及常用框架和北极星 SDK 的集成
- 无侵入服务网格提供 Sidecar，业务不需要依赖 SDK 或者框架
