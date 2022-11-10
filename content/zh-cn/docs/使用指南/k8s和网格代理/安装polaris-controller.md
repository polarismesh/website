---
title: "安装 Polaris Controller"
linkTitle: "安装 Polaris Controller"
weight: 1
---

## k8s controller的作用

北极星提供K8s controller的机制，可以安装在k8s集群中，通过接收集群内k8s apiserver的事件回调，将K8s Service以及POD注册成北极星的服务以及实例。

## 安装说明

k8s controller包含以下组件：

- polaris-controller：北极星controller服务端，主要是安装在k8s集群上，提供回调接口供k8s controller manager进行调用。

## 开始安装

### 部署包下载

到`polaris-controller`的下载页面，根据您这边的kubernetes版本号（版本号小于等于1.21.x，选择k8s1.21.zip；版本号为1.22.x，选择k8s1.22.zip），下载最新版本polaris-controller安装包。

- [github下载](https://github.com/polarismesh/polaris-controller/releases)

### 部署包安装

安装前，需确保kubectl命令已经加入环境变量Path中，并且可以访问kubernetes的APIServer。

以```polaris-controller-release_${version}.k8s1.21.zip```为例：

解压并进入部署包：

```
unzip polaris-controller-release_${version}.k8s1.21.zip
cd polaris-controller-release_${version}.k8s1.21
```

查询用户token，由于controller需要直接访问polaris的控制台OpenAPI，因此需要填写token。

- 打开北极星控制台，选择用户->用户列表->选择polaris用户->查看token，即可获取到token。

![](../images/controller/查看token.png)

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

### 安装后验证

安装成功后，可以在k8s集群中，polaris-system命名空间，看到polaris-controller的statefulset已经部署完成。

![](../images/controller/pod详情.png)

同时，打开北极星的控制台，可以看到k8s上面的service已经被自动同步到北极星上。