---
title: "SpringBoot应用接入"
linkTitle: "SpringBoot应用接入"
weight: 312
---

## 功能简介

Spring Boot是一个构建在Spring框架顶部的项目。它提供了一种简便，快捷的方式来设置，配置和运行基于Web的简单应用程序，为了方便 Spring Boot 用户快速接入北极星，我们通过以下几个示例帮助用户如何在 Spring Boot 中体验北极星的相关功能。

## 快速入门

### 前提条件

您需要先下载 Polaris Server，具体操作参见 [Polaris 服务端安装](../快速入门/安装服务端/%E5%AE%89%E8%A3%85%E5%8D%95%E6%9C%BA%E7%89%88.md)

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

## 服务注册

##### 初始化项目

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Boot Polaris 相关依赖。

- 引入 **spring-boot-polaris-dependencies** 进行管理 Spring Boot Polaris 相关组件的依赖版本。
- 引入 **spring-boot-polaris-discovery-starter** 实现 Spring Boot 服务注册到北极星中。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.polaris</groupId>
                <artifactId>spring-boot-polaris-dependencies</artifactId>
                <version>1.1.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Boot Polaris Discovery 依赖用于实现服务注册 -->
        <dependency>
            <groupId>com.tencent.polaris</groupId>
            <artifactId>spring-boot-polaris-discovery-starter</artifactId>
        </dependency>
    </dependencies>
    ...
</project>

```

##### 配置 application.properties 

在 resources 目录下创建 application.properties 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springbootpolarisprovider
│               └── SpringbootProviderApplication.java
└── resources
    └── application.properties
```

```properties
server.port=28888
spring.application.name=BootEchoServer
polaris.address=grpc://127.0.0.1:8091
polaris.discovery.register.enable=true
```

##### 实例代码

```java
```java
@SpringBootApplication
public class SpringbootProviderApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootProviderApplication.class, args);
    }

    @RestController
    static class EchoController {

        private final PolarisDiscoveryProperties properties;

        EchoController(PolarisDiscoveryProperties properties) {
            this.properties = properties;
        }

        @GetMapping(value = "/echo/{string}")
        public String echo(@PathVariable String string) {
            return "Hello PolarisMesh " + string + ", I'm " + properties.getApplicationName();
        }
    }
}
```

##### 验证

1. 启动 Spring Boot 应用
2. 在 Spring Boot 启动日志中，找到如下日志信息, 则表示 Spring Boot 应用已经成功注册到北极星中。

```log
[Polaris] success to register instance 127.0.0.1:28888, service is BootEchoServer, namespace is default
[Polaris] success to schedule heartbeat instance 127.0.0.1:28888, service is BootEchoServer, namespace is default
```

2. 可以通过 curl 命令查询服务端是否有该实例。

```bash
curl --location --request POST '127.0.0.1:8090/v1/Discover' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": 1,
    "service": {
        "name": "BootEchoServer",
        "namespace": "default"
    }
}'
```

## 服务发现

### 引入 Spring Cloud Tencent

如果您当前的 Spring Boot 应用还未引入任何 Spring Cloud 依赖，可以将 Spring Boot 调整为 Spring Cloud 项目，使用 Spring
Cloud Tencent 中的服务发现能力。

参考文档：[Spring Cloud 应用接入](https://polarismesh.cn/zh/doc/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/SpringCloud%E5%BA%94%E7%94%A8%E6%8E%A5%E5%85%A5.html#springcloud%E5%BA%94%E7%94%A8%E6%8E%A5%E5%85%A5)

### 使用 Spring Boot Polaris Feign

##### 初始化项目

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Boot Polaris 相关依赖。

- 引入 **spring-boot-polaris-dependencies** 进行管理 Spring Boot Polaris 相关组件的依赖版本。
- 引入 **spring-boot-polaris-discovery-starter** 实现发现北极星中的服务并进行远程调用。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.4.3</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.polaris</groupId>
                <artifactId>spring-boot-polaris-dependencies</artifactId>
                <version>1.1.0</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Boot Polaris Discovery 依赖用于实现服务注册 -->
        <dependency>
            <groupId>com.tencent.polaris</groupId>
            <artifactId>spring-boot-polaris-discovery-starter</artifactId>
        </dependency>
    </dependencies>
    ...
</project>

```

##### 配置 application.properties 

在 resources 目录下创建 application.properties 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springbootpolarisconsumer
│               └── SpringbootConsumerApplication.java
└── resources
    └── application.properties
```

```properties
server.port=38888
spring.application.name=BootEchoConsumer
polaris.address=grpc://127.0.0.1:8091
polaris.discovery.register.enable=true
```

##### 示例代码

```java
@SpringBootApplication
public class SpringbootconsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringbootconsumerApplication.class, args);
    }

    @RestController
    static class EchoController {

        private final PolarisFeignBuilder targetBuilder;

        EchoController(PolarisFeignBuilder targetBuilder) {
            this.targetBuilder = targetBuilder;
        }

        @GetMapping(value = "/echo")
        public String echo(@RequestParam(name = "value") String val) {
            EchoServer echoServerBoot = Feign.builder().decoder(new StringDecoder())
                    .addCapability(targetBuilder.buildCircuitBreakCapability())
                    .target(targetBuilder.buildTarget(EchoServer.class,
                            PolarisFeignOptions.build().withService("BootEchoServer")));
            return echoServerBoot.echo(val);
        }
    }

    public interface EchoServer {

        @RequestLine("GET /echo/{value}")
        String echo(@Param("value") String value);
    }
}
```

##### 验证

通过 curl 命令对服务消费者发起调用。

```bash
curl --location --request GET '127.0.0.1:38888/echo?value=hello'
```

预期的结果如下

```
Hello PolarisMesh hello, I'm BootEchoServer
```