---
title: "控制台"
linkTitle: "控制台"
weight: 104
---

## polaris-cpp

### 服务实例注册

polaris-cpp提供```Register```接口，供用户进行服务实例注册。

```c++
polaris::InstanceRegisterRequest register_req("Test", "FooService", service_token, "127.0.0.1", 8888);
std::string instance_id;
ret = provider->Register(register_req, instance_id);
```

### 服务实例反注册

polaris-cpp提供```Deregister```接口，供用户进行服务实例反注册。

```c++
polaris::InstanceRegisterRequest register_req("Test", "FooService", service_token, "127.0.0.1", 8888);
std::string instance_id;
ret = provider->Register(register_req, instance_id);
```

### 服务发现

### 拉取全量服务实例列表

polaris-cpp提供```GetAllInstances```接口，供用户拉取服务下全量服务实例列表（与控制台显示的服务实例列表一致）。

```c++
polaris::ServiceKey service_key = {"Test", "FooService"};
polaris::GetInstancesRequest request(service_key);
polaris::InstancesResponse* response = NULL;
polaris::ReturnCode ret = consumer->GetAllInstances(request, response);
```

### 使用样例

详细逻辑可以参考[Demo](https://github.com/polarismesh/polaris-cpp/tree/main/examples/quickstart)

