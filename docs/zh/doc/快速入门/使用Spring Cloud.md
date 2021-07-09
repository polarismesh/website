# 使用Spring Cloud

## 为什么需要北极星

|功能类型|功能特性|Spring Cloud Netflix| Spring Cloud Polaris|
-:|--|--|-:
|基础功能 |服务发现|||
||服务路由|||
||服务路由|||
||服务路由|||
||服务路由|||

## 如何使用北极星

### 服务注册

### 服务发现

```
    <dependencies>
         <dependency>
             <artifactId>spring-cloud-starter-tencent-polaris-discovery</artifactId>
             <groupId>com.tencent.cloud</groupId>
         </dependency>
         <!-- feign客户端依赖  -->
         <dependency>
             <groupId>org.springframework.cloud</groupId>
             <artifactId>spring-cloud-starter-openfeign</artifactId>
         </dependency>
         <dependency>
             <groupId>io.github.openfeign</groupId>
             <artifactId>feign-okhttp</artifactId>
         </dependency>
     </dependencies>
```

### 路由和负载均衡

### 服务熔断

### 服务限流
