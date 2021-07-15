# 使用 Spring Cloud

[toc]

--

本文主要面向Spring Cloud微服务架构项目的开发者，介绍如何使用```spring-cloud-tencent```以帮助开发者在其软件工程项目中快速接入Polaris，以使用其功能，包括服务注册与发现、故障节点熔断和服务限流。

* **服务注册与发现**：适配 Spring Cloud 服务注册与发现标准，基于 Ribbon 的接口标准上，提供场景更丰富的动态路由以及负载均衡的能力
* **故障节点熔断**：提供故障节点的熔断剔除以及主/被动探测恢复的能力，保证分布式服务的可靠性
* **服务限流**：支持工作于微服务被调接入层的限流功能，保证后台微服务稳定性，可通过控制台动态配置规则，及查看流量监控数据


## 环境准备

在进行实际的开发前，开发者需要确保Polaris后端服务正常运行，详细操作请参考[Polaris](https://github.com/polarismesh)。

## 快速接入

### 引入依赖管理

在工程根目录的pom中的```<dependencyManagement>```添加如下配置，即可在项目中引用需要的```spring-cloud-tencent```子模块依赖。

```
    <dependencyManagement>
        <dependencies>
            <dependency>
                <groupId>com.tencent.nameservice</groupId>
                <artifactId>spring-cloud-tencent-dependencies</artifactId>
                <!--版本号需修改成实际依赖的版本号-->
                <version>${version}</version>
                <type>pom</type>
                <scope>import</scope>
            </dependency>
        </dependencies>
    </dependencyManagement>
```

其中，版本说明参考：[Spring Cloud Tencent版本说明](https://github.com/tencent/spring-cloud-tencent)

### 服务注册与发现

完整样例代码参考：[服务注册与发现Example](https://github.com/tencent/spring-cloud-tencent/spring-cloud-tencent-examples/polaris-discovery-example/README.md)

1. 添加依赖

在项目中加入```spring-cloud-starter-tencent-polaris-discovery```依赖即可使用Polaris的服务注册与发现功能。如Maven项目中，在pom中添加如下配置：

```XML
<dependency>
    <groupId>com.tencent.cloud</groupId>
    <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
</dependency>
```

2. 修改配置

在服务生产者和服务消费者的配置文件（bootstrap.yml、application.yml等）中添加如下配置，即可完成服务注册与发现（在Spring Cloud Edgware之后，无需使用```@EnableDiscoveryClient```即可进行服务注册与发现）：

```yaml
spring:
  application:
    name: ${application.name}
  cloud:
    polaris:
      address: ${protocol}://${ip}:${port}
```

其中，```${application.name}```为服务名，与Polaris控制台上的服务名保持一致。```${protocol}```为数据传输协议，目前仅支持grpc。```${ip}```为Polaris后端ip地址，```${port}```为Polaris后端暴露的端口号。

3. 启动并验证

以[服务注册与发现Example](https://github.com/tencent/spring-cloud-tencent/spring-cloud-tencent-examples/polaris-discovery-example/README.md)为例。

- Feign调用

执行以下命令发起Feign调用，其逻辑为服务生产者返回value1+value2的和

```shell
curl -L -X GET 'http://localhost:48080/discovery/service/caller/feign?value1=1&value2=2'
```

预期返回值

```
3
```

- RestTemplate调用

执行以下命令发起RestTemplate调用，其逻辑为服务生产者返回一段字符串

```shell
curl -L -X GET 'http://localhost:48080/discovery/service/caller/rest'
```

预期返回值

```
Discovery Service Callee
```

### 故障节点熔断

完整样例代码参考：[故障节点熔断Example](https://github.com/tencent/spring-cloud-tencent/spring-cloud-tencent-examples/polaris-circuitbreaker-example/README.md)

1. 添加依赖

在项目中加入```spring-cloud-starter-tencent-polaris-circuitbreaker```依赖即可使用故障熔断的特性。如Maven项目中，在pom中添加如下配置：
```XML
<dependency>
    <groupId>com.tencent.cloud</groupId>
    <artifactId>spring-cloud-starter-tencent-polaris-circuitbreaker</artifactId>
</dependency>
```

2. 启动并验证

以[故障节点熔断Example](https://github.com/tencent/spring-cloud-tencent/spring-cloud-tencent-examples/polaris-circuitbreaker-example/README.md)为例。

- Feign调用

执行以下命令发起Feign调用，其逻辑为服务生产者抛出一个异常

```shell
curl -L -X GET 'localhost:48080/example/service/a/getBServiceInfo'
```

预期返回情况：

在出现
```
trigger the refuse for service b
```
时，表示请求到有异常的ServiceB，需要熔断这个实例。后面的所有请求都会得到正常返回。

### 服务限流

完整样例代码参考：[服务限流Example](https://github.com/tencent/spring-cloud-tencent/spring-cloud-tencent-examples/polaris-discovery-example/README.md)

1. 添加依赖

在项目中加入```spring-cloud-starter-tencent-polaris-ratelimit```依赖即可使用服务限流的特性。如Maven项目中，在pom中添加如下配置：

```XML
<dependency>
    <groupId>com.tencent.cloud</groupId>
    <artifactId>spring-cloud-starter-tencent-polaris-ratelimit</artifactId>
</dependency>
```

2. 添加限流规则配置

北极星提供了三种添加限流配置的方式，包括控制台操作、HTTP接口上传和本地文件配置，具体请参考[北极星服务限流使用文档](https://github.com/polarismesh)。

3. 启动并验证


## 相关链接

[Polaris](https://github.com/polarismesh)
[Spring Cloud Tencent](https://github.com/tencent/spring-cloud-tencent)