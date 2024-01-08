---
title: "K8s 配置同步（Beta）"
linkTitle: "K8s 配置同步（Beta）"
weight: 3
---

{{< notice tip >}} 该文章仅适用于北极星服务端版本 >= 1.18.0 {{< /notice >}} 

支持两种 K8s ConfigMap 同步模式：

- all：全量同步配置。将 K8s ConfigMap 全部同步到北极星。
- demand：按需同步配置。默认不会将 K8s ConfigMap 同步到北极星，需要在 Namespace 或者 ConfigMap 上添加北极星的 annotation。

## 注解

| 注解名称                      | 注解描述                                                         |
|-------------------------------|--------------------------------------------------------------|
| polarismesh.cn/sync           | 是否同步这个配置到 polarismesh。true 同步，false 不同步，默认不同步 |

## 使用指南

### 全量同步服务

以全量同步配置的模式启动 polaris-controller，将 K8s ConfigMap 全部同步到北极星，则 polaris-controller 的启动配置如下：

> polaris-controller 启动配置文件：[configmap.yaml](https://github.com/polarismesh/polaris-controller/blob/main/deploy/kubernetes_v1.22/configmap.yaml)

```yaml
apiVersion: v1
kind: ConfigMap
data:
  mesh: |-
    ...
    configSync
      mode: "all"
    ...
```

### 按需同步配置

以按需同步配置的模式启动 polaris-controller，默认不会将 K8s ConfigMap 同步到北极星，则 polaris-controller 的启动配置如下：

> polaris-controller 启动配置文件：[configmap.yaml](https://github.com/polarismesh/polaris-controller/blob/main/deploy/kubernetes_v1.22/configmap.yaml)

```yaml
apiVersion: v1
kind: ConfigMap
data:
  mesh: |-
    ...
    configSync
      mode: "demand"
    ...
```

如果需要将某个 Namespace 中的全部 ConfigMap 同步到北极星，请在 Namespace 上添加北极星的 annotation，配置方式如下： 

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: default
  annotations:
    polarismesh.cn/sync: "true"
```

如果需要将某个 ConfigMap 同步到北极星，请在 ConfigMap 上添加北极星的 annotation，配置方式如下： 

```yaml
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: default
  name: test
  annotations:
    polarismesh.cn/sync: "true"
```

如果需要将某个 Namespace 中的 ConfigMap 同步到北极星并且排除某个 ConfigMap，配置方式如下： 

```yaml
apiVersion: v1
kind: Namespace
metadata:
  name: default
  annotations:
    polarismesh.cn/sync: "true"

---
apiVersion: v1
kind: ConfigMap
metadata:
  namespace: default
  name: test
  annotations:
    polarismesh.cn/sync: "false"
```
