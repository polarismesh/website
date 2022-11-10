---
title: "使用 Spring Boot"
linkTitle: "使用 Spring Boot"
weight: 3
---


## 功能简介

Spring Boot是一个构建在Spring框架顶部的项目。它提供了一种简便，快捷的方式来设置，配置和运行基于Web的简单应用程序，为了方便 Spring Boot 用户快速接入北极星，我们通过以下几个示例帮助用户如何在 Spring Boot 中体验北极星的相关功能。

## 快速入门

### 前提条件

您需要先下载 Polaris Server，具体操作参见 [Polaris 服务端安装](/docs/快速入门/安装服务端/安装单机版)

### 确定 Spring Boot 版本

##### 确认自己项目的 Spring Boot 版本

```bash
➜  mvn dependency:tree  | grep "org.springframework.boot:spring-boot-starter:jar"
[INFO] |  +- org.springframework.boot:spring-boot-starter:jar:2.6.9:compile
```

根据命令查询到的 `spring boot` 版本信息，我们在根据下面的版本列表对应关系选择合适的 Spring Boot 以及 Spring Boot Polaris 版本

##### 版本列表

这里列出了不同 Spring Boot 版本相对应的 Spring Boot Polaris 版本。
您需要先查看您当前使用的 Spring Boot 版本，从而确定需要引入的 Spring Boot Polaris 版本。


| Spring Boot 兼容版本 | Spring Boot Polaris 版本 |
| -------------------- | ------------------------ |
| 2.4.x                | 1.1.0                    |


接下来所有的示例我们将基于 Spring Boot 版本为 2.4.3、Spring Boot Polaris 版本为 1.1.0 开展。

