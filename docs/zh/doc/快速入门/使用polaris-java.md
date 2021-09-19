# 使用polaris-java

## 环境准备

### 准备polaris后台环境

您需要先下载 Polaris并启动，详细可参考[服务端安装指南](https://polarismesh.cn/zh/doc/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/%E5%8D%95%E6%9C%BA%E7%89%88%E5%AE%89%E8%A3%85.html#%E5%AE%89%E8%A3%85%E8%AF%B4%E6%98%8E)

### 准备编译/运行环境

Polaris-JAVA的集成依赖maven环境，需要预先配置maven，并且需要确保是在以下版本环境中进行编译使用：

1. 64 bit操作系统，支持Linux/Unix/Windows，推荐选用 Linux/Unix
2. JDK 64bit  1.8.0+，下载地址：https://openjdk.java.net/install/

## 快速接入

### 包依赖

可以在polaris-java的[release note](https://github.com/polarismesh/polaris-java/releases)上获取到Polaris的所有版本以及相关介绍。推荐使用最新的稳定版本。

在工程根目录的pom中的\<dependencyManagement>添加如下配置，即可在项目中引用需要的polaris-java子模块依赖。
#### 依赖管理
```xml
<dependencyManagement>        
    <dependencies>
        <dependency>
            <groupId>com.tencent.polaris</groupId>
            <artifactId>polaris-dependencies</artifactId>
            <version>${version}</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```
#### 使用全量功能
   ```xml
   <dependency>
       <groupId>com.tencent.polaris</groupId>
       <artifactId>polaris-factory</artifactId>
   </dependency>
   ```
#### 仅服务注册服务发现
   ```xml
   <dependency>
       <groupId>com.tencent.polaris</groupId>
       <artifactId>polaris-discovery-factory</artifactId>
   </dependency>
   ```
#### 仅使用服务熔断
   ```xml
   <dependency>
       <groupId>com.tencent.polaris</groupId>
       <artifactId>polaris-circuitbreaker-factory</artifactId>
   </dependency>
   ```
#### 仅使用服务限流
   ```xml
   <dependency>
       <groupId>com.tencent.polaris</groupId>
       <artifactId>polaris-ratelimit-factory</artifactId>
   </dependency>
   ```

### 配置服务端地址

在应用的classpath当前目录下，添加polaris.yml文件，配置服务端地址信息

```yml
global:
  serverConnector:
    addresses:
    - 127.0.0.1:8091
```

### 开启监控上报

polaris-java支持上报监控数据到prometheus，如需开启，需要执行以下2步

1. 添加监控数据采集服务实例

   打开polaris控制台，点击“服务列表->新建”，选择命名空间为“Polaris”，服务名为polaris.monitor，并确认后新建服务。
   
   ![image](https://user-images.githubusercontent.com/45474304/133397804-b5b815ff-eb54-44af-9797-d82f828233d2.png) 

   回到服务列表，点击polaris.monitor服务进入实例列表，点击“新建”后，填入push-gateway的实例IP(实例IP需要确保SDK所在机器可达）以及端口（默认9091），权重选择100，并确认后新建实例
   ![image](https://user-images.githubusercontent.com/45474304/133402746-97e3401e-b0d0-484b-a18c-1f3ada345bd6.png)


2. 开启监控上报配置

   修改polaris.yml文件，开启statReporter功能

   ```yaml
   global:
     #描述: 监控及日志数据上报相关配置
     statReporter:
       #描述: 是否启用上报
       enable: true
   ```

### 服务注册与心跳上报

1. 添加依赖

   在项目中加入`polaris-discovery-factory`依赖即可使用Polaris的服务注册与发现功能。如Maven项目中，在pom中添加如下配置：

   ```xml
   <dependency>
       <groupId>com.tencent.polaris</groupId>
       <artifactId>polaris-discovery-factory</artifactId>
   </dependency>
   ```

2. 创建ProviderAPI

   ProviderAPI的所有方法都是线程安全的，所以一个进程创建一个ProviderAPI来使用就足够了，最后进程退出前要调用一下destroy()方法

   ```java
   ProviderAPI providerAPI = DiscoveryAPIFactory.createProviderAPI()
   //before process exits
   providerAPI.destroy()    
   ```

3. 执行服务注册

   ```java
   InstanceRegisterRequest request = new InstanceRegisterRequest();
   request.setNamespace("Test");
   request.setService("dummy");
   request.setHost("127.0.0.1");
   request.setPort(12380);
   request.setTtl(2);
   InstanceRegisterResponse instanceRegisterResponse = providerAPI.register(request);
   ```

4. 执行心跳上报

   ```java
   InstanceHeartbeatRequest request = new InstanceHeartbeatRequest();
   request.setNamespace("Test");
   request.setService("dummy");
   request.setHost("127.0.0.1");
   request.setPort(12380);
   providerAPI.heartbeat(request);
   ```

5. 执行服务反注册

   ```java
   InstanceDeregisterRequest request = new InstanceDeregisterRequest();
   request.setNamespace("Test");
   request.setService("dummy");
   request.setHost("127.0.0.1");
   request.setPort(12380);
   providerAPI.deRegister(request);
   ```

### 服务发现



1. 创建ConsumerAPI

   ConsumerAPI的所有方法都是线程安全的，所以一个进程创建一个ConsumerAPI来使用就足够了，最后进程退出前要调用一下destroy()方法

   ```java
   ConsumerAPI consumerAPI = DiscoveryAPIFactory.createConsumerAPI()
   //before process exits
   consumerAPI.destroy()       
   ```

2. 拉取所有的服务实例

   ```java
   GetAllInstancesRequest request = new GetAllInstancesRequest();
   request.setNamespace(namespace);
   request.setService(service);
   InstancesResponse instancesResponse = consumerAPI.getAllInstance(request);
   for (Instance instance : instancesResponse.getInstances()) {
        System.out.printf("instance is %s:%d%n", instance.getHost(), instance.getPort());
   }
   ```

### 服务路由与负载均衡

 1. 使用场景

    dummyGrey服务下，有5个实例，3个实例部署了version 1.0的应用，2个实例部署了version 2.0的应用，需要保证只有灰度用户才能请求到version 2.0的应用。

 2. 添加不同分组的多个实例

    注册version 1.0的服务实例

    ```go
    for (int i = 0; i < 3; i++) {
        InstanceRegisterRequest request = new InstanceRegisterRequest();
        request.setNamespace("Test");
        request.setService("dummyGrey");
        request.setHost("127.0.0.1");
        request.setPort(12390 + i);
        request.setVersion("1.0")
        InstanceRegisterResponse instanceRegisterResponse = providerAPI.register(request);
    }
    ```

    注册version 2.0的服务实例

    ```go
    for (int i = 0; i < 2; i++) {
        InstanceRegisterRequest request = new InstanceRegisterRequest();
        request.setNamespace("Test");
        request.setService("dummyGrey");
        request.setHost("127.0.0.1");
        request.setPort(12370 + i);
        request.setVersion("2.0")
        InstanceRegisterResponse instanceRegisterResponse = providerAPI.register(request);
    }
    ```

 3. 添加路由规则

    路由规则中声明，带有灰度标签(grey=true)的请求，路由到version 2.0的实例分组，否则路由到version 1.0的实例分组，规则文本如下：

    ```json
    [
    	{
    		"service":"dummyGrey",
    		"namespace":"Test",
    		"inbounds":[
               {
                 "sources": [
                   {
                     "service": "*",
                     "namespace": "*",
                     "metadata": {
                       "grey": {
                         "value": "true"
                       }
                     }
                   }
                 ],
                 "destinations": [
                   {
                     "service": "dummyGrey",
                     "namespace": "Test",
                     "metadata": {
                       "version": {
                         "value": "2.0"
                       }
                     },
                     "priority": 0,
                     "weight": 100,
                     "isolate": false
                   }
                 ]
               },
               {
                 "sources": [
                   {
                     "service": "*",
                     "namespace": "*"
                   }
                 ],
                 "destinations": [
                   {
                     "service": "dummyGrey",
                     "namespace": "Test",
                     "metadata": {
                       "version": {
                         "value": "1.0"
                       }
                     },
                     "priority": 0,
                     "weight": 100,
                     "isolate": false
                   }
                 ]
               }
             ],
    		"outbounds":[]
    	}
    ]
    ```

    将规则文本保存为data.json文件，通过接口写入到Polaris服务端

    ```bash
    curl -XPOST -H'Content-Type:application/json' -d @data.json 'http://127.0.0.1:8090/naming/v1/routings'
    ```

 4. 拉取经过路由及负载均衡后的单个实例

    ```java
    GetOneInstanceRequest request = new GetOneInstanceRequest();
    ServiceInfo serviceInfo = new ServiceInfo();
    Map<String, String> metadata = new HashMap<>();
    metadata.put("grey", "true");
    serviceInfo.setMetadata(metadata);
    request.setServiceInfo(serviceInfo);
    request.setNamespace(namespace);
    request.setService(service);
    InstancesResponse oneInstance = consumerAPI.getOneInstance(request);
    Instance instance = oneInstance.getInstance();
    System.out.printf("selected instance is %s:%d%n", instance.getHost(), instance.getPort());
    ```

    

### 故障节点熔断

Polaris支持在主调方侧感知到被调实例出现异常，并且及时将其熔断剔除的能力，以及当实例异常解除后，通过主动探测或者超时放量等机制将其及时恢复。

1. 添加2个服务实例

   ```java
   //add 2 instances, one is 127.0.0.1:10010, second is 127.0.0.1:10011
   for (int i = 0; i < 2; i++) {
       InstanceRegisterRequest request = new InstanceRegisterRequest();
       request.setNamespace("Test");
       request.setService("dummy");
       request.setHost("127.0.0.1");
       request.setPort(10010 + i);
       InstanceRegisterResponse instanceRegisterResponse = providerAPI.register(request);
   }
   ```

   

2. 针对其中一个实例连续上报10次失败（模拟业务调用10次失败）

   ```java
   //report 10 continuous failure
   for (int i = 0; i < 10; i++) {
       ServiceCallResult serviceCallResult = new ServiceCallResult();
       serviceCallResult.setNamespace("Test");
       serviceCallResult.setService("dummy");
       serviceCallResult.setHost("127.0.0.1");
       serviceCallResult.setPort(10011);
       serviceCallResult.setRetStatus(RetStatus.RetFail);
       serviceCallResult.setRetCode(500);
       serviceCallResult.setDelay(1000);
       consumerAPI.updateServiceCallResult(serviceCallResult);
   }
   ```

   

3. 实例被熔断，通过GetOneInstance无法再获取该实例（已经被剔除）

   ```java
   for (int i = 0; i < 10; i++) {
   	GetOneInstanceRequest request = new GetOneInstanceRequest();
       request.setNamespace("Test");
       request.setService("dummy");
   	InstancesResponse oneInstance = consumerAPI.getOneInstance(request);
   	Instance instance = oneInstance.getInstance();
       //instance port won't be 10010, it's been kick off
   	System.out.printf("selected instance is %s:%d%n", instance.getHost(), instance.getPort());
   }
   ```

   

### 服务限流

1. 使用场景

   dummyLimit服务有2个接口，接口/path1最大QPS为100，接口/path2最大QPS为300，规则文本如下：

   ```json
   [
       {
           "service":"dummyLimit",                
           "namespace":"Test",             
           "resource":"QPS",              
           "type":"LOCAL",               
           "labels":{                     
               "method":{                    
                   "type": "EXACT",    
                   "value":"/path1"
               }
           },
           "amounts":[
               {
                   "maxAmount": 100,
                   "validDuration": "1s"
               }
           ]
       },
   	{
           "service":"dummyLimit",                
           "namespace":"Test",             
           "resource":"QPS",              
           "type":"LOCAL",               
           "labels":{                     
               "method":{                    
                   "type": "EXACT",    
                   "value":"/path2"
               }
           },
           "amounts":[
               {
                   "maxAmount": 300,
                   "validDuration": "1s"
               }
           ]
       }
   ]
   ```

   将规则文本保存为data.json文件，通过接口写入到Polaris服务端

   ```bash
   curl -XPOST -H'Content-Type:application/json' -d @data.json 'http://127.0.0.1:8090/naming/v1/ratelimits'
   ```

   

2. 创建RateLimitAPI

   dummyLimit服务有2个接口，接口/path1最大QPS为100，接口/path2最大QPS为300，规则文本如下：

   ```java
   LimitAPI limitAPI = LimitAPIFactory.createLimitAPI();
   //before process exits
   limitAPI.destroy();
   ```

3. 针对/path1获取配额

   ```java
   QuotaRequest quotaRequest = new QuotaRequest();
   quotaRequest.setNamespace("Test");
   quotaRequest.setService("dummyLimit");
   Map<String, String> labels = new HashMap();
   labels.put("method", "/path1")
   QuotaResponse quotaResponse = limitAPI.getQuota(quotaRequest);
   if QuotaResultCode.QuotaResultOk == quotaResponse.getCode() {
       //quota acquired, now can continue the procedure process
       System.out.println("quota result ok")
   } else {
       //quota limited, we should block the user request
       log.Printf("quota result fail, info is %s%n", quotaResponse.getInfo())
   }
   ```

   

4. 针对/path2获取配额

   ```java
   QuotaRequest quotaRequest = new QuotaRequest();
   quotaRequest.setNamespace("Test");
   quotaRequest.setService("dummyLimit");
   Map<String, String> labels = new HashMap();
   labels.put("method", "/path2")
   QuotaResponse quotaResponse = limitAPI.getQuota(quotaRequest);
   if QuotaResultCode.QuotaResultOk == quotaResponse.getCode() {
       //quota acquired, now can continue the procedure process
       System.out.println("quota result ok")
   } else {
       //quota limited, we should block the user request
       log.Printf("quota result fail, info is %s%n", quotaResponse.getInfo())
   }
   ```




## 相关链接

[Polaris](https://github.com/polarismesh)


[Polaris JAVA](https://github.com/polarismesh/polaris-java)
