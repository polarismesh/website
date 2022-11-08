---
title: "控制台"
linkTitle: "控制台"
weight: 102
---

## polaris-java

### 服务实例注册

polaris-java提供```registerInstance```接口，供用户进行服务实例注册。

```java
InstanceRegisterRequest registerRequest = new InstanceRegisterRequest();
registerRequest.setNamespace("Test");
registerRequest.setService("FooService");
registerRequest.setHost("127.0.0.1");
registerRequest.setPort(8888);
InstanceRegisterResponse registerResp = provider.registerInstance(registerRequest);
```

### 服务实例反注册

polaris-java提供```deRegister```接口，供用户进行服务实例注册。

```java
InstanceDeregisterRequest deregisterRequest = new  InstanceDeregisterRequest();
deregisterRequest.setNamespace("Test");
deregisterRequest.setService("FooService");
deregisterRequest.setHost("127.0.0.1");
deregisterRequest.setPort(8888);
providerAPI.deRegister(deregisterRequest);
```

### 服务发现

#### 拉取全量服务实例列表

polaris-java提供```getAllInstances```接口，供用户拉取服务下全量服务实例列表（与控制台显示的服务实例列表一致）。

```java
GetAllInstancesRequest allInstancesRequest = new GetAllInstancesRequest();
allInstancesRequest.setNamespace("Test");
allInstancesRequest.setService("FooService");
InstancesResponse instancesResponse = consumer.getAllInstance(allInstancesRequest);
```

#### 拉取健康服务实例列表

polaris-java提供```getHealthyInstances```接口，供用户仅拉取服务下健康服务实例。

```java
GetHealthyInstancesRequest healthyInstancesRequest = new GetHealthyInstancesRequest();
healthyInstancesRequest.setNamespace("Test");
healthyInstancesRequest.setService("FooService");
InstancesResponse instancesResponse = consumer.getAllInstance(allInstancesRequest);
```

### 使用样例

详细逻辑可以参考[Demo](https://github.com/polarismesh/polaris-java/tree/main/polaris-examples/quickstart-example)

## Spring Cloud

Spring Cloud应用可以通过Spring Cloud Tencent接入北极星服务注册发现。

具体接入方式可以参考[Spring Cloud Tencent Discovery](https://github.com/Tencent/spring-cloud-tencent/wiki/Spring-Cloud-Tencent-Discovery-%E4%BD%BF%E7%94%A8%E6%96%87%E6%A1%A3)