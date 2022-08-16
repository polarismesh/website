# 兼容eureka客户端

## 准备Polaris服务端

需要预先安装好Polaris服务端，安装方式可参考：[单机版安装](https://polarismesh.cn/zh/doc/快速入门/安装服务端/安装单机版.html#单机版安装)或者[集群版安装](https://polarismesh.cn/zh/doc/快速入门/安装服务端/安装集群版.html#集群版安装)

Polaris服务端通过暴露8761端口，支持eureka客户端的接入

## spring-cloud-eureka-client接入

1. 修改 demo 中的注册中心地址

  - 在下载到本地的 [demo 源码目录](https://github.com/polarismesh/examples/tree/main/eureka/eureka-java) 下，分别找到
`eureka/eureka-java/consumer/src/main/resources/application.yml`和`eureka/eureka-java/provider/src/main/resources/application.yml`两个文件。
  - 添加微服务引擎服务治理中心地址到项目配置文件中（以`eureka/eureka-java/consumer/src/main/resources/application.yml`为例）。
```yaml
eureka:
    client:
    serviceUrl:
      defaultZone: http://127.0.0.1:8761/eureka/
```

  - 如果期望使用`Eureka`的安全认证体系, 则按照如下进行配置，[北极星鉴权文档](../%E9%89%B4%E6%9D%83%E6%8E%A7%E5%88%B6/%E6%A6%82%E8%BF%B0.md)
```yaml
eureka:
    client:
    serviceUrl:
      defaultZone: http://{任意用户名称}:{北极星鉴权Token}@127.0.0.1:8761/eureka/
```

1. 打包 demo 源码成 jar 包。

 在`eureka-java`源码根目录下，打开 cmd 命令，执行 mvn clean package 命令，对项目进行打包编译，编译成功后，生成如下表所示的2个 Jar 包：
<table>
<tr>
<th>软件包所在目录</th>
<th>软件包名称</th>
<th>说明</th>
</tr>
<tr>
<td>\eureka-java\provider\target</td>
<td>eureka-provider-${version}-SNAPSHOT.jar</td>
<td>服务生产者</td>
</tr>
<tr>
<td>\eureka-java\consumer\target</td>
<td>eureka-consumer-${version}-SNAPSHOT.jar</td>
<td>服务消费者</td>
</tr>
</table>

3. 启动上述流程打出来的jar包。

- 运行```java -jar eureka-provider-${version}-SNAPSHOT.jar > provider.log &```来启动服务生产者。
- 运行```java -jar eureka-consumer-${version}-SNAPSHOT.jar > consumer.log &```

4. 确认部署结果。

 - 打开北极星控制台，http://127.0.0.1:8080。
    - 查看微服务 EUREKA-CONSUMER-SERVICE 和 EUREKA-PROVIDER-SERVICE 的实例数量：
    - 若实例数量值不为0，则表示启动并注册成功。
    - 若实例数量为0，或者找不到具体服务的服务名，则表示启动并注册失败。

 - 调用 consumer 的 HTTP 接口
    - 执行 http 调用，其中`${app.port}`替换为 consumer 的监听端口（默认为20002），`${add.address}`则替换为 consumer 暴露的地址。
```shell
    curl -L -X GET 'http://${add.address}:${app.port}/echo?value=hello_world''
    预期返回值：echo: hello_world
```



