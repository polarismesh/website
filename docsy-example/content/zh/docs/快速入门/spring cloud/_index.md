---
title: "Spring Cloud 应用接入"
linkTitle: "Spring Cloud 应用接入"
weight: 310
---


## 功能简介

Spring Cloud 是 Java 语言生态下的分布式微服务架构的一站式解决方案，为了方便 Spring Cloud 用户快速接入北极星，我们通过以下几个示例帮助用户如何在 Spring Cloud 中体验北极星的相关功能。

## 快速入门

### 前提条件

您需要先下载 Polaris Server，具体操作参见 [Polaris 服务端安装](../快速入门/安装服务端/%E5%AE%89%E8%A3%85%E5%8D%95%E6%9C%BA%E7%89%88.md)

### 确定 Spring Cloud 版本

##### 确认自己项目的 Spring Boot 版本

```bash
➜  mvn dependency:tree  | grep "org.springframework.boot:spring-boot-starter:jar"
[INFO] |  +- org.springframework.boot:spring-boot-starter:jar:2.6.9:compile
```

根据命令查询到的 `spring boot` 版本信息，我们在根据下面的版本列表对应关系选择合适的 Spring Cloud 以及 Spring Cloud Tencent 版本

##### 版本列表

这里列出了不同 Spring Cloud 版本相对应的 Spring Cloud Tencent 版本。
您需要先查看您当前使用的 Spring Cloud 版本，从而确定需要引入的 Spring Cloud Tencent 版本。


| Spring Boot 兼容版本 | Spring Cloud 版本 | Spring Cloud Tencent 版本 |
| -------------------- | ----------------- | ------------------------- |
| 2.6.x                | 2021.0.3          | 1.7.0-2021.0.3            |
| 2.4.x, 2.5.x         | 2020.0.5          | 1.7.0-2020.0.5            |
| 2.2.x, 2.3.x         | Hoxton.SR12       | 1.7.1-Hoxton.SR12         |
| 2.1.x                | Greenwich.SR6     | 1.5.3-Greenwich.SR6       |


接下来所有的示例我们将基于 Spring Cloud 版本为 2021.0.3、Spring Cloud Tencent 版本为 1.7.0-2021.0.3 开展。

