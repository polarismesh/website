---
title: "控制台"
linkTitle: "控制台"
weight: 103
---

## polaris-go

### 服务实例注册

polaris-go提供```RegisterInstance```接口，供用户进行服务实例注册。

```go
registerRequest := &api.InstanceRegisterRequest{}
registerRequest.Service = "FooService"
registerRequest.Namespace = "Test"
registerRequest.Host = "127.0.0.1"
registerRequest.Port = 8888
resp, err := provider.RegisterInstance(registerRequest)
```

### 服务实例反注册

polaris-go提供```Deregister```接口，供用户进行服务实例反注册。

```go
deregisterRequest := &api.InstanceDeRegisterRequest{}
deregisterRequest.Service = "FooService"
deregisterRequest.Namespace = "Test"
deregisterRequest.Host = "127.0.0.1"
deregisterRequest.Port = 8888
err = provider.Deregister(deregisterRequest)
```

### 服务发现

### 拉取全量服务实例列表

polaris-go提供```GetAllInstances```接口，供用户拉取服务下全量服务实例列表（与控制台显示的服务实例列表一致）。

```go
getAllRequest := &api.GetAllInstancesRequest{}
getAllRequest.Namespace = "Test"
getAllRequest.Service = "FooService"
allInstResp, err := consumer.GetAllInstances(getAllRequest)
```

### 使用样例

详细逻辑可以参考[Demo](https://github.com/polarismesh/polaris-go/tree/main/examples/quickstart)