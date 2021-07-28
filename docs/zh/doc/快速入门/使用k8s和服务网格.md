# 使用 k8s 和服务网格

## 概览
在 `Polaris` 的服务网格方案中，`Polaris` 是您的控制平面，`Envoy Sidecar` 代理是您的数据平面。

`Polaris Controller` 可以同步您 Kubernetes 集群上的 Namespace，Service，Endpoints 等资源到 `Polaris` 中，同时 `Polaris Controller` 提供了 `Envoy Sidecar` 注入器功能，可以轻松地将 `Envoy Sidecar` 注入到您的 Kubernetes Pod 中，Envoy Sidecar 会自动去 Polaris 同步服务信息。

本指南将逐步介绍 `Polaris Controller` 的安装和配置，并介绍如何在网格中使用 `Polaris` 服务治理功能。

## 环境准备

### 准备 polaris 后台环境

您需要先下载 `Polaris` 并启动，详细可参考[服务端安装指南](https://github.com/PolarisMesh/website/blob/main/docs/zh/doc/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/%E5%AE%89%E8%A3%85%E6%9C%8D%E5%8A%A1%E7%AB%AF.md)

### 部署 polaris-controller 

您需要在应用所在的 Kubernetes 集群部署 `Polaris Controller` ，如果您有多个 Kubernetes 集群需要接入 `Polaris` ，需要在每个集群安装一次。详细安装步骤可参考 [Polaris Controller 文档](https://github.com/PolarisMesh/polaris-controller)。

## 快速接入

### 启用 sidecar 自动注入功能

以下命令为 `default` 命名空间启用注入，`Polaris Controller` 的注入器，会将 `Envoy Sidecar` 容器注入到在此命名空间下创建的 pod 中：

```
kubectl label namespace default polaris-injection=enabled 
```

使用一下命令来验证 `default` 命名空间是否已经正确启用：

```
kubectl get namespace -L polaris-injection
```

此时应该返回：

```
NAME             STATUS   AGE    POLARIS-INJECTION
default          Active   3d2h   enabled
polaris-system   Active   3d2h   
```

部署示例 demo 验证注入功能：

参考 [Polaris Samples 项目](https://github.com/PolarisMesh/samples)，部署示例 demo: 

```
kubectl create -f sample/bookinfo.yaml
```

可以看到运行起来的 pod 均包含两个容器，其中第一个容器是用户的业务容器，第二个容器是由 Polaris Controller 注入器注入的 Envoy Sidecar 容器。您可以通过下面的命令来获取有关 pod 的更多信息：

```
kubectl describe pods -l app=productpage
```

此时应返回：

```
... ...
Init Containers:
# polaris-bootstrap-writer 产生 Envoy 的 Bootstrap 配置
polaris-bootstrap-writer:
... ... 
# istio-init 为 envoy sidecar 设置流量拦截
istio-init:
... ... 
Containers:
# demo 的业务容器
productpage:
... ...
# Envoy 是代理流量的容器
envoy:
... ... 
```

更多自动注入相关的配置，请参考 [Polaris Controller 文档](https://github.com/PolarisMesh/polaris-controller)。

### 服务注册与发现

1. 服务注册

`Polaris Controller` 默认会将其所在的 Kubernetes 集群上的 Namespace、Service 和 Endpoints 同步到 `Polaris`，分别对应 `Polaris` 中的命名空间、服务和服务实例。`Polaris Controller` 负责维护服务实例状态，当服务实例的 Pod 的状态由 Running 变为非 Running 时，`Polaris Controller` 会将这个 `Polaris 实例` 的状态设置为异常，同时更新返回给 `Envoy Sidecar` 的实例列表，将该 Pod 移除。

2. 服务发现

注入了 `Envoy Sidecar` 后，Envoy 会主动进行服务发现，同步该命名空间下所有的服务和服务实例。业务容器可以通过服务名访问上游服务，同时也可以通过 k8s 支持的 Service 的域名访问上游服务，例如 demo 中的 productpage 服务会访问 reviews 服务，可以通过以下的域名访问：

```
"reviews",
"reviews.default",
"reviews.default.svc",
"reviews.default.svc.cluster",
"reviews.default.svc.cluster.local",
"reviews:9080",
"reviews.default:9080",
"reviews.default.svc:9080",
"reviews.default.svc.cluster:9080",
"reviews.default.svc.cluster.local:9080"
```

### 服务路由与负载均衡

`Polaris` 网格支持根据请求 header 中的字段进行路由。

1. 使用场景

demo 项目中，productpage 会访问 reviews 服务，reviews 服务共有三个实例，三个实例分别部署了三个版本（会显示红、绿、蓝三种颜色的星星），需要保证特定的灰度用户，请求到特定版本的 reviews 服务。具体 demo 的用法，参考 demo 项目。

2. 为 reviews 服务实例标签

为 reviews 服务的其中一个实例，为其中一个实例（例如红色星星版本的实例），新增实例标签：version=2。另外两个实例新增实例标签：version=1。

3. 创建路由规则

为 reviews 服务创建路由规则。将请求中 header 包含字段 end-user=jason 的请求，路由到 version=2 的服务实例中。同时再创建一条路由规则，指定标签键值为任意请求，路由到 version=1 的服务实例中。

4. 验证路由是否生效

未登陆时，刷新 productpage 的页面，可以看到随机返回三种颜色的星星。当使用 `jason` 登陆后，productpage 请求 reviews 时，会带上 header，end-user=jason，此时再刷新 productpage 页面，发现只会显示一种颜色的星星，即上面 version=2 的实例。

## 相关链接

[Polaris](https://github.com/polarismesh)
[Polaris Controller](https://github.com/PolarisMesh/polaris-controller)
[Polaris Demo](https://github.com/PolarisMesh/samples/tree/main/bookinfo)