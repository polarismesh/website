# 使用polaris-go

## 环境准备

### 准备polaris后台环境

您需要先下载 Polaris并启动，详细可参考[服务端安装指南]()

### 准备编译环境

Polaris-go是以源码的方式提供集成，需要配置go mod环境进行依赖获取，并且需要确保是在以下版本环境中进行编译使用：

1. 64 bit操作系统，支持Linux/Unix/Windows，推荐选用 Linux/Unix
2. golang SDK 64bit 1.12+，下载链接：https://golang.org/dl/

## 快速接入

### 引入依赖

可以在polaris-go的[release note]()上获取到Polaris的所有版本以及相关介绍。推荐使用最新的稳定版本。
在应用go.mod文件中，引入polaris.go依赖。
```
github.com/polarismesh/polaris-go $version
```

### 配置服务端地址

在应用当前运行目录下，添加polaris.yml文件，配置服务端地址信息
```yml
global:
  serverConnector:
    addresses:
    - 127.0.0.1:8091
```

### 服务注册与心跳上报

1. 创建ProviderAPI
	ProviderAPI的所有方法都是线程安全的，所以一个进程创建一个ProviderAPI来使用就足够了
	
	```go
	provider, err := api.NewProviderAPI()
	if nil != err {
		log.Fatal(err)
	}
	```
2. 执行服务注册
	```go
	request := &api.InstanceRegisterRequest{}
	request.Namespace = "Test"
	request.Service = "dummy"
	request.Host = "127.0.0.1"
	request.Port = 12380
	request.SetTTL(2) //set the instance ttl, server will set instance 	unhealthy when not receiving heartbeat after 2*ttl
	resp, err := provider.Register(request)
	if nil != err {
		log.Fatal(err)
	}
	```
3. 执行心跳上报
	```go
	hbRequest := &api.InstanceHeartbeatRequest{}
	hbRequest.Namespace = "Test"
	hbRequest.Service = "dummy"
	hbRequest.Host = "127.0.0.1"
	hbRequest.Port = 12380
	err = provider.Heartbeat(hbRequest)
	```
3. 执行服务反注册
	```go
	request := &api.InstanceDeRegisterRequest{}
	request.Namespace = "Test"
	request.Service = "dummy"
	request.Host = "127.0.0.1"
	request.Port = 12380
	err = provider.Deregister(request)
	```

### 服务发现

1. 创建ConsumerAPI
	ConsumerAPI的所有方法都是线程安全的，所以一个进程创建一个ConsumerAPI来使用就足够了
	```go
	consumer, err := api.NewConsumerAPI()
	```
2. 拉取所有的服务实例
	```go
	request := &api.GetAllInstancesRequest{}
	request.Namespace = "Test"
	request.Service = "dummy"
	Resp, err := consumer.GetAllInstances(request)
	for i, instance := range getAllInstResp.Instances {
		log.Printf("instance %d is %s:%d\n", i, instance.GetHost(), instance.GetPort())
	}
	```

### 服务路由与负载均衡

1. 使用场景

	dummyGrey服务下，有5个实例，3个实例部署了version 1.0的应用，2个实例部署了version 2.0的应用，需要保证只有灰度用户才能请求到version 2.0的应用。

2. 添加不同分组的多个实例

	注册version 1.0的服务实例
	```go
	for i := 0; i < 3; i++ {
		request := &api.InstanceRegisterRequest{}
		request.Namespace = "Test"
		request.Service = "dummyGrey"
		request.Host = "127.0.0.1"
		request.Port = 12390 + i
		request.SetVersion("1.0")
		resp, err := provider.Register(request)
		if nil != err {
			log.Fatal(err)
		}
	}
	```
	注册version 2.0的服务实例
	```go
	for i := 0; i < 2; i++ {
		request := &api.InstanceRegisterRequest{}
		request.Namespace = "Test"
		request.Service = "dummyGrey"
		request.Host = "127.0.0.1"
		request.Port = 12370 + i
		request.SetVersion("2.0")
		resp, err := provider.Register(request)
		if nil != err {
			log.Fatal(err)
		}
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

   ```go
	//set the grey metadata
	svcInfo := &model.ServiceInfo{}
	svcInfo.Metadata = map[string]string{"grep": "true"}
	request := &api.GetOneInstanceRequest{}
	request.Namespace = "Test"
	request.Service = "dummyGrey"
	request.SourceService = svcInfo
	resp, err := consumer.GetOneInstance(request)
	if nil != err {
		log.Fatal(err)
	}
	log.Printf("instance after loadbalance is %s:%d\n", resp.Instances[0].GetHost(), resp.Instances[0].GetPort())
   ```


### 故障节点熔断

Polaris支持在主调方侧感知到被调实例出现异常，并且及时将其熔断剔除的能力，以及当实例异常解除后，通过主动探测或者超时放量等机制将其及时恢复。

1. 添加2个服务实例

   ```go
   //add 2 instances, one is 127.0.0.1:10010, second is 127.0.0.1:10011
   for i := 0; i < 2; i++ {
       request := &api.InstanceRegisterRequest{}
       request.Namespace = "Test"
       request.Service = "dummy"
       request.Host = "127.0.0.1"
       request.Port = 10010 + i
       resp, err := provider.Register(request)
       if nil != err {
           log.Fatal(err)
       }
   }
   
   ```

2. 针对其中一个实例连续上报10次失败（模拟业务调用10次失败）

   ```go
   request := &api.GetAllInstancesRequest{}
   request.Namespace = "Test"
   request.Service = "dummy"
   Resp, err := consumer.GetAllInstances(request)
   var targetInstance model.Instance
   for _, instance := range getAllInstResp.Instances {
       if instance.GetPort() == 10010 {
           targetInstance = instance
           break
       }
   }
   //report 10 continuous failure
   for i := 0; i < 10; i++ {
       svcCallResult := &api.ServiceCallResult{}
       svcCallResult.SetCalledInstance(targetInstance)
       svcCallResult.SetRetStatus(api.RetFail)
       //return code for procedure call
   	svcCallResult.SetRetCode(500)
       // delay interval for procedure call
       svcCallResult.SetDelay(30 * time.Millisecond)
       consumer.UpdateServiceCallResult(svcCallResult)
   }
   
   ```

   

3. 实例被熔断，通过GetOneInstance无法再获取该实例（已经被剔除）

   ```go
   for i := 0; i < 10; i++ {
       request := &api.GetOneInstanceRequest{}
       request.Namespace = "Test"
   	request.Service = "dummy"
       resp, err := consumer.GetOneInstance(request)
       if nil != err {
   		log.Fatal(err)
   	}
       instance := resp.Instances[0]
       //instance port won't be 10010, it's been kick off
       log.Printf("instance port is %d\n", instance.GetPort()) 
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

   ```go
   limitAPI, err := api.NewLimitAPI()
   if nil != err {
   	log.Fatal(err)
   }
   ```

3. 针对/path1获取配额

   每次收到访问/path1的请求时，需要先获取配额，以判断本次是否限流

   ```go
   //创建访问限流请求
   quotaReq := api.NewQuotaRequest()
   //设置命名空间
   quotaReq.SetNamespace("Test")
   //设置服务名
   quotaReq.SetService("dummyLimit")
   //设置标签值
   quotaReq.SetLabels(map[string]string{"method", "/path1"})
   //调用配额获取接口
   future, err := limitAPI.GetQuota(quotaReq)
   if nil != err {
       log.Fatal(err)
   }
   resp := future.Get()
   if api.QuotaResultOk == resp.Code {
       //quota acquired, now can continue the procedure process
       log.Printf("quota result ok")
   } else {
       //quota limited, we should block the user request
       log.Printf("quota result fail, info is %s", resp.Info)
   }
   ```

4. 针对/path2获取配额

   ```go
   //创建访问限流请求
   quotaReq := api.NewQuotaRequest()
   //设置命名空间
   quotaReq.SetNamespace("Test")
   //设置服务名
   quotaReq.SetService("dummyLimit")
   //设置标签值
   quotaReq.SetLabels(map[string]string{"method", "/path2"})
   //调用配额获取接口
   future, err := limitAPI.GetQuota(quotaReq)
   if nil != err {
       log.Fatal(err)
   }
   resp := future.Get()
   if api.QuotaResultOk == resp.Code {
       //quota acquired, now can continue the procedure process
       log.Printf("quota result ok")
   } else {
       //quota limited, we should block the user request
       log.Printf("quota result fail, info is %s", resp.Info)
   }
   ```

## 相关链接

[Polaris](https://github.com/polarismesh)


[Polaris GO](https://github.com/polarismesh/polaris-go)
