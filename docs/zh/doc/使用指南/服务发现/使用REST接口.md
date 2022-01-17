# 使用REST接口

## 准备Polaris服务端

需要预先安装好Polaris服务端，安装方式可参考：[单机版安装](https://polarismesh.cn/zh/doc/快速入门/安装服务端/安装单机版.html#单机版安装)或者[集群版安装](https://polarismesh.cn/zh/doc/快速入门/安装服务端/安装集群版.html#集群版安装)
以下假设Polaris服务端的安装地址为127.0.0.1。

## 查询服务实例列表

执行以下命令进行服务实例列表查询：

```
POST /v1/Discover

{
    "type":1,
    "service":{
        "name":"FooService", // 服务名称；必填；string
        "namespace":"Test", // 命名空间名称；必填；string
    }
}
```

详细接口参数以及返回值可参考[服务发现](https://polarismesh.cn/zh/doc/接口文档/服务发现.html#服务发现)

