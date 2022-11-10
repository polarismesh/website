---
title: "使用 SDK"
linkTitle: "使用 SDK"
weight: 1
---

## 功能简介

北极星网格提供多语言 SDK 作为高性能接入方式：

- [polaris-java](https://github.com/polarismesh/polaris-java)
- [polaris-go](https://github.com/polarismesh/polaris-go)
- [polaris-cpp](https://github.com/polarismesh/polaris-cpp)
- [polaris-php](https://github.com/polarismesh/polaris-php)

以插件化和配置化的方式实现服务发现和治理功能：

- 被调方功能：服务注册、上报心跳、限流
- 主调方功能：服务发现、动态路由、负载均衡、熔断降级
- 观测性功能：服务调用、熔断降级和限流的监控统计

## 接口说明

### 被调方功能接口

```
Register

功能：注册服务实例
描述：将实例注册到某个服务下，实例信息包含地址和元数据

Deregister

功能：反注册服务实例
描述：将某个服务下的实例反注册
```

```
Heartbeat

功能：上报心跳
描述：如果在注册服务实例时，开启服务端健康检查功能，需要定期上报心跳到服务端，不然服务实例状态异常
```

```
GetLimitQuota

功能：获取请求处理配额
描述：如果使用限流功能，在每次处理请求之前，获取请求处理配额。若有配额，则处理请求，否则拒绝处理请求
```

### 主调方功能接口

```
GetAllInstances

功能：获取全部实例
描述：获取注册到某个服务下的全部实例，包含健康、异常和隔离的实例。本接口只使用服务发现功能模块
```

```
GetOneInstance

功能：获取一个可用实例
描述：在每次服务调用之前，获取一个可用实例。本接口使用服务发现、动态路由、负载均衡和熔断降级功能模块
备注：几个功能模块采用插件化设计，默认插件配置适用于基本场景，可以根据业务场景调整插件配置

UpdateServiceCallResult

功能：上报服务调用结果
描述：在每次服务调用之后，上报本次服务调用的结果。服务调用结果用于熔断降级和监控统计
```

## 接口使用说明

### 服务被调方

```
// 在应用启动阶段，注册服务实例
Register(namespace, service, instance)

// 如果使用服务端健康检查功能，在应用运行阶段，需要定期上报心跳到服务端
{
    Heartbeat(namespace, service, instance)
}

// 如果使用限流功能，在每次处理请求之前，获取请求处理配额
{
    if( GetLimitQuota(limiter) ) {
        Handle(request)
    } else {
        Refuse(request)
    }
}

// 在应用停止阶段，反注册服务实例
Deregister(namespace, service, instance)
```

### 服务主调方

```
// 发起一次服务调用
{
    // 获取本次服务调用的实例
    instance = GetOneInstance(namespace, service)

    // 发起服务调用
    response = ServiceCall(instance.address, request)

    // 上报本次服务调用的结果
    UpdateServiceCallResult(instance.id, response.code, response.delay)
}
```

## 快速入门示例

各语言 SDK 的快速入门示例：

### Java语言

- [polaris-java 示例](https://github.com/polarismesh/polaris-java/tree/main/polaris-examples)

### Go语言

- [polaris-go 示例](https://github.com/polarismesh/polaris-go/tree/main/examples)

### C++语言

- [polaris-cpp 示例](https://github.com/polarismesh/polaris-cpp/tree/main/examples)

### PHP语言

- [polaris-php 示例](https://github.com/polarismesh/polaris-php/tree/php-7.x/examples)
