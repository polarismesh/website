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

### 迁移完成

配置好迁移后，可以在北极星控制台能同时查看到注册在eureka的实例，以及注册到北极星的实例，相互之间可以正常访问。

从eureka同步到北极星的服务实例，会打入internal-eureka-replicate:true的标签。

![](../图片/Eureka迁移方案/元数据.png)