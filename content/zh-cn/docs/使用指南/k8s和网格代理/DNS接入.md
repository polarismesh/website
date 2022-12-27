---
title: "DNS 接入"
linkTitle: "DNS 接入"
weight: 4
---


在 `Polaris` 的服务网格方案中，`Polaris` 是您的控制平面，`Polaris Sidecar` 代理是您的数据平面。

![](../images/dns/架构图.png)

- 服务数据同步：`polaris-controller` 安装在用户的Kubernetes集群中，可以同步集群上的 Namespace，Service，Endpoints 等资源到 `polaris` 中，同时 `polaris-controller` 提供了 `Polaris Sidecar` 注入器功能，可以轻松地将 `Polaris Sidecar` 注入到您的 Kubernetes Pod 中，Polaris Sidecar 会自动去 Polaris 同步服务信息，并作为 POD 的默认 DNS 解析服务器，提供 DNS 协议的服务发现能力。


## 环境准备

### 部署polaris

如果已经部署好了polaris，可忽略这一步。

polaris支持在kubernetes环境中进行部署，注意必须保证暴露HTTP端口为8090，gRPC端口为8091。具体部署方案请参考：

- [单机版部署指南](/docs/使用指南/服务端安装/单机版安装/)
- [集群版部署指南](/docs/使用指南/服务端安装/集群版安装/)

### 部署 polaris-controller 

您需要在应用所在的 Kubernetes 集群部署 `polaris-controller` ，用于将集群中的服务数据接入到`polaris` （如果已经部署可忽略）。如果您有多个 Kubernetes 集群需要接入 `polaris` ，需要在每个集群都部署 `polaris-controller`。

#### 部署包下载

到`polaris-controller`的下载页面，根据您这边的kubernetes版本号（版本号小于等于1.21.x，选择k8s1.21.zip；版本号为1.22.x，选择k8s1.22.zip），下载最新版本polaris-controller安装包。

- [github下载](https://github.com/polarismesh/polaris-controller/releases)

#### 部署包安装

安装前，需确保kubectl命令已经加入环境变量Path中，并且可以访问kubernetes的APIServer。

以```polaris-controller-release_v1.3.0-beta.0.k8s1.21.zip```为例：

解压并进入部署包：

```
unzip polaris-controller-release_v1.3.0-beta.0.k8s1.21.zip
cd polaris-controller-release_v1.3.0-beta.0.k8s1.21
```

查询用户token，由于controller需要直接访问polaris的控制台OpenAPI，因此需要填写token。

- 打开北极星控制台，选择用户->用户列表->选择polaris用户->查看token，即可获取到token。

![](../images/envoy/查看token.png)

修改variables.txt文件，填写polaris的地址（只填IP或者域名，无需端口），如果在同一个集群中，则可以填写集群内域名，同时需要填写上一步所查询到的token

```
#polaris地址，只填IP或者域名，无需端口
POLARIS_HOST:polaris.polaris-system
#polaris的用户token
POLARIS_TOKEN:4azbewS+pdXvrMG1PtYV3SrcLxjmYd0IVNaX9oYziQygRnKzjcSbxl+Reg7zYQC1gRrGiLzmMY+w+aCxOYI=
```

执行安装部署。

```
./install.sh
```

## 快速接入

### 启用 sidecar 自动注入功能

- 为 `default` 命名空间启用注入：
  
```
kubectl label namespace default polaris-injection=enabled 
kubectl label namespace default polaris-sidecar-mode=dns 
```

### 部署样例

- 下载样例部署文件
  - [dns provider](https://github.com/polarismesh/examples/blob/main/dns/providuer/deployment.yaml)
  - [dns consumer](https://github.com/polarismesh/examples/blob/main/dns/consumer/deployment.yaml)

- 执行部署：```kubectl create -f deployment.yaml```

- 查看容器注入是否注入成功

启动自动注入后，`polaris-controller` 会将 `Polaris Sidecar` 容器注入到在此命名空间下创建的 pod 中。

可以看到运行起来的 pod 均包含两个容器，其中第一个容器是用户的业务容器，第二个容器是由 Polaris Controller 注入器注入的 Polaris Sidecar 容器。您可以通过下面的命令来获取有关 pod 的更多信息：

```
kubectl describe pods -l k8s-app=polaris-dns-provider --namespace=default
```

## 验证

- 进入 consumer POD, 执行 curl 命令

```bash
kubectl exec -it polaris-dns-consumer-xxx -n default -- /bin/bash

# 方式 1
curl http://127.0.0.1:20000/echo

# 方式 2
curl http://echoserver.default:10000/echo
```

- 返回结果

```log
bash-5.1# curl http://127.0.0.1:20000/echo -w "\n";
Hello, I'm DiscoverEchoServer Provider, My host : 10.1.0.111:10000

bash-5.1# curl http://127.0.0.1:20000/echo -w "\n";
Hello, I'm DiscoverEchoServer Provider, My host : 10.1.0.111:10000

bash-5.1# curl http://echoserver.default:10000/echo -w "\n";
Hello, I'm DiscoverEchoServer Provider, My host : 10.1.0.111:10000

bash-5.1# curl http://echoserver.default:10000/echo -w "\n";
Hello, I'm DiscoverEchoServer Provider, My host : 10.1.0.111:10000
```