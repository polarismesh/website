# Polaris里程碑计划

PolarisMesh是腾讯在2021年8月开源的服务发现以及治理中心项目，与社区进行充分的讨论后，PolarisMesh接下来的版本包含的重要特性如下：

v1.4.0（2021-12）

- grpc-go-polaris发布：gRPC-Go对接组件
- grpc-java-polaris发布：grpc-Java对接组件
- polaris-console：支持命名空间管理
- polaris：支持服务自动注册

v1.5.0（2022-01）

- spring-boot-polaris发布：spring boot对接组件
- dubbo-go对接：支持dubbo-go应用接入
- dubbo-java对接：支持dubbo-java v3应用接入
- 配置管理：支持基础的配置管理功能

v1.6.0（2022-02）

- 用户鉴权：针对API以及客户端访问，添加认证鉴权能力，保证数据安全
- go-zero对接：支持go-zero应用接入
- GoFrame对接：支持GoFrame应用接入
- PHP 7.x SDK发布：支持PHP 7.x应用接入
- polaris-agent发布：提供无侵入式的Java字节码agent的接入方式

v1.7.0（2022-03）

- 支持分布式限流
- kube-dns对接：打通k8s的域名解释，提供容器内无侵入的服务发现能力
- configmap对接：打通k8s的配置功能

v1.8.0（2022-04）

- Service Mesh增强：ServiceMesh接入部分支持熔断以及限流功能接入
- polaris-go统计监控：支持polaris-go路由、熔断、限流指标对接prometheus
