## 准备Polaris服务端

需要预先安装好Polaris服务端，安装方式可参考：[单机版安装](polarismesh.cn/zh/doc/快速入门/安装服务端/安装单机版.html#单机版安装)或者[集群版安装](polarismesh.cn/zh/doc/快速入门/安装服务端/安装集群版.html#集群版安装)

Polaris SDK只提供服务实例注册以及反注册的接口，注册实例时，服务端会自动创建不存在的服务。

## 注册服务实例

Polaris SDK提供```Register```接口，供用户进行服务实例注册。

- Java语言

```java
InstanceRegisterRequest registerRequest = new InstanceRegisterRequest();
registerRequest.setNamespace("Test");
registerRequest.setService("FooService");
registerRequest.setHost("127.0.0.1");
registerRequest.setPort(8888);
InstanceRegisterResponse registerResp = provider.register(registerRequest);
```

详细使用逻辑可以参考[polaris-java快速入门](https://github.com/polarismesh/polaris-java/tree/main/polaris-examples/quickstart-example)

- Go语言

```go
registerRequest := &api.InstanceRegisterRequest{}
registerRequest.Service = "FooService"
registerRequest.Namespace = "Test"
registerRequest.Host = "127.0.0.1"
registerRequest.Port = 8888
resp, err := provider.Register(registerRequest)
```

详细使用逻辑可以参考[polaris-go快速入门](https://github.com/polarismesh/polaris-go/tree/main/examples/quickstart)

- C++语言

```c++
polaris::InstanceRegisterRequest register_req("Test", "FooService", service_token, "127.0.0.1", 8888);
std::string instance_id;
ret = provider->Register(register_req, instance_id);
```

详细使用逻辑可以参考[polaris-cpp快速入门](https://github.com/polarismesh/polaris-cpp/tree/main/examples/quickstart)

## 反注册服务实例

Polaris SDK提供```Deregister```接口，供用户进行服务实例反注册。

- Java语言

```java
InstanceDeregisterRequest deregisterRequest = new  InstanceDeregisterRequest();
deregisterRequest.setNamespace("Test");
deregisterRequest.setService("FooService");
deregisterRequest.setHost("127.0.0.1");
deregisterRequest.setPort(8888);
providerAPI.deRegister(deregisterRequest);
```

详细使用逻辑可以参考[polaris-java快速入门](https://github.com/polarismesh/polaris-java/tree/main/polaris-examples/quickstart-example)

- Go语言

```go
deregisterRequest := &api.InstanceDeRegisterRequest{}
deregisterRequest.Service = "FooService"
deregisterRequest.Namespace = "Test"
deregisterRequest.Host = "127.0.0.1"
deregisterRequest.Port = 8888
err = provider.Deregister(deregisterRequest)
```

详细使用逻辑可以参考[polaris-go快速入门](https://github.com/polarismesh/polaris-go/tree/main/examples/quickstart)

- C++语言

```c++
polaris::InstanceDeregisterRequest deregister_req(service_token, instance_id);
ret = provider->Deregister(deregister_req);
```

详细使用逻辑可以参考[polaris-cpp快速入门](https://github.com/polarismesh/polaris-cpp/tree/main/examples/quickstart)

