---
title: "Eureka 迁移方案"
linkTitle: "Eureka 迁移方案"
weight: 1
---

## 服务迁移

### 原理说明

北极星对Eureka的API进行了全兼容，因此，业务可以把北极星集群作为一个Eureka节点，加入到Eureka原来的集群中，基于Eureka原生的同步协议进行新老注册中心的服务数据双向同步。

![](../图片/Eureka迁移方案/迁移架构.png)

在这种迁移模式下， 用户可逐渐、分批次的将老集群中的eureka升级成北极星，升级过程对数据面不感知。新应用（使用Spring Cloud Tencent或其他北极星客户端），和存量应用（仍然使用Spring Cloud Netflix或者其他Eureka客户端），都可以接入到北极星完成注册发现，无需代码修改。

### 启动迁移

*** 安装北极星集群版 ***

需要先安装北极星集群版，可参考 [集群版安装](/docs/使用指南/服务端安装/集群版安装)

*** 迁移相关的参数说明 ***

北极星通过eureka-apiserver实现了与开源标准eureka接口全兼容，用户如果对eureka进行了一些定制，需要手动调整eurekaeureka-apiserver的相关参数。

所有的eureka相关的参数都在polaris.yaml中，在apiservers.option下面进行配置：

| 参数名              | 含义                                                         | 示例             |
| ------------------- | ------------------------------------------------------------ | ---------------- |
| listenIP            | eureka兼容的服务端监听IP                                     | 0.0.0.0          |
| listenPort          | eureka兼容的服务端监听端口                                   | 8761             |
| namespace           | 通过eureka接口注册及发现的服务节点的命名空间，由于eureka本身没有命名空间的概念，所以针对eureka的服务管理操作必须在北极星某个命名空间下进行 | default          |
| refreshInterval     | 全量服务实例缓存的刷新间隔，单位秒                           | 10               |
| deltaExpireInterval | 增量实例缓存的刷新间隔，单位秒                               | 60               |
| peersToReplicate    | 需要进行复制的对端eureka服务端节点列表                       | - 9.15.15.5:8761 |
| customValues        | 自定义配置，用户如果对eureka服务端进行了定制并影响了参数，则可以把相关的参数填上，比如定制了dataCenterInfo，则可以将新的dci信息填入，北极星服务端会按照配置的信息进行下发 | 见" 定制dataCenterInfo"           |

*** 往北极星服务端添加eureka地址 ***

- 进入北极星集群中的其中一个节点，找到polaris.yaml配置文件，在```apiservers.service-eureka.option```下面，添加eureka服务端地址信息，用于做数据复制：

```
apiservers:
  - name: service-eureka
    option:
      ... // 其他配置
      peersToReplicate: // eureka服务端节点的地址列表
      - <eureka1 IP>:<eureka1 port>
      - <eureka2 IP>:<eureka2 port>
```

- 重启北极星服务端。

*** 往eureka服务端添加北极星服务端地址 ***

- 修改eureka服务端的配置，将北极星其中一个节点的地址，加入到原有的eureka集群中。

```
eureka:
  client:
    serviceUrl:
      defaultZone: http://<北极星服务端IP>:8761/eureka/
```

- 重启Eureka服务端。

***  定制dataCenterInfo ***

如果用户对eureka-server进行了定制，比如定制了```<dataCenterInfo class="com.netflix.appinfo.AmazonInfo">```，那么可以在北极星把这个配置项加入，即可下发带有定制后的DCI相关的服务数据。

```
apiservers:
  - name: service-eureka
    option:
      ... // 其他配置
      customValues:
        dataCenterInfoClass: "com.netflix.appinfo.AmazonInfo"
        dataCenterInfoName: "myOwn"
```

### 迁移完成

配置好迁移后，可以在北极星控制台能同时查看到注册在eureka的实例，以及注册到北极星的实例，相互之间可以正常访问。

从eureka同步到北极星的服务实例，会打入internal-eureka-replicate:true的标签。

![](../图片/Eureka迁移方案/元数据.png)