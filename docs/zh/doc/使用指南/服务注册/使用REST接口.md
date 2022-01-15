# 使用REST接口注册

## 准备Polaris服务端

需要预先安装好Polaris服务端，安装方式可参考：[单机版安装](polarismesh.cn/zh/doc/快速入门/安装服务端/安装单机版.html#单机版安装)或者[集群版安装](polarismesh.cn/zh/doc/快速入门/安装服务端/安装集群版.html#集群版安装)
以下假设Polaris服务端的安装地址为127.0.0.1。

## 注册命名空间

执行以下命令进行命名空间注册：

```shell
curl -XPOST -H'Content-Type:application/json' -d'[{"name":"Test"}]' http://127.0.0.1:8090/naming/v1/namespaces
```
详细接口参数以及返回值可参考[命名空间管理](polarismesh.cn/zh/doc/接口文档/命名空间管理.html#命名空间管理)

## 反注册命名空间

执行以下命令进行命名空间反注册：

```shell
curl -XPOST -H'Content-Type:application/json' -d'[{"name":"Test"}]' http://127.0.0.1:8090/naming/v1/namespaces/delete
```
详细接口参数以及返回值可参考[命名空间管理](polarismesh.cn/zh/doc/接口文档/命名空间管理.html#命名空间管理)

## 注册服务

执行以下命令进行服务注册：

```shell
curl -XPOST -H'Content-Type:application/json' -d'[{"name":"FooService", "namespace":"Test"}]' http://127.0.0.1:8090/naming/v1/services
```
详细接口参数以及返回值可参考[服务管理](polarismesh.cn/zh/doc/接口文档/服务管理.html#服务管理)

## 反注册服务

执行以下命令进行服务反注册：

```shell
curl -XPOST -H'Content-Type:application/json' -d'[{"name":"FooService", "namespace":"Test"}]' http://127.0.0.1:8090/naming/v1/services/delete
```
详细接口参数以及返回值可参考[服务管理](polarismesh.cn/zh/doc/接口文档/服务管理.html#服务管理)

## 注册服务实例

执行以下命令进行服务实例注册：

```shell
curl -XPOST -H'Content-Type:application/json' -d'[{"service":"FooService", "namespace":"Test", "host": "127.0.0.1", "port": 8080}]' http://127.0.0.1:8090/naming/v1/instances
```
详细接口参数以及返回值可参考[实例管理](polarismesh.cn/zh/doc/接口文档/实例管理.html#实例管理)

## 反注册服务实例

```shell
curl -XPOST -H'Content-Type:application/json' -d'[{"service":"FooService", "namespace":"Test", "host": "127.0.0.1", "port": 8080}]' http://127.0.0.1:8090/naming/v1/instances/delete
```
详细接口参数以及返回值可参考[实例管理](polarismesh.cn/zh/doc/接口文档/实例管理.html#实例管理)