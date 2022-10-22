---
title: "使用SDK"
linkTitle: "使用SDK"
weight: 413
---

## 准备Polaris服务端

需要预先安装好Polaris服务端，安装方式可参考：[单机版安装](https://polarismesh.cn/zh/doc/快速入门/安装服务端/安装单机版.html#单机版安装)或者[集群版安装](https://polarismesh.cn/zh/doc/快速入门/安装服务端/安装集群版.html#集群版安装)

Polaris SDK会提供拉取全量服务实例的接口，用户可以通过服务名来进行服务发现。

## 拉取全量服务实例

Polaris SDK提供```GetAllInstances```接口，供用户进行单个服务下全量服务实例拉取。

- Java语言

```java
GetAllInstancesRequest allInstancesRequest = new GetAllInstancesRequest();
allInstancesRequest.setNamespace("Test");
allInstancesRequest.setService("FooService");
InstancesResponse instancesResponse = consumer.getAllInstance(allInstancesRequest);
```

详细使用逻辑可以参考[polaris-java服务发现](https://github.com/polarismesh/polaris-java/tree/main/polaris-examples/discovery-example)

- Go语言

```go
getAllRequest := &api.GetAllInstancesRequest{}
getAllRequest.Namespace = "Test"
getAllRequest.Service = "FooService"
allInstResp, err := consumer.GetAllInstances(getAllRequest)
```

详细使用逻辑可以参考[polaris-go服务发现](https://github.com/polarismesh/polaris-go/tree/main/examples/quickstart)

- C++语言

```c++
polaris::ServiceKey service_key = {"Test", "FooService"};
polaris::GetInstancesRequest request(service_key);
polaris::InstancesResponse* response = NULL;
polaris::ReturnCode ret = consumer->GetAllInstances(request, response);
```

详细使用逻辑可以参考[polaris-cpp服务发现](https://github.com/polarismesh/polaris-cpp/blob/main/examples/consumer)