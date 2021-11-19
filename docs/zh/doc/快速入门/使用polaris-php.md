# 使用polaris-php

## 环境准备

### 准备polaris后台环境

您需要先下载 Polaris并启动，详细可参考[服务端安装指南](https://polarismesh.cn/zh/doc/%E5%BF%AB%E9%80%9F%E5%85%A5%E9%97%A8/%E5%8D%95%E6%9C%BA%E7%89%88%E5%AE%89%E8%A3%85.html#%E5%AE%89%E8%A3%85%E8%AF%B4%E6%98%8E)

### 准备编译/运行环境

Polaris-PHP的集成依赖php以及c++环境，需要确保是在以下版本环境中进行编译使用：

1. 64 bit操作系统，支持Linux/Unix/Windows，推荐选用 Linux/Unix
2. php-5.6.40 (目前仅支持php-5.6.40, php-7.x后续会支持)

## 快速接入

### 本地编译

在准备好上述环境之后，查看polaris-php [build doc](https://github.com/polarismesh/polaris-php/blob/main/doc/HowToBuild.md) 进行构建polaris-php插件


#### 使用全量功能

```php
$param = array(
    "config_path" => "./polaris.yaml",
    "log_dir" => "./"
);

$polaris_client = new PolarisClient($param)
$polaris_client -> InitConsumer();
$polaris_client -> InitLimit();
$polaris_client -> InitProvider();
```

#### 使用服务注册服务发现、服务熔断

```php
$param = array(
    "config_path" => "./polaris.yaml",
    "log_dir" => "./"
);

$polaris_client = new PolarisClient($param)
$polaris_client -> InitConsumer();
$polaris_client -> InitProvider();
```

#### 仅使用服务限流

```php
$param = array(
    "config_path" => "./polaris.yaml",
    "log_dir" => "./"
);

$polaris_client = new PolarisClient($param)
$polaris_client -> InitLimit();
```

### 配置服务端地址

填写polaris.yml文件，配置服务端地址信息

```yml
global:
  serverConnector:
    addresses:
    - 127.0.0.1:8091
```

### 服务注册与心跳上报

1. 创建ProviderAPI

ProviderAPI的所有方法都是线程安全的，所以一个进程创建一个ProviderAPI来使用就足够了

```php
$param = array(
     "config_path" => "./polaris.yaml",
     "log_dir" => "./"
 );
$polaris_client = new PolarisClient($param)
$polaris_client -> InitProvider();
```

2. 执行服务注册

```php
// 实例注册信息
$register_instance_info = array(
 	"namespace" => "default",
 	"service" => "dummyGrey",
 	"host" => "127.0.0.3",
 	"port" => "8080",
 	"heartbeat" => "true",
 	"ttl" => "3",
 	"protocol" => "gRPC",
 	"metadata" => array(
 		"client" => "php"
 	)
);
 // 执行实例注册动作
$res = $polaris->Register($register_instance_info, 5000, 1);
```

3. 执行心跳上报

```php
$heartbeat_info = array(
 	"namespace" => "default",
 	"service" => "dummyGrey",
 	"host" => "127.0.0.3",
 	"port" => "8080",
);
// 先进行一次心跳上报，触发实例租约计算任务
$res = $polaris->Heartbeat($heartbeat_info);
```

4. 执行服务反注册

```php
$deregister_instance_info = array(
 	"namespace" => "default",
 	"service" => "dummyGrey",
 	"host" => "127.0.0.3",
 	"port" => "8080",
);
 // 执行实例反注册动作
$res = $polaris->Deregister($deregister_instance_info, 5000, 1);
```

### 服务发现

1. 创建ConsumerAPI

ConsumerAPI的所有方法都是线程安全的，所以一个进程创建一个ConsumerAPI来使用就足够了

```php
$param = array(
     "config_path" => "./polaris.yaml",
     "log_dir" => "./"
);
$polaris_client = new PolarisClient($param)
$polaris_client -> InitConsumer();  
```

2. 拉取所有的服务实例

```php
$get_req = array(
 	"namespace" => "default",
 	"service" => "dummyGrey",
);
$res = $polaris->GetAllInstances($get_req, 5000, 1);
```

### 服务路由与负载均衡

1. 使用场景

dummyGrey服务下，有5个实例，3个实例部署了version 1.0的应用，2个实例部署了version 2.0的应用，需要保证只有灰度用户才能请求到version 2.0的应用。

2. 添加不同分组的多个实例

注册version 1.0的服务实例

```java
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

```java
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
		"namespace":"default",
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
                 "namespace": "default",
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
                 "namespace": "default",
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

```php
$init_service_info = array(
    "namespace" => "default",
    "service" => "dummyGrey",
    "source" => array(
        "metadata" => array(
            "grey" => "true"
        )
    ),
);
$timeout = 500;
$flow_id = 123456;
$res = $polaris_client->GetInstances($init_service_info, $timeout, $flow_id);
```

### 故障节点熔断

Polaris支持在主调方侧感知到被调实例出现异常，并且及时将其熔断剔除的能力，以及当实例异常解除后，通过主动探测或者超时放量等机制将其及时恢复。

1. 添加2个服务实例

```java
//add 2 instances, one is 127.0.0.1:10010, second is 127.0.0.1:10011
for (int i = 0; i < 2; i++) {
    InstanceRegisterRequest request = new InstanceRegisterRequest();
    request.setNamespace("default");
    request.setService("dummy");
    request.setHost("127.0.0.1");
    request.setPort(10010 + i);
    InstanceRegisterResponse instanceRegisterResponse = providerAPI.register(request);
}
```

2. 针对其中一个实例连续上报10次失败（模拟业务调用10次失败）

```php
 for ($i=1; $i<=10; $i++)
 {
     //report 10 continuous failure
     $init_service_info = array(
         "namespace" => "default",
         "service" => "dummy",
         "host" => "127.0.0.1",
         "port" => "10010",
         "delay" => "100",
         "ret_status" => "error",
         "ret_code" => "200",
     );
     $timeout = 500;
     $flow_id = 123456;
     $res = $polaris_client->UpdateServiceCallResult($init_service_info, $timeout, $flow_id);
 }
```

3. 实例被熔断，通过GetOneInstance无法再获取该实例（已经被剔除）

```php
for ($i=1; $i<=10; $i++)
{
    $init_service_info = array(
         "namespace" => "default",
         "service" => "dummy",
     );
     $timeout = 500;
     $flow_id = 123456;
     $res = $polaris_client->GetOneInstance($init_service_info, $timeout, $flow_id);
     var_dump($res);
}
```

### 服务限流

1. 使用场景

dummyLimit服务有2个接口，接口/path1最大QPS为100，接口/path2最大QPS为300，规则文本如下：

```json
[
    {
        "service":"dummyLimit",              
        "namespace":"default",           
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
        "namespace":"default",           
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

```php
$polaris = new PolarisClient(array(
	"config_path" => "./polaris.yaml",
	"log_dir" => "./"
));
$polaris->InitLimit();
```

3. 针对/path1获取配额

```php
$get_quota_req = array(
 	"namespace" => "default",
 	"service" => "dummyLimit",
 	"labels" => array(
 		"method" => "/path1"
 	),
 );
$res = $polaris->GetQuota($get_quota_req);
var_dump($res);
```

4. 针对/path2获取配额

```php
$get_quota_req = array(
 	"namespace" => "default",
 	"service" => "dummyLimit",
 	"labels" => array(
 		"method" => "/path2"
 	),
 );
$res = $polaris->GetQuota($get_quota_req);
var_dump($res);
```

## 相关链接

[Polaris](https://github.com/polarismesh)

[Polaris PHP](https://github.com/polarismesh/polaris-php)

[Polaris PHP 配置详细](https://github.com/polarismesh/polaris-cpp/blob/main/polaris.yaml.template)
