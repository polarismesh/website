# 使用 grpc-go

本文主要面向 grpc-go 的开发者，介绍如何使用```grpc-go-polaris```以帮助开发者在其软件工程项目中快速接入 polaris，以使用其功能，包括服务注册与发现、服务路由与负载均衡、故障节点熔断和服务限流。

* **服务注册与发现**：基于 grpc resolver 进行微服务的注册与发现
* **服务路由与负载均衡**：基于 grpc balancer 和 polaris 提供场景更丰富的动态路由以及负载均衡的能力
* **故障节点熔断**：提供故障节点的熔断剔除以及主/被动探测恢复的能力，保证分布式服务的可靠性
* **服务限流**：基于 grpc interceptor 支持被调用服务的限流功能，保证后台微服务稳定性
## 环境准备

### 准备polaris后台环境

在进行实际的开发前，开发者需要确保Polaris后端服务正常运行，详细可参考 [Polaris](https://github.com/polarismesh)。

### 准备编译/运行环境

```grpc-go-polaris```以源码的方式提供集成，需要配置go mod环境进行依赖获取，并且需要确保是在以下版本环境中进行编译使用：

1. 64 bit操作系统，支持Linux/Unix/Windows，推荐选用 Linux/Unix
2. golang SDK 64bit 1.12+，下载链接：https://golang.org/dl/

## 快速接入

### 引入依赖

1.添加 polaris-go 依赖

可以在```polaris-go```的 [release note](https://github.com/PolarisMesh/polaris-go/releases) 上获取到```polaris-go```的所有版本以及相关介绍。推荐使用最新的稳定版本。
在应用go.mod文件中，引入```polaris-go```依赖。

```
github.com/polarismesh/polaris-go $version
```

2.添加 grpc-go-polaris 依赖

可以在```grpc-go-polaris```的 [release note](https://github.com/PolarisMesh/grpc-go-polaris/releases) 上获取到```grpc-go-polaris```的所有版本以及相关介绍。推荐使用最新的稳定版本。
在应用go.mod文件中，引入```grpc-go-polaris```依赖。

```
github.com/polarismesh/grpc-go-polaris $version
```

### 服务注册与发现

完整样例代码参考：[Sample项目](https://github.com/PolarisMesh/grpc-go-polaris/tree/main/sample)

1.服务端流程

- 创建并设置 Polaris 配置对象

  ```
  //创建并设置 Polaris 配置对象
  configuration := api.NewConfiguration()
  //设置北极星server的地址
  configuration.GetGlobal().GetServerConnector().SetAddresses([]string{"127.0.0.1:8090"})
  //设置连接北极星server的超时时间
  configuration.GetGlobal().GetServerConnector().SetConnectTimeout(2 * time.Second)
  ```

  详细可参考：[Polaris Go API方法使用](https://github.com/PolarisMesh/polaris-go/blob/main/api/README.md)

- 获取 Polaris SDK 对象

  ```
  //使用配置获取 Polaris SDK 对象
  //Polaris Provider API
  provider, err := api.NewProviderAPI()
  if nil != err {
  	log.Fatalf("fail to create provider api by default config file, err %v", err)
  }
  defer provider.Destroy()
  ```

- 监听端口，初始化服务

  ```
  //监听端口
  address := "0.0.0.0:9090"
  listen, err := net.Listen("tcp", address)
  if err != nil {
  	log.Fatalf("Failed to listen: %v", err)
  }
  
  //初始化服务
  s := grpc.NewServer()
  hello.RegisterHelloServer(s, &Hello{})
  log.Println("Listen on " + address)
  ```

- 注册服务到 Polaris

  ```
  //注册服务到 Polaris
  register := &polaris.PolarisRegister{
  	Namespace:    namespace,
  	Service:      service,
  	ServiceToken: token,
  	Host:         ip,
  	Port:         port,
  	Count:        count,
  	ProviderAPI:  provider,
  }
  go register.RegisterAndHeartbeat()
  ```

2.客户端流程

- 创建并设置 Polaris 配置对象

  ```
  //创建并设置 Polaris 配置对象
  configuration := api.NewConfiguration()
  //设置北极星server的地址
  configuration.GetGlobal().GetServerConnector().SetAddresses([]string{"127.0.0.1:8090"})
  //设置连接北极星server的超时时间
  configuration.GetGlobal().GetServerConnector().SetConnectTimeout(2 * time.Second)
  //设置consumer关闭全死全活，可选
  configuration.GetConsumer().GetServiceRouter().SetEnableRecoverAll(false)
  ```

  详细可参考：[Polaris Go API方法使用](https://github.com/PolarisMesh/polaris-go/blob/main/api/README.md)

- 获取 Polaris SDK 对象

  ```
  //使用配置获取 Polaris SDK 对象
  //Polaris Consumer API
  consumer, err := api.NewConsumerAPIByConfig(configuration)
  if err != nil {
  	log.Fatalf("api.NewConsumerAPIByConfig err(%v)", err)
  }
  defer consumer.Destroy()
  ```

- 初始化并注册 Polaris Resolver 到 grpc

  ```
  //初始化并注册 Polaris Resolver Builder
  polaris.Init(polaris.Conf{
  	PolarisConsumer: consumer,
  	SyncInterval:    time.Second * time.Duration(sendInterval),
  	Metadata:        metadata,
  })
  ```

- 获取grpc连接并发起调用

  ```
  //grpc客户端连接获取
  ctx, cancel := context.WithCancel(context.Background())
  defer cancel()
  conn, err := grpc.DialContext(ctx, fmt.Sprintf("polaris://%s", target),
  	[]grpc.DialOption{
  		grpc.WithInsecure(),
  	}...)
  if err != nil {
  	panic(err)
  }
  
  //grpc客户端调用
  rpcClient := hello.NewHelloClient(conn)
  for i := 0; i < sendCount; i++ {
  	resp, err := rpcClient.SayHello(ctx, &hello.HelloRequest{Name: "polaris"})
  	log.Printf("send message, index (%d) resp1 (%v), err(%v)", i, resp, err)
  	
  	<-time.After(1500 * time.Millisecond)
  }
  ```

### 服务路由与负载均衡

完整样例代码参考：[Sample项目](https://github.com/PolarisMesh/grpc-go-polaris/tree/main/sample)

1.客户端与服务端流程

同上文服务注册与发现过程。

2.添加路由或负载均衡配置

Polaris提供了服务路由配置和元数据配置。其中服务路由配置用于服务路由的判定，元数据配置内的权重配置可以用于负载均衡的权重相关策略使用（目前仅支持权重随机负载均衡策略）。详细操作请参考[Polaris服务路由文档](https://github.com/polarismesh)。

3.启动并验证

客户端发生调用时，按照用户配置的路由或者权重对服务生产者实例有不同的路由调用。

### 故障节点熔断

完整样例代码参考：[Sample项目](https://github.com/PolarisMesh/grpc-go-polaris/tree/main/sample)

1.客户端与服务端流程

同上文服务注册与发现过程。

2.模拟故障节点

在服务端模拟故障接口，调用时为客户端返回一个异常。

3.启动并验证

客户端发生调用时，在经过几次异常调用后，请求流量会切换到正常的服务实例上。

### 服务限流

完整样例代码参考：[Sample项目](https://github.com/PolarisMesh/grpc-go-polaris/tree/main/sample)

1.客户端与服务端流程

- 获取 Polaris SDK 对象

  ```
  //Polaris Limit API
  limit, err := api.NewLimitAPI()
  if nil != err {
  	log.Fatalf("fail to create limit api by default config file, err %v", err)
  }
  defer limit.Destroy()
  ```

- 初始化 Polaris 限流器

  ```
  //构建 Polaris Unary/Stream 限流器
  limiter := &polaris.PolarisLimiter{
  	Namespace: namespace,
  	Service:   service,
  	Labels:    labels,
  	LimitAPI:  limit,
  }
  ```

- 使用限流器初始化服务

  ```
  //初始化服务
  var opts []grpc.ServerOption
  opts = append(opts,
  	grpc.UnaryInterceptor(polaris.UnaryServerInterceptor(limiter)),
  	grpc.StreamInterceptor(polaris.StreamServerInterceptor(limiter)))
  s := grpc.NewServer(opts...)
  hello.RegisterHelloServer(s, &Hello{})
  log.Println("Listen on " + address)
  ```

2.添加限流配置

北极星提供了三种添加限流配置的方式，包括控制台操作、HTTP接口上传和本地文件配置，具体请参考[北极星服务限流使用文档](https://github.com/polarismesh)。

3.启动并验证

客户端发生调用时，服务端按照用户配置的限流规则对请求进行拦截，并在限流生效时输出相关日志信息。

```
xxx is rejected by polaris rate limiter, please retry later.
```
## 相关链接

[Polaris](https://github.com/polarismesh)

[Polaris Go](https://github.com/polarismesh/polaris-go)