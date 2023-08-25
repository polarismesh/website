---
date: 2023-01-23
layout: blog
title: "PolarisMesh系列文章——源码系列（服务端启动流程）"
linkTitle: "PolarisMesh系列文章——源码系列（服务端启动流程）"
slug: "source_code_analyze"
author: 春少
---

-- [转载自掘金](https://juejin.cn/post/7191820528431136823)

## 前话

**polaris-server** 作为PolarisMesh的控制面，该进程主要负责服务数据、配置数据、治理规则的管理以及下发至北极星SDK以及实现了xDS的客户端。

**polaris-server** 是如何同时对外提供服务注册发现、配置管理、服务治理的功能呢？又是如何同时支持北极星基于gRPC的私有协议、兼容eureka协议以及xDS协议呢？带着这些疑问，我们来探究看下**polaris-server**的启动流程，看看北极星是实现的。


## 前期准备

- golang 环境，需要1.17.x +
- 准备 vscode 或者 goland
- 从github中clone一份polaris-server的源码，这里推荐从release-vx.y.z分支中选择一个分支进行学习，以下文章将基于[release-v1.12.0](https://github.com/polarismesh/polaris/tree/release-v1.12.0)分支进行研究

## 正题

### polaris-server.yaml 认识

```yaml
# server启动引导配置
bootstrap:
  # 全局日志
  logger:
    ${日志scope名称，主要支持 config/auth/store/naming/cache/xdsv3/default}:
      rotateOutputPath: ${日志文件位置}
      errorRotateOutputPath: ${专门记录error级别的错误日志文件}
      rotationMaxSize: ${单个日志文件大小最大值, 默认 100, 单位为 mb}
      rotationMaxBackups: ${最大保存多少个日志文件, 默认 10}
      rotationMaxAge: ${单个日志文件最大保存天数, 默认 7}
      outputLevel: ${日志输出级别，debug/info/warn/error}
  # 按顺序启动server
  startInOrder:
    open: true # 是否开启，默认是关闭
    key: sz # 全局锁，锁的名称，根据锁名称进行互斥启动
  # 注册为北极星服务
  polaris_service:
    probe_address: ${北极星探测地址，用于获取当前北极星server自身对外的IP, 默认为 ##DB_ADDR##}
    enable_register: ${是否允许当前北极星进程进行自注册，即将自身的系统级服务注册通过北极星的服务注册能力进行注册，默认为 true}
    isolated: ${注册的实例是否需要处理隔离状态，默认为 false}
    services:
      - name: polaris.checker # 北极星健康检查需要的系统级服务，根据该服务下的实例，进行健康检查任务的 hash 责任划分
        protocols: # 注册的实例需要暴露的协议，即注册端口号
          - service-grpc
# apiserver，北极星对外协议实现层
apiservers:
  - name: service-eureka # 北极星支持 eureka 协议的协议层插件
    option:
      listenIP: "0.0.0.0"          # tcp server 的监听 ip
      listenPort: 8761             # tcp server 的监听端口
      namespace: default           # 设置 eureka 服务默认归属的北极星命名空间
      refreshInterval: 10          # 定期从北极星的cache模块中拉取数据，刷新 eureka 协议中的数据缓存
      deltaExpireInterval: 60      # 增量缓存过期周期
      unhealthyExpireInterval: 180 # 不健康实例过期周期
      connLimit:                   # 链接限制配置
        openConnLimit: false       # 是否开启链接限制功能，默认 false
        maxConnPerHost: 1024       # 每个IP最多的连接数
        maxConnLimit: 10240        # 当前listener最大的连接数限制
        whiteList: 127.0.0.1       # 该 apiserver 的白名单 IP 列表，英文逗号分隔
        purgeCounterInterval: 10s  # 清理链接行为的周期
        purgeCounterExpired: 5s    # 清理多久不活跃的链接
  - name: api-http                 # 北极星自身 OpenAPI 协议层
    option:
      listenIP: "0.0.0.0"          # tcp server 的监听 ip
      listenPort: 8090             # tcp server 的监听端口
      enablePprof: true            # 是否开启 golang 的 debug/pprof 的数据采集
      enableSwagger: true          # 是否开启 swagger OpenAPI doc 文档数据生成
    api:                           # 设置允许开放的 api 接口类型
      admin:                       # 运维管理 OpenAPI 接口
        enable: true
      console:                     # 北极星控制台 OpenAPI 接口
        enable: true
        include: [default]         # 需要暴露的 OpenAPI 分组
      client:                      # 北极星客户端相关 OpenAPI 接口
        enable: true
        include: [discover, register, healthcheck]
      config:                      # 北极星配置中心相关 OpenAPI 接口
        enable: true
        include: [default]
  - name: service-grpc             # 北极星基于 gRPC 协议的客户端通信协议层，用于注册发现、服务治理
    option:
      listenIP: "0.0.0.0"
      listenPort: 8091
      enableCacheProto: true       # 是否开启 protobuf 解析缓存，对于内容一样的protobuf减少序列化
      sizeCacheProto: 128          # protobuf 缓存大小
      tls:                         # 协议层支持 tls 的配置
        certFile: ""
        keyFile: ""
        trustedCAFile: ""
    api:
      client:
        enable: true
        include: [discover, register, healthcheck]
  - name: config-grpc              # 北极星基于 gRPC 协议的客户端通信协议层，用于配置中心
    option:
      listenIP: "0.0.0.0"
      listenPort: 8093
      connLimit:
        openConnLimit: false
        maxConnPerHost: 128
        maxConnLimit: 5120
    api:
      client:
        enable: true
  - name: xds-v3                   # 北极星实现的 xDSv3 协议层
    option:
      listenIP: "0.0.0.0"
      listenPort: 15010
      connLimit:
        openConnLimit: false
        maxConnPerHost: 128
        maxConnLimit: 10240
# 核心逻辑的配置
auth:
  # 鉴权插件
  name: defaultAuth
  option:
    # token 加密的 salt，鉴权解析 token 时需要依靠这个 salt 去解密 token 的信息
    # salt 的长度需要满足以下任意一个：len(salt) in [16, 24, 32]
    salt: polarismesh@2021
    # 控制台鉴权能力开关，默认开启
    consoleOpen: true
    # 客户端鉴权能力开关, 默认关闭
    clientOpen: false
namespace:
  # 是否允许自动创建命名空间
  autoCreate: true
naming:
  auth:
    open: false
  # 批量控制器
  batch:
    ${批量控制器配置，支持 register/deregister/clientRegister/clientDeregister}:
      open: true                 # 是否开启该批量控制器
      queueSize: 10240           # 暂存任务数量
      waitTime: 32ms             # 任务未满单次 Batch 数量的最大等待时间，时间到直接强制发起 Batch 操作
      maxBatchCount: 128         # 单次 Batch 数量
      concurrency: 128           # 处于批任务的 worker 协程数量
      dropExpireTask: true       # 是否开启丢弃过期任务，仅用于 register 类型的批量控制器
      taskLife: 30s              # 任务最大有效期，超过有效期则任务不执行，仅用于 register 类型的批量控制器
# 健康检查的配置
healthcheck:
  open: true                     # 是否开启健康检查功能模块
  service: polaris.checker       # 参与健康检查任务的实例所在的服务
  slotNum: 30                    # 时间轮参数
  minCheckInterval: 1s           # 用于调整实例健康检查任务在时间轮内的下一次执行时间，限制最小检查周期
  maxCheckInterval: 30s          # 用于调整实例健康检查任务在时间轮内的下一次执行时间，限制最大检查周期
  clientReportInterval: 120s     # 用于调整SDK上报实例健康检查任务在时间轮内的下一次执行时间
  batch:                         # 健康检查数据的批量写控制器
    heartbeat:
      open: true
      queueSize: 10240
      waitTime: 32ms
      maxBatchCount: 32
      concurrency: 64
  checkers:                      # 健康检查启用插件列表，当前支持 heartbeatMemory/heartbeatRedis，由于二者属于同一类型健康检查插件，因此只能启用一个
    - name: heartbeatMemory      # 基于本机内存实现的健康检查插件，仅适用于单机版本
    - name: heartbeatRedis       # 基于 redis 实现的健康检查插件，适用于单机版本以及集群版本
      option:
        kvAddr: ##REDIS_ADDR##   # redis 地址，IP:PORT 格式
        # ACL user from redis v6.0, remove it if ACL is not available
        kvUser: ##REDIS_USER#    # 如果redis版本低于6.0，请直接移除该配置项
        kvPasswd: ##REDIS_PWD##  # redis 密码
        poolSize: 200            # redis 链接池大小
        minIdleConns: 30         # 最小空闲链接数量
        idleTimeout: 120s        # 认为空闲链接的时间
        connectTimeout: 200ms    # 链接超时时间
        msgTimeout: 200ms        # redis的读写操作超时时间
        concurrency: 200         # 操作redis的worker协程数量
        withTLS: false
# 配置中心模块启动配置
config:
  # 是否启动配置模块
  open: true
  cache:
    #配置文件缓存过期时间，单位s
    expireTimeAfterWrite: 3600
# 缓存配置
cache:
  open: true
  resources:
    - name: service # 加载服务数据
      option:
        disableBusiness: false # 不加载业务服务
        needMeta: true # 加载服务元数据
    - name: instance # 加载实例数据
      option:
        disableBusiness: false # 不加载业务服务实例
        needMeta: true # 加载实例元数据
    - name: routingConfig # 加载路由数据
    - name: rateLimitConfig # 加载限流数据
    - name: circuitBreakerConfig # 加载熔断数据
    - name: users # 加载用户、用户组数据
    - name: strategyRule # 加载鉴权规则数据
    - name: namespace # 加载命名空间数据
    - name: client # 加载 SDK 数据
# 存储配置
store:
  # 单机文件存储插件
  name: boltdbStore
  option:
    path: ./polaris.bolt
  ## 数据库存储插件
  # name: defaultStore
  # option:
  #   master:                                     # 主库配置, 如果要配置 slave 的话，就把 master 替换为 slave 即可
  #     dbType: mysql                             # 数据库存储类型
  #     dbName: polaris_server                    # schema 名称
  #     dbUser: ##DB_USER##                       # 数据库用户
  #     dbPwd: ##DB_PWD##                         # 数据库用户密码
  #     dbAddr: ##DB_ADDR##                       # 数据库连接地址，HOST:PORT 格式
  #     maxOpenConns: 300                         # 最大数据库连接数
  #     maxIdleConns: 50                          # 最大空闲数据库连接数
  #     connMaxLifetime: 300 # 单位秒              # 连接的最大存活时间，超过改时间空闲连接将会呗释放
  #     txIsolationLevel: 2 #LevelReadCommitted
# 插件配置
plugin: # 本次暂不涉及，后续文章在详细说明
```

### 源码组织

我们先来看下，北极星服务端源码的组织形式

```bash
➜  polaris-server git:(release-v1.12.0) tree -L 1
.
├── apiserver                  # 北极星对外协议实现层
├── auth                       # 北极星的资源鉴权层
├── bootstrap                  # 负责将北极星各个功能模块初始化、逐个启动
├── cache                      # 北极星的资源缓存层，对于弱一致性读接口进行加速
├── cmd                        # 简单实现几个 command 命令，start：启动北极星，version: 查询当前北极星进程版本
├── common                     # 公共模块，放置api接口对象定义、功能模块的工具函数
├── config                     # 北极星的配置中心
├── main.go                    # main 函数所在文件，polaris-server 进程启动的入口
├── maintain                   # 北极星自身运维能力模块
├── namespace                  # 北极星命名空间模块，主要用于服务注册发现以及配置中心
├── plugin                     # 北极星小功能插件模块，主要集中了各个旁路能力的默认插件实现
├── plugin.go                  # 北极星的插件注册文件，利用 golang 的 init 机制
├── polaris-server.yaml        # polaris-server 进程启动所需要的配置文件
├── service                    # 北极星的服务注册发现中心、治理规则中心
├── store                      # 北极星的存储层，已插件化，存在两个默认实现插件，一个是基于boltdb实现的单机存储插件，一个是基于MySQL实现的集群存储插件
├── tool                       # 北极星的相关脚本，包含启动、关闭
└── version                    # 编译期间注入版本信息
```

从源码的组织中可以看出，北极星各个功能模块的划分还是很清晰的，其核心的模块主要是以下六个

- apiserver
- bootstrap
- cache
- namespace
- config
- service

我们先来看看，是如何在**bootstrap**中完成对北极星各个功能模块的初始化以及逐个启动的

### Bootstrap

先看看 bootstrap 下的源码文件组织

```bash
➜  bootstrap git:(release-v1.12.0) tree -L 1
.
├── config                 # bootstrap 在 polaris-server.yaml 中对应的配置对象
├── run_darwin.go          # 用于 drawin 内核，阻塞 polaris-server 主协程不退出，并监听相应的os.Signal
├── run_linux.go           # 用于 linux 内核，阻塞 polaris-server 主协程不退出，并监听相应的os.Signal
├── run_windows.go         # 用于 window 内核，阻塞 polaris-server 主协程不退出，并监听相应的os.Signal
├── self_checker.go        # 北极星服务端自身的心跳上报流程，保持自身注册的相关内置服务实例的健康
└── server.go              # 北极星启动核心逻辑文件
```

既然 server.go 是服务端进程启动核心逻辑所在的文件，那我们就直接从他入手。

来到 server.go 文件中，立马就看到一个 **Start(configFilePath string)** 方法，毋庸置疑，这肯定就是北极星服务端启动的核心入口。我们来简单看看，**server.go#Start(configFilePath string)** 主要做了哪些事情


```go
func Start(configFilePath string) {
	// 根据所给定的配置文件路径信息，加载对应的配置文件内容, 这里指的就是 polaris-server.yaml 中的内容
	cfg, err := boot_config.Load(configFilePath)
        ...
	// 根据配置文件内容中对于日志模块的配置, 初始化日志模块
	err = log.Configure(cfg.Bootstrap.Logger)
        // 初始化相关指标收集器
	metrics.InitMetrics()
	// 设置插件配置
	plugin.SetPluginConfig(&cfg.Plugin)

	// 初始化存储层
	store.SetStoreConfig(&cfg.Store)
	
	// 开启进入启动流程，初始化插件，加载数据等
	var tx store.Transaction
        // 根据 ${bootstrap.startInOrder.key} 从存储层获取一把锁，如果锁获取成功，则继续执行
	tx, err = StartBootstrapInOrder(s, cfg)
	if err != nil {
		// 多次尝试加锁失败
		fmt.Printf("[ERROR] bootstrap fail: %v\n", err)
		return
	}
        // 启动北极星服务端的功能模块（服务发现、服务治理、配置中心等等）
	err = StartComponents(ctx, cfg)
	...
	// 启动北极星的 apiserver 插件，对于 polaris-server.yaml 中配置的 apiserver 均会进行启动
	servers, err := StartServers(ctx, cfg, errCh)
        
        // 北极星服务端自注册逻辑，方便其他节点感知到自己的存在
	if err := polarisServiceRegister(&cfg.Bootstrap.PolarisService, cfg.APIServers); err != nil {
		fmt.Printf("[ERROR] register polaris service fail: %v\n", err)
		return
	}
        // 服务端启动完成，发起请求到存储层，释放名为${bootstrap.startInOrder.key}的锁
        // 其他北极星节点便可以获取到锁之后继续完成自己的启动逻辑
	_ = FinishBootstrapOrder(tx)
	fmt.Println("finish starting server")
        
        // 简单的死循环逻辑，监听 os.Signal 完成 apiserver 重启、服务端优雅下线逻辑
	RunMainLoop(servers, errCh)
}
```

简单的梳理 **server.go#Start(configFilePath string)** 中逻辑，主要就是做了这么几个事情
- 配置文件加载识别、初始化相关功能模块配置
- 从存储层申请用于进程启动的分布式锁
- 启动服务端功能模块
- 释放自身对于启动分布式锁的占用
- 启动 apiserver

接着我们来看下功能模块是如何逐个开启的。

### 功能模块启用

北极星的功能模块主要有三个

- APIServer
- 命名空间
- 服务注册发现、服务治理
- 配置中心

北极星的旁路功能模块则为

- 数据存储层
- 资源鉴权
- 数据缓存
- 运维模块

#### APIServer 模块初始化

北极星的 APIServer 层，通过插件化的设计，将北极星的能力通过各个协议对外提供，以及对其他注册中心组件的协议兼容。APIServer 的定义如下

```golang
type Apiserver interface {
	// GetProtocol API协议名
	GetProtocol() string
	// GetPort API的监听端口
	GetPort() uint32
	// Initialize API初始化逻辑
	Initialize(ctx context.Context, option map[string]interface{}, api map[string]APIConfig) error
	// Run API服务的主逻辑循环
	Run(errCh chan error)
	// Stop 停止API端口监听
	Stop()
	// Restart 重启API
	Restart(option map[string]interface{}, api map[string]APIConfig, errCh chan error) error
}
```

可以看到，APIServer interface 只是定义了 APIServer 插件的相关生命周期定义，并没有具体限制 APIServer 改如何处理数据请求，因此使得 APIServer 相关插件实现，即可以将北极星的能力通过 gRPC、HTTP 协议对外提供，同时也可以通过 APIServer 插件对 eureka、xds 等第三方协议进行适配，将其转换为北极星的相关能力接口以及数据模型。
当前北极星 APIServer 已有的插件列表如下
- httpserver: 通过 HTTP 协议对外提供北极星服务端的 OpenAPI 以及和客户端进行数据通信的 ClientAPI
- grpcserver: 通过 gRPC 协议提供北极星和客户端进行数据通信
- eurekaserver: 通过 HTTP 协议，将 eureka 的能力适配成北极星的相关能力接口，以及将 eureka 数据模型映射为北极星的数据模型
- xdsv3server: 根据 xds control plane 的协议标准，将北极星的服务模型、治理模型转为 xds 模型，对外提供 xds 的能力，使得北极星可以对接 envoy 等相关基于 xds 实现的数据面


#### 数据缓存模块初始化

```golang
// StartComponents start health check and naming components
func StartComponents(ctx context.Context, cfg *boot_config.Config) error {
    var err error
    ...
    // 初始化缓存模块
    if err := cache.Initialize(ctx, &cfg.Cache, s); err != nil {
        return err
    }
}
```

缓存层模块初始化的触发在 **StartComponents** 流程中，在初始化过程中，会根据 polaris-server.yaml 配置文件中关于 cache 配置的 resources 列表，按需启动相关资源的 cache 实现

```golang
// 构建 CacheManager 对象实例，并构造所有资源的 Cache 接口实现实例
func newCacheManager(_ context.Context, cacheOpt *Config, storage store.Store) (*CacheManager, error) {
	SetCacheConfig(cacheOpt)
	mgr := &CacheManager{
		storage:       storage,
		caches:        make([]Cache, CacheLast),
		comRevisionCh: make(chan *revisionNotify, RevisionChanCount),
		revisions:     map[string]string{},
	}
        // 构建服务实例缓存 cache
	ic := newInstanceCache(storage, mgr.comRevisionCh)
        // 构建服务缓存 cache
	sc := newServiceCache(storage, mgr.comRevisionCh, ic)
	mgr.caches[CacheService] = sc
	mgr.caches[CacheInstance] = ic
        // 构建路由规则缓存 cache
	mgr.caches[CacheRoutingConfig] = newRoutingConfigCache(storage, sc)
	// 构建限流规则缓存 cache
	mgr.caches[CacheRateLimit] = newRateLimitCache(storage)
        // 构建熔断规则缓存 cache
	mgr.caches[CacheCircuitBreaker] = newCircuitBreakerCache(storage)

	notify := make(chan interface{}, 8)
        // 构建用户列表缓存 cache
	mgr.caches[CacheUser] = newUserCache(storage, notify)
        // 构建鉴权策略缓存 cache
	mgr.caches[CacheAuthStrategy] = newStrategyCache(storage, notify, mgr.caches[CacheUser].(UserCache))
        // 构建命名空间缓存 cache
	mgr.caches[CacheNamespace] = newNamespaceCache(storage)
        // 构建SDK实例信息缓存 cache
	mgr.caches[CacheClient] = newClientCache(storage)

	if len(mgr.caches) != CacheLast {
		return nil, errors.New("some Cache implement not loaded into CacheManager")
	}

	...
        // 根据 polaris-server.yaml 配置完成最终的缓存模块启动
	if err := mgr.initialize(); err != nil {
		return nil, err
	}

	return mgr, nil
}

// initialize 缓存对象初始化
func (nc *CacheManager) initialize() error {
	for _, obj := range nc.caches {
		var option map[string]interface{}
                // 根据配置文件中的 resource 列表，按需启动相关的 cache
		for _, entry := range config.Resources {
			if obj.name() == entry.Name {
				option = entry.Option
				break
			}
		}
		if err := obj.initialize(option); err != nil {
			return err
		}
	}

	return nil
}
```


#### 资源鉴权模块初始化

```golang
// StartComponents start health check and naming components
func StartComponents(ctx context.Context, cfg *boot_config.Config) error {
	...

	cacheMgn, err := cache.GetCacheManager()
	if err != nil {
		return err
	}

	// 初始化鉴权层
	if err = auth.Initialize(ctx, &cfg.Auth, s, cacheMgn); err != nil {
		return err
	}
}
```

资源鉴权模块初始化的触发在 **StartComponents** 流程中，由于资源鉴权模块主要任务是根据配置的鉴权规则，针对每次请求都进行一次策略计算，因此为了节省查询相关规则的时间，以及鉴权规则信息、用户信息变化不频繁的假定之下，资源鉴权模块默认从资源缓存模块中获取相关对象，执行计算并返回最终的资源鉴权结果。

#### 命名空间模块模块初始化

```golang
// StartComponents start health check and naming components
func StartComponents(ctx context.Context, cfg *boot_config.Config) error {
        ...
	// 初始化命名空间模块
	if err := namespace.Initialize(ctx, &cfg.Namespace, s, cacheMgn); err != nil {
		return err
	}
}
```

命名空间模块初始化的触发在 **StartComponents** 流程中，polaris 的服务注册发现、配置中心的模型设计中都依赖命名空间，因此将命名空间相关能力独立出来。
命名空间模块相关的数据操作不是非常频繁，数据操作都是直接和数据存储层进行交互，而依赖缓存模块则是为了解决在创建服务、配置时触发的命名空间自动创建动作，为了减少对数据存储层的调用，通过缓存存在性判断以及 singleflight.Group 组件来实现。

#### 服务注册发现、服务治理模块初始化

```golang
// StartComponents start health check and naming components
func StartComponents(ctx context.Context, cfg *boot_config.Config) error {
        ...
	// 初始化服务发现模块相关功能
	if err := StartDiscoverComponents(ctx, cfg, s, cacheMgn, authMgn); err != nil {
		return err
	}
}
```

服务注册发现、服务治理模块初始化的触发在 **StartComponents** 流程中的 **StartDiscoverComponents** 方法。**StartDiscoverComponents** 具体做的事情如下

- 创建注册、反注册批量控制器
    - 为了提高服务端注册、反注册的TPS，这里做了一个数据写操作的Batch优化，尽可能将一段时间内一定量的数据写操作合并成一个大的数据写操作发往数据存储层，减少对于数据存储层的调用次数以及带来的额外网络开销，提升整体服务端的请求吞吐量
- 创建服务实例健康检查组件
    - 对于服务实例的健康状态检查，有专门的 HealthCheckerServer 进行处理，该模块会监听缓存模块中的InstanceCache的数据变化事件，从中选择开启了健康检查的实例，将其纳入健康检查任务的TimeWheel中进行周期性调度检查
    - 实例的健康检查机制，当前 polaris 服务端做了插件化设计，默认 HealthCheck 插件实现为检查实例的心跳上报周期，该实现有两种具体的实现方式，针对单机模式来说具体实现为 heartbeatMemory，即实例的心跳数据存储在服务端内部中；针对集群模式来说具体实现为 heartbeatRedis，即实例的心跳数据存储在 redis 集群中，从而各个服务端节点都可以获取到任意实例的上次心跳上报时间。
- 创建 naming.Service 接口实例，完成服务注册发现、服务治理模块的初始化
- 创建带 auth 能力的 naming.Service 接口实例，注入资源权限检查能力。

#### 配置中心模块初始化

```golang
// StartComponents start health check and naming components
func StartComponents(ctx context.Context, cfg *boot_config.Config) error {
        ...
	// 初始化配置中心模块相关功能
	if err := StartConfigCenterComponents(ctx, cfg, s, cacheMgn, authMgn); err != nil {
		return err
	}
}
```

配置中心模块初始化的触发在 **StartComponents** 流程中的 **StartConfigCenterComponents** 方法。**StartConfigCenterComponents** 具体做的事情如下

- 创建配置文件缓存组件，加速客户端读取配置文件，减少和存储层的交互次数
- 创建 Watch 客户端链接管理组件，管理每条链接上感兴趣的配置文件列表。
- 创建配置发布事件中心，通过配置发布事件以及 Watch 客户端连接管理组件，将相关配置变更事件通知给相关的客户端，实现配置监听能力


## 服务端启动流程图


![yuque_mind.jpeg](image_1.webp)