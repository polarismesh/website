---
title: "JavaAgent 接入"
linkTitle: "JavaAgent 接入"
weight: 6
---

{{< notice tip >}} 该文章仅适用于北极星服务端版本 >= 1.18.0, polaris-controller 版本 >= 1.7.0 {{< /notice >}} 

## 技术原理

在 `Polaris` 的 JavaAgent 接入方案中，`Polaris` 是您的控制平面，`Polaris JavaAgent` 将北极星的服务治理能力通过字节码增强的方式，让业务应用无需任何代码改造即可享受到北极星的服务治理体验。

![](../images/javaagent/javaagent_structure.png)

> Kubernetes 场景

- polaris-server: 北极星服务端，处理服务注册以及服务发现请求。
- polaris-controller: 完成 polaris-javaagent 容器的注入以及在业务 POD 中无侵入的开启 Java Agent 的能力。
- polaris-javaagent-init: 负责将 polaris-javaagent 物料下载到业务 Container 中，同时初始化 Java Agent 所需要的配置信息。

## 环境准备

### 部署polaris

如果已经部署好了polaris，可忽略这一步。

polaris支持在kubernetes环境中进行部署，注意必须保证暴露HTTP端口为8090，gRPC端口为8091。具体部署方案请参考：

- [单机版部署指南](/docs/使用指南/服务端安装/单机版安装/)
- [集群版部署指南](/docs/使用指南/服务端安装/集群版安装/)

### 部署 polaris-controller 

- [controller 部署](/docs/使用指南/k8s和网格代理/安装polaris-controller/)

## 快速接入

### 服务调用关系说明

![](../images/javaagent/springcloud.png)

### 启用 POD 注入功能

创建命名空间 `javaagent`

```
kubectl create namespace javaagent
```

为 `javaagent` 命名空间启用注入：
  
```
kubectl label namespace javaagent polaris-injection=enabled 
```

使用一下命令来验证 `javaagent` 命名空间是否已经正确启用：

```
kubectl get namespace -L polaris-injection
```

此时应该返回：

```
NAME             STATUS   AGE    POLARIS-INJECTION
javaagent          Active   3d2h   enabled
```

### 启用 JavaAgent 自动注入

{{< note >}}
- polaris-controller 需要 >= 1.7.0 版本
{{</ note >}}

在 POD 中添加以下 annonations 即可

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: annotations-demo
  annotations:
    polarismesh.cn/javaagent: "true"
    polarismesh.cn/javaagentVersion: "{填写 polaris-java-agent 的版本}"
    polarismesh.cn/javaagentFrameworkName: "spring-cloud"
    polarismesh.cn/javaagentFrameworkVersion: "hoxton｜2020｜2021 选择对应的版本填入"
```

### 查看 JavaAgent 是否注入成功

使用一下命令来验证 `javaagent` 命名空间是否已经正确启用：

```
kubectl describe pod {目标业务POD名称} -n {javaagent}
```

### 查看服务是否注册到北极星

> 通过日志确定


> 查看北极星控制台确认


### 验证限流功能

> 设置限流规则

> 调用接口触发限流

### 验证路由功能

> 设置路由规则


> 不携带特定参数


> 携带特定参数