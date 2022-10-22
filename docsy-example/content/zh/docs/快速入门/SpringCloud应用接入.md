---
title: "SpringCloud应用接入"
linkTitle: "SpringCloud应用接入"
weight: 311
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
| 2.4.x, 2.5.x         | 2020.0.5          | 1.7.0-2020.0.5   |
| 2.2.x, 2.3.x         | Hoxton.SR12       | 1.7.1-Hoxton.SR12         |
| 2.1.x                | Greenwich.SR6     | 1.5.3-Greenwich.SR6       |


接下来所有的示例我们将基于 Spring Cloud 版本为 2021.0.3、Spring Cloud Tencent 版本为 1.7.0-2021.0.3 开展。

### 服务注册

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-boot-starter-web** 进行启动一个 Web 服务，Spring Cloud 的项目要完成服务注册首先的是一个 Web 服务。
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
                <version>1.7.0-2021.0.3</version>
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
    </dependencies>

    ...

</project>
```

##### 配置 application.yml 

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

配置 application.yml

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

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-discovery** 实现从北极星中发现服务。


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
                <version>1.7.0-2021.0.3</version>
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
        <!-- 引入 Feign 依赖实现 Feign 调用 -->
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-starter-openfeign</artifactId>
        </dependency>
    </dependencies>

    ...

</project>
```

##### 配置 application.yml 

在 resources 目录下创建 application.yml 文件，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── spingcloudpolarisconsumer
│               └── SpringCloudConsumerApplication.java
└── resources
    └── application.yml
```

配置 application.yml

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

> 基于 RestTemplate 的服务发现调用

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

> 基于 Feign 的服务发现调用

```java
@SpringBootApplication
@EnableFeignClients
public class SpringCloudPolarisConsumerApplication {

    public static void main(String[] args) {
        SpringApplication.run(SpringCloudPolarisConsumerApplication.class, args);
    }

    @RestController
    static class EchoController {

        private final EchoServerClient client;

        EchoController(EchoServerClient client) {
            this.client = client;
        }

        @GetMapping(value = "/echo")
        public String echo(@RequestParam(name = "value") String val) {
            return client.echo(val);
        }
    }

    @FeignClient(name = "EchoServer")
    public interface EchoServerClient {

        @GetMapping("/echo/{value}")
        String echo(@PathVariable("value") String value);
    }
}
```

##### 验证

通过 curl 命令对服务消费者发起调用。

```bash
curl --location --request GET '127.0.0.1:38888/echo?value=SCT'
```

预期的结果如下

```
Hello PolarisMesh SCT, I'm EchoServer
```

### 动态配置


##### 项目初始化

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

- 引入 **spring-cloud-tencent-dependencies** 进行管理 Spring Cloud Tencent 相关组件的依赖版本。
- 引入 **spring-cloud-starter-tencent-polaris-config** 实现 Spring Cloud 配置的动态管理。
- 引入 **spring-cloud-starter-bootstrap** 以便可以支持 bootstrap.yml 的识别与加载


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
                <version>1.7.0-2021.0.3</version>
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


##### 配置 bootstrap.yml 

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

配置 bootstrap.yml

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

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud%E6%8E%A5%E5%85%A5-%E5%88%9B%E5%BB%BA%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)

- 编辑并发布配置文件 `config/user.properties`

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud%E6%8E%A5%E5%85%A5-%E5%8F%91%E5%B8%83%E9%85%8D%E7%BD%AE%E6%96%87%E4%BB%B6.png)


##### 验证

1. 调用 curl --location --request GET '127.0.0.1:48084/name' 查看返回值，预期返回 `polarismesh`
2. 在线修改配置并发布

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud接入-修改配置文件.png)

3. 调用 curl --location --request GET '127.0.0.1:48084/name' 查看返回值，预期返回 `polarismesh@2021`


### 服务路由

#### 服务提供者

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

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
                <version>1.7.0-2021.0.3</version>
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
    </dependencies>

    ...

</project>
```

##### 配置 application.yml 

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

配置 application.yml

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

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

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
                <version>1.7.0-2021.0.3</version>
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
        <!-- 引入 Spring Cloud Tencent 的服务路由依赖 -->
        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-starter-tencent-polaris-router</artifactId>
        </dependency>
    </dependencies>
    ...
</project>
```

##### 配置 application.yml 

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

配置 application.yml

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

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud%E6%8E%A5%E5%85%A5-%E5%88%9B%E5%BB%BA%E6%9C%8D%E5%8A%A1%E8%B7%AF%E7%94%B1%E8%A7%84%E5%88%99.png)

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

### 单机服务限流


##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

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
                <version>1.7.0-2021.0.3</version>
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

##### 配置 application.yml 

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

配置 application.yml

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

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud接入-创建限流规则.png)

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


### 分布式服务限流

##### 安装北极星分布式限流服务端

具体操作参见 [Polaris 分布式限流服务端安装](./%E5%AE%89%E8%A3%85%E6%9C%8D%E5%8A%A1%E7%AB%AF/%E5%AE%89%E8%A3%85%E5%88%86%E5%B8%83%E5%BC%8F%E9%99%90%E6%B5%81%E6%9C%8D%E5%8A%A1.md)

##### 项目初始化

使用 jetbrain idea 等工具初始化一个 Spring Cloud 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

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
                <version>1.7.0-2021.0.3</version>
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

##### 配置 application.yml 

在 resources 目录下创建 application.yml 文件 文件以及 polaris.yml，并按照如下进行配置

```
.
├── java
│   └── com
│       └── example
│           └── spingcloudpolarisratelimit
│               └── SpringCloudRateLimitApplication.java
└── resources
    ├── polaris.yml
    └── application.yaml
```

配置 application.yml

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

配置 polaris.yml

```yaml
# 被调方配置
provider:
  rateLimit:
    # 是否开启限流功能
    enable: true
    # 限流服务的命名空间
    limiterNamespace: Polaris
    # 限流服务名
    limiterService: polaris.limiter
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

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud接入-创建分布式限流规则.png)

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

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

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
                <version>1.7.0-2021.0.3</version>
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
    </dependencies>

    ...

</project>
```

##### 配置 application.yml 

在 resources 目录下创建 application.yml，并按照如下进行配置

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

配置 application.yml

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

使用 jetbrain idea 等工具初始化一个 maven 项目

##### 引入依赖

在上一步初始化好一个 maven 项目之后，我们在 pom.xml 中引入 Spring Cloud Tencent 相关依赖。

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
                <version>1.7.0-2021.0.3</version>
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

##### 配置 application.yml 

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

配置 application.yml

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

![](../图片/springcloud%E6%8E%A5%E5%85%A5/springcloud接入-创建服务熔断规则.png)

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



## 常见问题(FAQ)

#### Spring Cloud 或者 Spring Cloud Tencent 的依赖无法拉到本地

- pom.xml 的 `<dependencyManagement></dependencyManagement>` 标签内部务必按照下面的示例加上。

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>org.springframework.cloud</groupId>
            <artifactId>spring-cloud-dependencies</artifactId>
            <version>${ Spring Cloud 的版本 }</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>

        <dependency>
            <groupId>com.tencent.cloud</groupId>
            <artifactId>spring-cloud-tencent-dependencies</artifactId>
            <version>${ 与 Spring Cloud 版本对应的 SCT 版本 }</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

- 确认 Maven 的 setting.xml 中是否正确配置了 release 仓库地址以及 snapshot 仓库地址，

```xml
<settings>
...

<profiles>
  <profile>
    <id>sonatype</id>
    <properties>
      <downloadSources>true</downloadSources>
      <downloadJavadocs>true</downloadJavadocs>
    </properties>
    <repositories>
      <repository>
        <id>nexus-snapshots</id>
        <url>https://oss.sonatype.org/content/repositories/snapshots/</url>
        <releases>
          <enabled>false</enabled>
        </releases>
        <snapshots>
          <enabled>true</enabled>
        </snapshots>
      </repository>
      <repository>
        <id>nexus-releases</id>
        <url>https://oss.sonatype.org/service/local/staging/deploy/maven2/</url>
        <releases>
          <enabled>true</enabled>
        </releases>
        <snapshots>
          <enabled>false</enabled>
        </snapshots>
      </repository>
    </repositories>
  </profile>	
</profiles>

...
</settings>
```

- 确认 jetbrains IDEA 开启了拉取 maven 的 snapshot 依赖

步骤：在IntelliJ IDEA的 File -> Settings -> Build,Execution,Deployment -> Build Tools -> Maven 配置中勾选上 Always
update snapshots 选项然后保存后再重新 Maven Reimport 即可

![](../图片/springcloud%E6%8E%A5%E5%85%A5/maven_snapshot_idea_setting.png)

#### Spring Cloud 应用无法注册到北极星

- 确保项目引入了 **spring-boot-starter-web** 或者引入 **spring-boot-starter-webflux**
- 确保项目引入了 **spring-cloud-tencent-dependencies** 以及 **spring-cloud-starter-tencent-polaris-discovery**

由于在 Spring Cloud 的设计中，一个 Spring Cloud 服务要触发注册动作，必须要有 WebServerInitializedEvent 事件。

#### 无法通过 RestTemplate 从北极星发现服务并发起调用

- 确保项目引入了 **spring-cloud-tencent-dependencies** 以及 **spring-cloud-starter-tencent-polaris-discovery**
- 确保按照如下代码对 RestTemple 创建 bean 以及引入 LoadBalancer 能力

```java
@LoadBalanced
@Bean
public RestTemplate restTemplate() {
    return new RestTemplate();
}
```

#### 无法通过 Feign 从北极星发现服务并发起调用

- 确保 @FeignClient 注解中的 **url** 不要指定任何路径

**错误示例**

```java
@FeignClient(name = "EchoServer", url = "https://172.0.0.1")
public interface EchoServerClient {
    @RequestMapping(value = "/search/users", method = RequestMethod.GET)
    String searchUsers(@RequestParam("q") String queryStr);
}
```


#### 为什么无法识别我配置的 bootstrap.yml 文件，并且 profile 不生效

[Spring Cloud 官方文档介绍](https://docs.spring.io/spring-cloud/docs/2020.0.1/reference/htmlsingle/#config-first-bootstrap)

Spring Boot 2.4, the bootstrap context initialization (bootstrap.yml, bootstrap.properties) of property sources was
deprecated.

因此，如果用户希望继续在 Spring Boot 2.4 之上使用 bootstrap.yml 的话，可以通过添加 **spring-cloud-starter-bootstrap** 进行解决

- 添加 bootstrap 的依赖

```xml        
<dependency>
    <groupId>org.springframework.cloud</groupId>
    <artifactId>spring-cloud-starter-bootstrap</artifactId>
</dependency>
```

对于 profile 不生效的问题，请确保尊从以下使用方式

- 使用 application.yml

如果一开始使用了 application.yml 的话，则 profile 的文件名称只能为 application-{profile}.yml
 
- 使用 bootstrap.yml

如果一开始使用了 bootstrap.yml 的话，则 profile 的文件名称只能为 bootstrap-{profile}.yml


**注意事项**

如果使用 application.yml，但是 profile 文件名称为 bootstrap-{profile}.yml，那么 profile 是无法生效的