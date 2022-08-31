# SpringCloud应用接入

  - [功能简介](#功能简介)
  - [快速入门](#快速入门)
    - [前提条件](#前提条件)
    - [确定 Spring Cloud 版本](#确定-spring-cloud-版本)
      - [确认自己项目的 Spring Boot 版本](#确认自己项目的-spring-boot-版本)
      - [版本列表](#版本列表)
    - [服务注册](#服务注册)
    - [服务发现](#服务发现)
    - [动态配置](#动态配置)
    - [服务路由](#服务路由)
      - [服务提供者](#服务提供者)
      - [服务调用者](#服务调用者)
    - [服务限流](#服务限流)
    - [服务熔断](#服务熔断)
      - [服务提供者](#服务提供者-1)
      - [服务调用者](#服务调用者-1)
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
| 2.6.x                | 2021.0.3          | 1.7.0-2021.0.3-SNAPSHOT   |
| 2.4.x, 2.5.x         | 2020.0.5          | 1.7.0-2020.0.5-SNAPSHOT   |
| 2.2.x, 2.3.x         | Hoxton.SR12       | 1.7.0-Hoxton.SR12         |
| 2.1.x                | Greenwich.SR6     | 1.5.3-Greenwich.SR6       |


接下来所有的示例我们将基于 Spring Cloud 版本为 2021.0.3、Spring Cloud Tencent 版本为 1.7.0-2021.0.3-SNAPSHOT 开展。

### 服务注册

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现 Spring Cloud 服务注册到北极星中。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 简单的 Spring Cloud Web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Cloud Tencent 的服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
    </dependencies>

    ...

</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springcloudpolarisquickstart
│               └── SpringCloudProviderApplication.java
└── resources
    └── application.yml
```

```yaml
server:
  port: 28888
spring:
  application:
    name: EchoServer

  cloud:
    polaris:
      address: grpc://127.0.0.1:8091
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 28082
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudProviderApplication {

    @RestController
    static class EchoController {

        private final PolarisDiscoveryProperties properties;

        EchoController(PolarisDiscoveryProperties properties) {
            this.properties = properties;
        }

        @GetMapping(value = "/echo/{string}")
        public String echo(@PathVariable String string) {
            return "Hello PolarisMesh " + string + ", I'm " + properties.getService();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudProviderApplication.class, args);
    }
}
```

##### 验证

1. 启动 Spring Cloud 应用
2. 在 Spring Cloud 启动日志中，找到如下日志信息, 则表示 Spring Cloud 应用已经成功注册到北极星中。

```log
polaris registry, default EchoServer 10.21.6.17:28888 {} register finished
```

2. 可以通过 curl 命令查询服务端是否有该实例。

```bash
curl --location --request POST '127.0.0.1:8090/v1/Discover' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": 1,
    "service": {
        "name": "EchoServer",
        "namespace": "default"
    }
}'
```

### 服务发现


##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现通过 Feign 或者 RestTemplate 完成服务调用。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 简单的 Spring Cloud Web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Cloud Tencent 的服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
    </dependencies>

    ...

</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── spingcloudpolarisconsumer
│               └── SpringCloudConsumerApplication.java
└── resources
    └── application.yaml
```

```yaml
server:
  port: 38888
spring:
  application:
    name: EchoConsumer

  cloud:
    polaris:
      address: grpc://127.0.0.1:8091
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 38082
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudConsumerApplication.class, args);
    }

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @RestController
    class EchoController {

        private final RestTemplate template;

        EchoController(RestTemplate template) {
            this.template = template;
        }

        @RequestMapping(value = "/echo/{string}", method = RequestMethod.GET)
        public String echo(@PathVariable String val) {
            return template.getForObject("http://EchoServer/echo/" + val, String.class);
        }
    }
}
```

##### 验证

通过 curl 命令查询服务端是否有该实例。

```bash
curl --location --request GET '127.0.0.1:38888/echo?value=SCT'
```

预期的结果如下

```
Hello PolarisMesh SCT, I'm EchoServer
```

### 动态配置


##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-config** 实现 Spring Cloud 配置的动态管理。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.10</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>2021.0.3</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        ...

        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-config</artifactId>
        </dependency>

        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-bootstrap</artifactId>
        </dependency>
    </dependencies>

    ...
</project>
```


##### 配置 bootstrap.yaml 

在 resources 目录下创建 bootstrap.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springcloudtencentconfigdemo
│               └── SpringCloudTencentConfigDemoApplication.java
└── resources
    └── bootstrap.yml
```

```yaml
server:
  port: 48084
spring:
  application:
    name: ConfigExample
  cloud:
    polaris:
      address: grpc://127.0.0.1:8091
      namespace: default
      config:
        auto-refresh: true # auto refresh when config file changed
        groups:
          - name: ${spring.application.name} # group name
            files: [ "config/user.properties" ]
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudTencentConfigDemoApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudTencentConfigDemoApplication.class, args);
    }

    @RestController
    @RefreshScope
    public static class UserController{

        @Value("${name}")
        private String name;

        @GetMapping(value = "/name")
        public String name() {
            return name;
        }
    }
}
```

##### 创建配置分组以及配置文件

- 创建配置分组 ConfigExample
- 创建配置文件 `config/user.properties`

![](./图片/springcloud%E6%8E%A5%E5%85%A5-%E5%88%9B%E5%BB%BA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)

- 编辑并发布配置文件 `config/user.properties`

![](./图片/springcloud%E6%8E%A5%E5%85%A5-%E5%8F%91%E5%B8%83%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)


##### 验证

1. 调用 curl --location --request GET '127.0.0.1:48084/name' 查看返回值，预期返回 `polarismesh`
2. 在线修改配置并发布

![](./图片/springcloud接入-修改配置文件.png)

3. 调用 curl --location --request GET '127.0.0.1:48084/name' 查看返回值，预期返回 `polarismesh@2021`


### 服务路由

#### 服务提供者

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现 Spring Cloud 服务注册到北极星中。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 简单的 Spring Cloud Web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Cloud Tencent 的服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
    </dependencies>

    ...

</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springcloudpolarisquickstart
│               └── SpringCloudProviderApplication.java
└── resources
    └── application.yml
```

```yaml
server:
  port: 28888
spring:
  application:
    name: RouterEchoServer

  cloud:
    tencent:
      metadata:
        content:
          env: dev1

    polaris:
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 28082
      address: grpc://127.0.0.1:8091
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudProviderApplication {

    @RestController
    static class EchoController {

        private final PolarisDiscoveryProperties properties;

        EchoController(PolarisDiscoveryProperties properties) {
            this.properties = properties;
        }

        @GetMapping(value = "/echo/{string}")
        public String echo(@PathVariable String string) {
            return "Hello PolarisMesh " + string + ", I'm " + properties.getService() + ":" + properties.getPort();
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudProviderApplication.class, args);
    }
}
```

##### 运行

1. 执行 mvn clean install 构建出 jar 运行包
2. 按照以下命令启动两个服务提供者进程

> 启动第一个服务提供者

```bash
java  -Dspring.cloud.tencent.metadata.content.env=dev1 -Dserver.port=20001 -Dspring.cloud.polaris.stat.port=21001 -jar xxx.jar 
```

> 启动第二个服务提供者

```bash
java  -Dspring.cloud.tencent.metadata.content.env=dev2 -Dserver.port=20002 -Dspring.cloud.polaris.stat.port=21002 -jar xxx.jar 
```

##### 确认实例注册情况

执行以下命令，查看该服务下的实例信息

```bash
curl --location --request POST '127.0.0.1:8090/v1/Discover' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": 1,
    "service": {
        "name": "RouterEchoServer",
        "namespace": "default"
    }
}'
```

#### 服务调用者

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现 Spring Cloud 服务注册到北极星中。
- 引入 **spring-cloud-starter-tencent-polaris-router** 实现 Spring Cloud 的服务路由。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 简单的 Spring Cloud Web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Cloud Tencent 的服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
        <!-- 引入 Spring Cloud Tencent 的服务路由依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-router</artifactId>
        </dependency>
    </dependencies>
    ...
</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springcloudpolarisquickstart
│               └── SpringCloudConsumerApplication.java
└── resources
    └── application.yml
```

```yaml
server:
  port: 38888
spring:
  application:
    name: RouterEchoConsumer
  cloud:
    polaris:
      address: grpc://127.0.0.1:8091
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 38082
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudConsumerApplication.class, args);
    }

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @RestController
    static class EchoController {

        private final RestTemplate restTemplate;

        EchoController(RestTemplate restTemplate) {
            this.restTemplate = restTemplate;
        }

        @GetMapping(value = "/echo")
        public String echo(@RequestHeader HttpHeaders headers, @RequestParam(name = "value") String val) {
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange("http://RouterEchoServer/echo/" + val, HttpMethod.GET, entity, String.class);
            return response.getBody();
        }
    }
}
```

##### 设置 RouterEchoServer 的被调路由规则

![](./图片/springcloud%E6%8E%A5%E5%85%A5-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E8%B7%AF%E7%94%B1%E8%A7%84%E5%88%99.png)

##### 验证

- 携带 http header 信息为 'env: dev1'，可以观察到所有的请求只可被端口为20001的服务进程进行响应

```
➜  ~ curl -H 'env: dev1' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
➜  ~ curl -H 'env: dev1' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
➜  ~ curl -H 'env: dev1' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
➜  ~ curl -H 'env: dev1' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
```


- 携带 http header 信息为 'env: dev2'，可以观察到所有的请求可被任意一个服务提供者进程进行响应

```
➜  ~ curl -H 'env: dev2' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
➜  ~ curl -H 'env: dev2' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20002%
➜  ~ curl -H 'env: dev2' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
➜  ~ curl -H 'env: dev2' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20002%
➜  ~ curl -H 'env: dev2' http://127.0.0.1:38888/echo\?value\=hello
Hello PolarisMesh hello, I'm RouterEchoServer:20001%
```

### 服务限流


##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现通过 Feign 或者 RestTemplate 完成服务调用。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.11</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        ...
        <!-- 北极星服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
        <!-- 北极星服务限流依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-ratelimit</artifactId>
        </dependency>
        ...
    </dependencies>
    ...

</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── spingcloudpolarisratelimit
│               └── SpringCloudRateLimitApplication.java
└── resources
    └── application.yaml
```

```yaml
server:
  port: 38888
spring:
  application:
    name: RateLimitEchoServer

  cloud:
    polaris:
      address: grpc://127.0.0.1:8091
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 38082
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudRateLimitApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudRateLimitApplication.class, args);
    }

    @RestController
    static class EchoController {

        @GetMapping(value = "/echo")
        public String echo() {
            return "Hello PolarisMesh , I'm RateLimit Demo";
        }
    }
}
```

##### 配置限流规则

为服务 `EchoServer` 创建一条限流规则

![](./图片/springcloud接入-创建限流规则.png)

##### 验证

通过 curl 命令快速发起多次查询，查看是否触发限流

```bash
curl --location --request GET '127.0.0.1:38888/echo'
```

预期的结果如下

```
➜  curl --location --request GET '127.0.0.1:38888/echo'
Hello PolarisMesh , I'm RateLimit Demo%
➜  curl --location --request GET '127.0.0.1:38888/echo'
The request is denied by rate limit because the throttling threshold is reached%
➜  curl --location --request GET '127.0.0.1:38888/echo'
Hello PolarisMesh , I'm RateLimit Demo%
```


### 服务熔断

#### 服务提供者

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现 Spring Cloud 服务注册到北极星中。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...

    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 简单的 Spring Cloud Web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Cloud Tencent 的服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
    </dependencies>

    ...

</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springcloudpolarisquickstart
│               └── SpringCloudProviderApplication.java
└── resources
    └── application.yml
```

```yaml
server:
  port: 28888
spring:
  application:
    name: CircuitBreakerEchoServer

  cloud:
    tencent:
      metadata:
        content:
          env: dev1

    polaris:
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 28082
      address: grpc://127.0.0.1:8091
```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudProviderApplication {

    @RestController
    static class EchoController {

        private final PolarisDiscoveryProperties properties;

        EchoController(PolarisDiscoveryProperties properties) {
            this.properties = properties;
        }

        @GetMapping(value = "/echo/{string}")
        public ResponseEntity<String> echo(@PathVariable String string) {
            String badService = System.getProperty("BAD_SERVICE");
            if (Objects.equals(badService, "true")) {
                return new ResponseEntity<>("I'm bad, " + properties.getService() + ":" + properties.getPort(), HttpStatus.BAD_GATEWAY);
            }

            String val = "Hello PolarisMesh " + string + ", I'm " + properties.getService() + ":" + properties.getPort();
            return new ResponseEntity<>(val, HttpStatus.OK);
        }
    }

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudProviderApplication.class, args);
    }
}

```

##### 运行

1. 执行 mvn clean install 构建出 jar 运行包
2. 按照以下命令启动两个服务提供者进程

> 启动第一个服务提供者

```bash
java -DBAD_SERVICE=false -Dserver.port=20001 -Dspring.cloud.polaris.stat.port=21001 -jar xxx.jar 
```

> 启动第二个服务提供者

```bash
java -DBAD_SERVICE=true -Dserver.port=20002 -Dspring.cloud.polaris.stat.port=21002 -jar xxx.jar 
```

##### 确认实例注册情况

执行以下命令，查看该服务下的实例信息

```bash
curl --location --request POST '127.0.0.1:8090/v1/Discover' \
--header 'Content-Type: application/json' \
--data-raw '{
    "type": 1,
    "service": {
        "name": "CircuitBreakerEchoServer",
        "namespace": "default"
    }
}'
```

#### 服务调用者

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 Spring Cloud 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现 Spring Cloud 服务注册到北极星中。
- 引入 **spring-cloud-starter-tencent-polaris-circuitbreaker** 实现 Spring Cloud 的服务调用熔断。


```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 https://maven.apache.org/xsd/maven-4.0.0.xsd">
    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>2.6.9</version>
        <relativePath/> <!-- lookup parent from repository -->
    </parent>
    ...
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.cloud</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <version>1.7.0-2021.0.3-SNAPSHOT</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>

            <dependency>
                <groupId>org.springframework.cloud</groupId>
                <artifactId>spring-cloud-dependencies</artifactId>
                <version>2021.0.3</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>

    <dependencies>
        <!-- 简单的 Spring Cloud Web 依赖 -->
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>

        <!-- 引入 Spring Cloud Tencent 的服务注册发现依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
        </dependency>
        <!-- 引入 Spring Cloud Tencent 的服务熔断依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-circuitbreaker</artifactId>
        </dependency>
        <!-- 引入 Spring Cloud 的 LoadBalancer 定义 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-loadbalancer</artifactId>
        </dependency>
    </dependencies>
    ...
</project>
```

##### 配置 application.yaml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── springcloudpolarisquickstart
│               └── SpringCloudConsumerApplication.java
└── resources
    └── application.yml
```

```yaml
server:
  port: 38888
spring:
  application:
    name: CircuitBreakerEchoConsumer
  cloud:
    polaris:
      address: grpc://127.0.0.1:8091
      discovery:
        enabled: true
      stat:
        enabled: true
        port: 38082
    loadbalancer:
      configurations: polaris
    tencent:
      rpc-enhancement:
        enabled: true
        reporter:
          ignore-internal-server-error: true
          series: server_error
          statuses: gateway_timeout, bad_gateway, service_unavailable


```

##### 示例代码

```java
@SpringBootApplication
public class SpringCloudConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudConsumerApplication.class, args);
    }

    @LoadBalanced
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }

    @RestController
    static class EchoController {

        private final RestTemplate restTemplate;

        EchoController(RestTemplate restTemplate) {
            this.restTemplate = restTemplate;
        }

        @GetMapping(value = "/echo")
        public String echo(@RequestHeader HttpHeaders headers, @RequestParam(name = "value") String val) {
            HttpEntity<String> entity = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange("http://CircuitBreakerEchoServer/echo/" + val, HttpMethod.GET, entity, String.class);
            return response.getBody();
        }
    }
}
```

##### 设置 CircuitBreakerEchoServer 的被调熔断规则

![](./图片/springcloud接入-创建服务熔断规则.png)

##### 验证

- 快速发起多次 curl 命令调用，出现过几次错误请求响应之后，所有的请求将全部由端口为20001的进程进行响应

```
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
I'm bad, EchoServer:20002%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
I'm bad, EchoServer:20002%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
I'm bad, EchoServer:20002%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
Hello PolarisMesh hello, I'm EchoServer:20001%
➜  ~ curl --location --request GET '127.0.0.1:38888/echo?value=hello'
```