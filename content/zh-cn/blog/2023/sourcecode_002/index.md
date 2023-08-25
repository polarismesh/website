---
date: 2023-04-06
layout: blog
title: "PolarisMesh系列文章——源码系列（服务如何注册）"
linkTitle: "PolarisMesh系列文章——源码系列（服务如何注册）"
slug: "source_code_analyze"
author: 春少
---

-- [转载自掘金](https://juejin.cn/post/7218871635762282555)

## 前话

**polaris-server** 作为PolarisMesh的控制面，该进程主要负责服务数据、配置数据、治理规则的管理以及下发至北极星SDK以及实现了xDS的客户端。

**polaris-server** 是如何处理客户端的服务注册请求的呢？服务数据是怎么存储的呢？带着这个疑问，我们来探究看下**polaris-server**的启动流程，看看北极星是实现的。


## 前期准备

- golang 环境，需要1.17.x +
- 准备 vscode 或者 goland
- 从github中clone一份 polaris-server 的源码，这里推荐从release-vx.y.z分支中选择一个分支进行学习，以下文章将基于[release-v1.12.0](https://github.com/polarismesh/polaris/tree/release-v1.12.0)分支进行研究
- 从github中clone一份 polaris-java 的源码，这里推荐从 release-vx.y.z 分支中选择一个分支进行学习，以下文章将基于[release-v1.10.0](https://github.com/polarismesh/polaris-java/tree/release-1.10.0)分支进行研究
  
## 正题

### 注册数据模型

> polaris-java

```java
InstanceRegisterRequest request = new InstanceRegisterRequest();
// 设置实例所属服务信息
request.setService(service);
// 设置实例所属服务的命名空间信息
request.setNamespace(namespace);
// 设置实例的 host 信息
request.setHost(host);
// 设置实例的端口信息
request.setPort(port);
// 可选，资源访问Token，即用户/用户组访问凭据，仅当服务端开启客户端鉴权时才需配置
request.setToken(token);
// 设置实例版本
request.setVersion(version);
// 设置实例的协议
request.setProtocol(protocol);
// 设置实例权重
request.setWeight(weight);
// 设置实例的标签
request.setMetadata(metadata);
// 设置实例地理位置 zone 信息
request.setZone(zone);
// 设置实例地理位置 region 信息
request.setRegion(region);
// 设置实例地理位置 campus 信息
request.setCampus(campus);
// ttl超时时间，如果节点要调用heartbeat上报，则必须填写，否则会400141错误码，单位：秒
request.setTtl(ttl);
```

> polaris-go

```golang
// InstanceRegisterRequest 注册服务请求
type InstanceRegisterRequest struct {
	// 必选，服务名
	Service string
	// 必选，命名空间
	Namespace string
	// 必选，服务监听host，支持IPv6地址
	Host string
	// 必选，服务实例监听port
	Port int
	// 可选，资源访问Token，即用户/用户组访问凭据，仅当服务端开启客户端鉴权时才需配置
	ServiceToken string
	// 以下字段可选，默认nil表示客户端不配置，使用服务端配置
	// 服务协议
	Protocol *string
	// 服务权重，默认100，范围0-10000
	Weight *int
	// 实例提供服务版本号
	Version *string
	// 用户自定义metadata信息
	Metadata map[string]string
	// 该服务实例是否健康，默认健康
	Healthy *bool
	// 该服务实例是否隔离，默认不隔离
	Isolate *bool
	// ttl超时时间，如果节点要调用heartbeat上报，则必须填写，否则会400141错误码，单位：秒
	TTL *int
    // Location 当前注册实例的地理位置信息，主要用于就近路由
	Location *Location
	// 可选，单次查询超时时间，默认直接获取全局的超时配置
	// 用户总最大超时时间为(1+RetryCount) * Timeout
	Timeout *time.Duration
	// 可选，重试次数，默认直接获取全局的超时配置
	RetryCount *int
}
```

### 客户端发起注册请求

可以先通过官方的 SDK 使用手册来看看是如何使用SDK的服务注册。

- [polaris-java 服务注册功能使用](https://polarismesh.cn/docs/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/java%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91/sdk/%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E5%8F%91%E7%8E%B0/)
- [polaris-go 服务注册功能使用](https://polarismesh.cn/docs/%E4%BD%BF%E7%94%A8%E6%8C%87%E5%8D%97/go%E5%BA%94%E7%94%A8%E5%BC%80%E5%8F%91/sdk/%E6%9C%8D%E5%8A%A1%E6%B3%A8%E5%86%8C%E5%8F%91%E7%8E%B0/)

这里我们已 polaris-java 为例，看看 polaris-java 如何将服务实例注册请求发送至北极星服务端。

#### 发起注册请求

```java
ProviderAPI providerAPI = DiscoveryAPIFactory.createProviderAPI();
InstanceRegisterRequest registerRequest = new InstanceRegisterRequest();
// 初始化服务实例注册信息
...
InstanceRegisterResponse registerResp = providerAPI.registerInstance(registerRequest);
```

通过这个简单示例代码可知，服务实例的注册动作是通过 polaris-java 中 **ProviderAPI**（负责服务实例注册相关方法的调用） 的 **registerInstance** 方法完成。

通过 IDEA 或者 vscode，查看这个方法的具体实现：

```java
@Override
public InstanceRegisterResponse registerInstance(InstanceRegisterRequest req) throws PolarisException {
    if (req.getTtl() == null) {
        req.setTtl(DEFAULT_INSTANCE_TTL);
    }
    return registerFlow.registerInstance(req, this::doRegister, this::heartbeat);
}
```

当调用 **providerAPI.registerInstance** 后，SDK 内部会自动设置实例的 TTL 周期，然后交由 **RegisterFlow** 这个负责注册动作的流程编排者执行。因此接着看看这个 **RegisterFlow** 的定义

```java
public class RegisterFlow {

    // 异步注册header key
    private static final String HEADER_KEY_ASYNC_REGIS = "async-regis";
    // 最大连续心跳失败阈值
    private static final int HEARTBEAT_FAIL_COUNT_THRESHOLD = 2;
    // SDK 上下文，包括SDK配置、SDK插件实例管理、内部任务流程编排等等
    private final SDKContext sdkContext;
    // 发送实例心跳
    private final ScheduledThreadPoolExecutor asyncRegisterExecutor;

    ...
}
```

其实 **RegisterFlow** 就干两件事件
- 发起实例注册动作
- 内部维护每个实例的心跳上报

```java
public InstanceRegisterResponse registerInstance(InstanceRegisterRequest request, RegisterFunction registerFunction,
        HeartbeatFunction heartbeatFunction) {
    // 将注册请求发送至北极星服务端
    InstanceRegisterResponse instanceRegisterResponse = registerFunction.doRegister(request,
            createRegisterV2Header());
    // 当前实例的注册管理状态进行本地保存
    RegisterState registerState = RegisterStateManager.putRegisterState(sdkContext, request);
    if (registerState != null) {
        // 首次存入实例的注册状态时，为该实例注册创建定期心跳上报动作任务
        registerState.setTaskFuture(asyncRegisterExecutor.scheduleWithFixedDelay(
                () -> doRunHeartbeat(registerState, registerFunction, heartbeatFunction), request.getTtl(),
                request.getTtl(), TimeUnit.SECONDS));
    }
    return instanceRegisterResponse;
}
```

来看看 registerFunction.doRegister 的主要流程以及如何将请求发送到服务端

```java
// com.tencent.polaris.discovery.client.flow.RegisterFlow#registerInstance
private InstanceRegisterResponse doRegister(InstanceRegisterRequest req, Map<String, String> customHeader) {
    checkAvailable("ProviderAPI");
    Validator.validateInstanceRegisterRequest(req);
    // 填充注册实例的地理位置信息
    enrichInstanceLocation(req);

    ...
    // 调用协议插件，发起网络调用
    CommonProviderResponse response = serverConnector.registerInstance(request, customHeader);
    ...
}

// com.tencent.polaris.plugins.connector.grpc.GrpcConnector#registerInstance
public CommonProviderResponse registerInstance(CommonProviderRequest req, Map<String, String> customHeader)
        throws PolarisException {
    ...
    try {
        waitDiscoverReady();
        // 从连接池中获取一个链接
        connection = connectionManager
                .getConnection(GrpcUtil.OP_KEY_REGISTER_INSTANCE, ClusterType.SERVICE_DISCOVER_CLUSTER);
        req.setTargetServer(connectionToTargetNode(connection));
        // 根据 Connection 创建一个 gRPC Stub
        PolarisGRPCGrpc.PolarisGRPCBlockingStub stub = PolarisGRPCGrpc.newBlockingStub(connection.getChannel());
        ...
        // 向服务端发起 gRPC 请求，完成服务实例的注册
        ResponseProto.Response registerInstanceResponse = stub.registerInstance(buildRegisterInstanceRequest(req));
    ...
}
```



### 服务端处理注册请求

当实例注册请求从北极星 SDK 发出之后，数据流就来到了北极星服务端处，由北极星的 apiserver 层进行接收并处理，由于北极星 SDK 和服务端的数据通信走的是 gRPC 协议，因此这里请求就会在基于 gRPC 实现的 apiserver 插件中进行处理

```go
// RegisterInstance 注册服务实例
func (g *DiscoverServer) RegisterInstance(ctx context.Context, in *apiservice.Instance) (*apiservice.Response, error) {
	// 需要记录操作来源，提高效率，只针对特殊接口添加operator
	rCtx := grpcserver.ConvertContext(ctx)
	rCtx = context.WithValue(rCtx, utils.StringContext("operator"), ParseGrpcOperator(ctx))

	// 客户端请求中带了 token 的，优先已请求中的为准
	if in.GetServiceToken().GetValue() != "" {
		rCtx = context.WithValue(rCtx, utils.ContextAuthTokenKey, in.GetServiceToken().GetValue())
	}

	grpcHeader := rCtx.Value(utils.ContextGrpcHeader).(metadata.MD)

	if _, ok := grpcHeader["async-regis"]; ok {
		rCtx = context.WithValue(rCtx, utils.ContextOpenAsyncRegis, true)
	}

	out := g.namingServer.RegisterInstance(rCtx, in)
	return out, nil
}
```

在 gRPC apiserver 层处理好请求之后，接着就调用 **g.namingServer.RegisterInstance(rCtx, in)** 将服务实例数据写进北极星集群中。

```go
// CreateInstance create a single service instance
func (s *Server) CreateInstance(ctx context.Context, req *apiservice.Instance) *apiservice.Response {
	...
	data, resp := s.createInstance(ctx, req, &ins)
	...
        // 发布实例上线事件 & 记录实例注册操作记录
	s.sendDiscoverEvent(*event)
	s.RecordHistory(ctx, instanceRecordEntry(ctx, req, svc, data, model.OCreate))
	...
}

// createInstance store operate
func (s *Server) createInstance(ctx context.Context, req *apiservice.Instance, ins *apiservice.Instance) (
	*model.Instance, *apiservice.Response) {
	// 自动创建实例所在的服务信息
	svcId, errResp := s.createWrapServiceIfAbsent(ctx, req)
	if errResp != nil {
		log.Errorf("[Instance] create service if absent fail : %+v, req : %+v", errResp.String(), req)
		return nil, errResp
	}
	if len(svcId) == 0 {
		log.Errorf("[Instance] create service if absent return service id is empty : %+v", req)
		return nil, api.NewResponseWithMsg(apimodel.Code_BadRequest, "service id is empty")
	}

	// 根据 CMDB 插件填充实例的地域信息
	s.packCmdb(ins)
        // 如果没有开启实例批量注册，则同步调用存储层接口将实例数据进行持久化
	if namingServer.bc == nil || !namingServer.bc.CreateInstanceOpen() {
		return s.serialCreateInstance(ctx, svcId, req, ins) // 单个同步
	}
        // 如果开启了实例批量注册，则会将注册请求丢入一个异步队列进行处理
	return s.asyncCreateInstance(ctx, svcId, req, ins) // 批量异步
}
```

##### 同步注册实例

```go
func (s *Server) serialCreateInstance(
	ctx context.Context, svcId string, req *apiservice.Instance, ins *apiservice.Instance) (*model.Instance, *apiservice.Response) {
	...
	instance, err := s.storage.GetInstance(ins.GetId().GetValue())
	...
	// 如果存在，则替换实例的属性数据，但是需要保留用户设置的隔离状态，以免出现关键状态丢失
	if instance != nil && ins.Isolate == nil {
		ins.Isolate = instance.Proto.Isolate
	}
	// 直接同步创建服务实例
	data := instancecommon.CreateInstanceModel(svcId, ins)

	// 创建服务实例时，需要先锁住服务，避免在创建实例的时候把服务信息删除导致出现错误的数据
	_, releaseFunc, errCode := s.lockService(ctx, req.GetNamespace().GetValue(),
		req.GetService().GetValue())
	if errCode != apimodel.Code_ExecuteSuccess {
		return nil, api.NewInstanceResponse(errCode, req)
	}

	defer releaseFunc()
        // 调用存储层直接写实例信息
	if err := s.storage.AddInstance(data); err != nil {
		log.Error(err.Error(), utils.ZapRequestID(rid), utils.ZapPlatformID(pid))
		return nil, wrapperInstanceStoreResponse(req, err)
	}
	return data, nil
}
```

##### 异步注册实例

```go
func (s *Server) asyncCreateInstance(
	ctx context.Context, svcId string, req *apiservice.Instance, ins *apiservice.Instance) (
	*model.Instance, *apiservice.Response) {
	allowAsyncRegis, _ := ctx.Value(utils.ContextOpenAsyncRegis).(bool)
        // 将实例注册请求放入异步任务池中
	future := s.bc.AsyncCreateInstance(svcId, ins, !allowAsyncRegis)
        // 等待任务完成
	if err := future.Wait(); err != nil {
		if future.Code() == apimodel.Code_ExistedResource {
			req.Id = utils.NewStringValue(ins.GetId().GetValue())
		}
		return nil, api.NewInstanceResponse(future.Code(), req)
	}

	return instancecommon.CreateInstanceModel(svcId, req), nil
}
```

### 存储层处理注册数据

北极星的存储层是插件化设计，单机模式下是采用 boltdb，集群模式则是依赖 MySQL，这里只说集群模式下的存储层处理。

依赖 MySQL 的存储层实现中，针对实例信息，北极星将其拆分成了三个表

> 实例主要信息

```sql
CREATE TABLE `instance`
(
    `id`                  varchar(128) NOT NULL comment 'Unique ID',
    `service_id`          varchar(32)  NOT NULL comment 'Service ID',
    `vpc_id`              varchar(64)           DEFAULT NULL comment 'VPC ID',
    `host`                varchar(128) NOT NULL comment 'instance Host Information',
    `port`                int(11)      NOT NULL comment 'instance port information',
    `protocol`            varchar(32)           DEFAULT NULL comment 'Listening protocols for corresponding ports, such as TPC, UDP, GRPC, DUBBO, etc.',
    `version`             varchar(32)           DEFAULT NULL comment 'The version of the instance can be used for version routing',
    `health_status`       tinyint(4)   NOT NULL DEFAULT '1' comment 'The health status of the instance, 1 is health, 0 is unhealthy',
    `isolate`             tinyint(4)   NOT NULL DEFAULT '0' comment 'Example isolation status flag, 0 is not isolated, 1 is isolated',
    `weight`              smallint(6)  NOT NULL DEFAULT '100' comment 'The weight of the instance is mainly used for LoadBalance, default is 100',
    `enable_health_check` tinyint(4)   NOT NULL DEFAULT '0' comment 'Whether to open a heartbeat on an instance, check the logic, 0 is not open, 1 is open',
    `logic_set`           varchar(128)          DEFAULT NULL comment 'Example logic packet information',
    `cmdb_region`         varchar(128)          DEFAULT NULL comment 'The region information of the instance is mainly used to close the route',
    `cmdb_zone`           varchar(128)          DEFAULT NULL comment 'The ZONE information of the instance is mainly used to close the route.',
    `cmdb_idc`            varchar(128)          DEFAULT NULL comment 'The IDC information of the instance is mainly used to close the route',
    `priority`            tinyint(4)   NOT NULL DEFAULT '0' comment 'Example priority, currently useless',
    `revision`            varchar(32)  NOT NULL comment 'Instance version information',
    `flag`                tinyint(4)   NOT NULL DEFAULT '0' comment 'Logic delete flag, 0 means visible, 1 means that it has been logically deleted',
    `ctime`               timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP comment 'Create time',
    `mtime`               timestamp    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'Last updated time',
    PRIMARY KEY (`id`),
    KEY `service_id` (`service_id`),
    KEY `mtime` (`mtime`),
    KEY `host` (`host`)
) ENGINE = InnoDB;
```

> 实例健康检查的类型

```sql
CREATE TABLE `health_check`
(
    `id`   varchar(128) NOT NULL comment 'Instance ID',
    `type` tinyint(4)   NOT NULL DEFAULT '0' comment 'Instance health check type',
    `ttl`  int(11)      NOT NULL comment 'TTL time jumping',
    PRIMARY KEY (`id`),
    CONSTRAINT `health_check_ibfk_1` FOREIGN KEY (`id`) REFERENCES `instance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;
```

> 实例的元数据

```sql
CREATE TABLE `instance_metadata`
(
    `id`     varchar(128)  NOT NULL comment 'Instance ID',
    `mkey`   varchar(128)  NOT NULL comment 'instance label of Key',
    `mvalue` varchar(4096) NOT NULL comment 'instance label Value',
    `ctime`  timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP comment 'Create time',
    `mtime`  timestamp     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP comment 'Last updated time',
    PRIMARY KEY (`id`, `mkey`),
    KEY `mkey` (`mkey`),
    CONSTRAINT `instance_metadata_ibfk_1` FOREIGN KEY (`id`) REFERENCES `instance` (`id`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE = InnoDB;
```

因此在操作存储层持久化服务实例信息时，需要做以下几个操作

```go
// 添加实例主信息
if err := batchAddMainInstances(tx, instances); err != nil {
	log.Errorf("[Store][database] batch add main instances err: %s", err.Error())
	return err
}
// 添加实例的健康检查信息
if err := batchAddInstanceCheck(tx, instances); err != nil {
	log.Errorf("[Store][database] batch add instance check err: %s", err.Error())
	return err
}
// 先清理实例原先的 metadata 信息数据，确保不会遗留脏数据
if err := batchDeleteInstanceMeta(tx, instances); err != nil {
	log.Errorf("[Store][database] batch delete instance metadata err: %s", err.Error())
	return err
}
// 添加实例的 metadata 信息
if err := batchAddInstanceMeta(tx, instances); err != nil {
	log.Errorf("[Store][database] batch add instance metadata err: %s", err.Error())
	return err
}
```
