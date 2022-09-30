# 打通多K8S集群

## 背景及架构

北极星支持对接多k8s集群，不同集群的服务注册同一个北极星服务端，可以实现多集群之间的直通POD负载均衡，可以解决使用K8S的CLUSTER IP负载均衡模式下会出现的长连接负载不均等问题。

![](图片/打通多k8s集群/部署架构.png)

北极星服务端只部署一套，不同的k8s集群中的POD，通过集群内的k8s controller，将POD信息同步到北极星，同时将集群名作为服务实例的标签注册上去，便于用户进行查找以及按集群就近路由。

## 部署k8s controller

k8s controller需要部署到k8s的集群中，可以参考以下文档进行部署：

[k8s controller部署指南](https://polarismesh.cn/zh/doc/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/%E5%AE%89%E8%A3%85%E6%9C%8D%E5%8A%A1%E7%AB%AF/%E5%AE%89%E8%A3%85k8s_controller.html#k8s-controller%E5%AE%89%E8%A3%85)

## 配置集群名

k8s controller默认会以default集群名进行部署，我们需要修改成实际的集群名。

- 修改配置文件集群名

打开polaris-controller的安装包（非源码包），找到configmap.yaml这个文件，并且在文件中，将clusterName的值修改成实际的集群名称

```
    # k8s集群名，需要修改成实际的集群名称
    clusterName: "default" 
```

修改完毕后，通过```kubectl apply -f configmap.yaml```，将配置重新发布。

- 重启controller

找到polaris-controller的部署路径，一般在polaris-system命名空间下，将controller的POD重启

- 观察北极星控制台

打开北极星控制台，找到对应通过的服务名，进入实例列表，确认POD IP是否已经带入clusterName的标签信息。

![](图片/打通多k8s集群/实例列表.png)
