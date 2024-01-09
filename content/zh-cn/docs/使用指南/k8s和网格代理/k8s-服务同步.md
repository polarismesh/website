---
title: "K8s 服务同步"
linkTitle: "K8s 服务同步"
weight: 2
---

支持两种 K8s Service 同步模式：

- all：全量同步服务。将 K8s Service 全部同步到北极星。
- demand：按需同步服务。默认不会将 K8s Service 同步到北极星，需要在 Namespace 或者 Service 上添加北极星的 annotation。

北极星支持跨 K8s 集群的服务发现和治理，多个 K8s 集群的 Service 可以同步到一个北极星集群，同步规则如下：

- K8s Namespace 和 Service 名称作为北极星的命名空间名称
- 如果多个 K8s 集群存在相同的 Namespace 和 Service，全部 Pod 同步到一个北极星服务中
- polaris-controller 在北极星服务实例上添加 clusterName 标签，用于区分来自不同 K8s 集群的服务实例
- 如果存在多个 K8s Service 同步到一个北极星服务的情况，每个 K8s 集群的 polaris-controller 需要配置不同的 clusterName

## 注解

| 注解名称                      | 注解描述                                                         |
|-------------------------------|--------------------------------------------------------------|
| polarismesh.cn/sync           | 是否同步这个服务到 polarismesh。true 同步，false 不同步，默认不同步 |
| polarismesh.cn/aliasService   | 把 k8s service 同步到 polarismesh 时，同时创建的服务别名的名字    |
| polarismesh.cn/aliasNamespace | 创建的别名所在的命名空间，配合 polarismesh.cn/aliasService 使用   |

## 使用指南

### 全量同步服务

以全量同步服务的模式启动 polaris-controller，将 K8s Service 全部同步到北极星，则 polaris-controller 的启动配置如下：

> polaris-controller 启动配置文件：[configmap.yaml](https://github.com/polarismesh/polaris-controller/blob/main/deploy/kubernetes_v1.22/kubernetes/configmap.yaml)

```yaml
apiVersion: v1
kind: ConfigMap
data:
  mesh: |-
    ...
    serviceSync
      mode: "all"
    ...
```



### 按需同步服务

以按需同步服务的模式启动 polaris-controller，默认不会将 K8s Service 同步到北极星，则 polaris-controller 的启动配置如下：

> polaris-controller 启动配置文件：[configmap.yaml](https://github.com/polarismesh/polaris-controller/blob/main/deploy/kubernetes_v1.22/kubernetes/configmap.yaml)

```yaml
apiVersion: v1
kind: ConfigMap
data:
  mesh: |-
    ...
    serviceSync
      mode: "demand"
    ...
```

如果需要将某个 Namespace 中的全部 Service 同步到北极星，请在 Namespace 上添加北极星的 annotation，配置方式如下： 

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: default
  annotations:
    polarismesh.cn/sync: "true"
```

如果需要将某个 Service 同步到北极星，请在 Service 上添加北极星的 annotation，配置方式如下： 

```yaml
apiVersion: v1
kind: Service
metadata:
  namespace: default
  name: test
  annotations:
    polarismesh.cn/sync: "true"
```

如果需要将某个 Namespace 中的 Service同步到北极星并且排除某个 Service，配置方式如下： 

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: default
  annotations:
    polarismesh.cn/sync: "true"

---
apiVersion: v1
kind: Service
metadata:
  namespace: default
  name: test
  annotations:
    polarismesh.cn/sync: "false"
```

### 创建服务别名

北极星支持服务别名的功能，允许为一个服务设置一个或者多个服务别名，使用服务别名进行服务发现的效果等同使用服务名称进行服务发现的效果。

polaris-controller 将 K8s Service 同步到北极星的名称映射规则如下：

- K8s Namespace作为北极星的命名空间名称
- K8s Service作为北极星的服务名称

如果需要在 Service 同步到北极星时，为其创建一个服务别名，配置方式如下：

```yaml
apiVersion: v1
kind: Service
metadata:
  namespace: default
  name: test
  annotations:
    polarismesh.cn/aliasNamespace: aliasDefault
    polarismesh.cn/aliasService: aliasTest
```
