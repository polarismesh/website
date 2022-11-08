---
title: "使用k8s服务同步"
linkTitle: "使用k8s服务同步"
weight: 2
---

## 原理说明

PolarisMesh提供polaris-controller，基于kubernetes的controller机制，监听service&pod事件，同步集群内的POD实例信息到PolarisMesh注册中心。

## 准备Polaris服务端

需要预先安装好Polaris服务端，安装方式可参考：[安装指南](/docs/快速入门/安装服务端/)

## 安装polaris-controller

您需要在应用所在的 Kubernetes 集群部署 Polaris Controller ，如果您有多个 Kubernetes 集群需要接入 Polaris ，需要在每个集群安装一次。

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

![](图片/使用k8s服务同步/查看token.png)

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

![](图片/使用k8s服务同步/pod详情.png)

## 同步完成

安装并启动后，polaris-controller会自动同步kubernetes上面的命名空间，服务以及实例数据。