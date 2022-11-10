---
title: "使用 Java Agent"
linkTitle: "使用 Java Agent"
weight: 3
---

## 功能简介

对于Java应用，北极星 SDK 可以被通过字节码注入的方式，集成到开发框架内部，如果用户使用开发框架，不需要显式地引入北极星 SDK，只需要在启动时，通过-javaagent的指令加载使用JavaAgent，即可无缝接入北极星。

当前支持以下框架的JavaAgent扩展：

- [Spring Cloud](https://github.com/Tencent/spring-cloud-tencent)
- [Dubbo](https://github.com/polarismesh/dubbo-java-polaris)

## JavaAgent如何集成北极星

北极星会通过字节码注入的方式，将北极星的SDK，作为插件注入到服务框架原生的扩展接口之上，从而接入北极星服务端实现服务发现、服务治理、配置管理等能力。

![](../图片/javaagent集成.png)

用户无需修改POM，只需要在启动Java程序时，加入javaagent的JVM启动参数就可以。

```shell
java -javaagent:polaris-java-agent-bootstrap-${version}.jar -jar xxx.jar
```



