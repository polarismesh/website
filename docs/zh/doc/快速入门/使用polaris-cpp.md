# 使用polaris-cpp

## 环境准备

### 准备polaris后台环境

您需要先下载 Polaris并启动，详细可参考[服务端安装指南]()

### 准备编译/运行环境

Polaris-cpp目前支持在linux下编译，g++ >= 4.4.6

在Ubuntu上可用如下命名安装相关依赖：
```
sudo apt-get install autoconf automake libtool make g++
```

### 编译
依赖安装完成以后，执行如下命令编译
```
make
make package
```

执行`make package`后会在当前目录下生成一个`polaris_cpp_sdk.tar.gz`压缩文件。该文件的内容如下：

```
|-- include/polaris  # 头文件
|   |-- consumer.h provider.h limit.h ...
|-- dlib             # 动态库
|   |-- libpolaris_api.so
`-- slib             # 静态库
    |-- libpolaris_api.a libprotobuf.a
```

其中`include/polaris/`为头文件目录。业务程序使用`#include "polaris/xxx.h"`这种方式包含头文件。

`dlib/`为动态库目录。`libpolaris_api.so`为polaris的动态库。注：该动态库已经链接了libprotobuf.a
使用动态库，在发布应用程序时需要将该动态库一起发布，并需要确保能搜到这些动态库。

`slib/`为静态库目录。用户使用静态编译时需要链接该目录下libpolaris_api.a和libprotobuf.a两个静态库。

除支持make方式编译外，还支持bazel方式编译：
```
sh bazel_build.sh # 编译polaris_api
sh bazel_clean.sh # 编译清理
```

## 快速接入

### 引入依赖

#### 静态库方式使用
```
g++ -I./polaris_cpp_sdk/include main.cpp -L./polaris_cpp_sdk/slib  -lpolaris_api -lprotobuf -pthread -lz -lrt -o main
```

#### 动态库方式使用
```
g++ -I./polaris_cpp_sdk/include main.cpp -L./polaris_cpp_sdk/dlib -lpolaris_api -pthread -lz -lrt -o main
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

	ProviderApi对象上的方法都是线程安全的，一个进程只需要创建一个即可
	通过默认配置文件创建ProviderApi对象：

	```c++
	// 这个方法默认加载当前目录下的`polaris.yaml`配置文件初始化Context来创建ProviderApi。
	// 如果该配置文件不存在，则使用默认配置；否则，加载该文件的配置项覆盖相关默认配置。
	polaris::ProviderApi* provider_api = polaris::ProviderApi::CreateWithDefaultFile();
	if (provider_api == NULL) { // 创建错误，创建失败原因可查看日志~/polaris/log/polaris.log
	  abort();
	}
	// 使用provider_api

	// 不再使用后，释放provider_api
	delete provider_api;
	```

2. 执行服务注册

	服务注册接口用于向服务中注册服务实例。服务注册必须带上服务token，可以到控制台查看服务的token。
	此外可以配置是否开启健康检查，对于开启了健康检查的服务实例，注册完成后必须定期心跳上报接口维持自身的健康状态

	```c++
	std::string service_namespace = "Test";
	std::string service_name = "dummy";
	std::string service_token;  // 默认无token鉴权
	std::string host = "127.0.0.1";
	int port = 9092;
	polaris::InstanceRegisterRequest register_req(service_namespace, service_name, service_token, host, port);

	// 设置开启健康检查，不设置默认为不开启
	register_req.SetHealthCheckFlag(true);
	register_req.SetHealthCheckType(polaris::kHeartbeatHealthCheck);
	register_req.SetTtl(5);  // 心跳服务器超过3*ttl时间未收到客户端上报心跳就将实例设置为不健康

	// 调用服务注册接口
	std::string instance_id;  // 调用成功会返回instance_id
	polaris::ReturnCode ret = provider->Register(register_req, instance_id);
	if (ret != polaris::kReturnOk) {
	  abort();
	}
	```

3. 执行心跳上报

	如果在服务注册的时候开启了上报心跳，则业务需要定时调用心跳上报接口维持服务健康状态

	```c++
	// instance_id为通过服务注册接口返回的服务实例ID
	polaris::InstanceHeartbeatRequest heartbeat_req(service_token, instance_id);
	while (true) {
	  if (provider->Heartbeat(heartbeat_req) == kReturnOk) {
	    sleep(5);
	  }
	}
	```


4. 执行服务反注册

	服务退出时，可调用服务反注册接口将服务实例从服务的实例列表中删除

	```c++
	polaris::InstanceDeregisterRequest deregister_req(service_token, instance_id);
	ret = provider->Deregister(deregister_req);
	```

### 服务发现

1. 创建ConsumerAPI

	业务程序在调用相关接口前必须先创建ConsumerApi对象。ConsumerApi对象是线程安全的，一个进程只需要创建一个即可。

	```c++
	// 这个方法默认加载当前目录下的`polaris.yaml`配置文件初始化Context来创建ConsumerApi。
	// 如果该配置文件不存在，则使用默认配置；否则，加载该文件的配置项覆盖相关默认配置。
	polaris::ConsumerApi* consumer_api = polaris::ConsumerApi::CreateWithDefaultFile();
	if (consumer_api == NULL) { // 创建错误，创建失败原因可查看日志~/polaris/log/polaris.log
	  abort();
	}
	// 使用consumer_api

	// 不再使用后，释放consumer_api
	delete consumer_api;
	```
    
2. 拉取所有的服务实例

	```c++
	polaris::ServiceKey service_key = {"Test", "dummy"};
	polaris::GetInstancesRequest request(service_key);
	polaris::InstancesResponse* response = NULL;

	// 调用接口
	polaris::ReturnCode ret = consumer->GetAllInstances(request, response);
	if (ret == polaris::kReturnOk) {
	  std::vector<polaris::Instance>& instances = response->GetInstances();
	  for (std::size_t i = 0; i < instances.size(); ++i) {
	    std::cout << instances[i].GetHost() << ":" << instances[i].GetPort() << std::endl;
	  }
	  delete response;
	} else {
	  std::cout << "get all instances for service with error:" << polaris::ReturnCodeToMsg(ret).c_str() << std::endl;
	}
	```

### 服务路由与负载均衡

1. 使用场景

	dummyGrey服务下，有5个实例，3个实例部署了version 1.0的应用，2个实例部署了version 2.0的应用，需要保证只有灰度用户才能请求到version 2.0的应用。

2. 添加不同分组的多个实例

	注册version 1.0的服务实例

	```c++
	std::string service_namespace = "Test";
	std::string service_name = "dummyGrey";
	std::string host = "127.0.0.1";
	std::string service_token;  // 默认无token鉴权
	std::string instance_id;    // 调用成功会返回instance_id
	for (int i = 0; i < 3; i++) {
	  int port = 12390 + i;
	  polaris::InstanceRegisterRequest register_req(service_namespace, service_name, service_token, host, port);
	  register_req.SetVersion("1.0");
	  // 调用服务注册接口
	  polaris::ReturnCode ret = provider->Register(register_req, instance_id);
	  if (ret != polaris::kReturnOk) {
	    abort();
	  }
	}
	```

	注册version 2.0的服务实例

	```c++
	for (int i = 0; i < 2; i++) {
	  request := &api.InstanceRegisterRequest{}
	  polaris::InstanceRegisterRequest register_req(service_namespace, service_name, service_token, host, port);
	  register_req.SetVersion("2.0");
	  // 调用服务注册接口
	  polaris::ReturnCode ret = provider->Register(register_req, instance_id);
	  if (ret != polaris::kReturnOk) {
	    abort();
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

	```c++
	polaris::ServiceKey service_key = {"Test", "dummy"};
	polaris::GetOneInstanceRequest request(service_key);
	polaris::ServiceInfo service_info;
	service_info.metadata_["grep"] = true;
	request.SetSourceService(service_info);
	polaris::Instance instance;
	polaris::ReturnCode ret = consumer->GetOneInstance(request, instance);
	if (ret != polaris::kReturnOk) {
	  std::cout << "get one instance with error: " << polaris::ReturnCodeToMsg(ret) << std::endl;
	  abort();
	}
	std::cout << instance.GetHost() << ":" << instance.GetPort() << std::endl;
	```

### 故障节点熔断

Polaris支持在主调方侧感知到被调实例出现异常，并且及时将其熔断剔除的能力，以及当实例异常解除后，通过主动探测或者超时放量等机制将其及时恢复。

1. 添加2个服务实例

	```c++
	//add 2 instances, one is 127.0.0.1:10010, second is 127.0.0.1:10011
	std::string service_namespace = "Test";
	std::string service_name = "dummy";
	std::string host = "127.0.0.1";
	std::string service_token;  // 默认无token鉴权
	std::string instance_id;    // 调用成功会返回instance_id
	for (int i = 0; i < 3; i++) {
	  int port = 10010 + i;
	  polaris::InstanceRegisterRequest register_req(service_namespace, service_name, service_token, host, port);
	  // 调用服务注册接口
	  polaris::ReturnCode ret = provider->Register(register_req, instance_id);
	  if (ret != polaris::kReturnOk) {
	    abort();
	  }
	}
	```

2. 针对其中一个实例连续上报10次失败（模拟业务调用10次失败）

	```c++
	//report 10 continuous failure
	for (int i = 0; i < 10; i++) {
	  polaris::ServiceCallResult result;
	  result.SetServiceNamespace(service_namespace);
	  result.SetServiceName(service_name);
	  result.SetInstanceHostAndPort("127.0.0.1", 10010)
	  result.SetDelay(1000); // 调用延迟
	  result.SetRetStatus(polaris::kCallRetError);  // 上报错误
	  consumer->UpdateServiceCallResult(result);
	}
	```

3. 实例被熔断，通过GetOneInstance无法再获取该实例（已经被剔除）

	```c++
	polaris::ServiceKey service_key = {"Test", "dummy"};
	polaris::GetOneInstanceRequest request(service_key);
	polaris::Instance instance;
	for (int i = 0; i < 10; i++) {
	  polaris::ReturnCode ret = consumer->GetOneInstance(request, instance);
	  if (ret != polaris::kReturnOk) {
	    std::cout << "get one instance with error: " << polaris::ReturnCodeToMsg(ret) << std::endl;
	    abort();
	  }
	  //instance port won't be 10010, it's been kick off
	  std::cout << instance.GetHost() << ":" << instance.GetPort() << std::endl;
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

2. 创建LimitAPI

	LimitAPI的所有方法都是线程安全的，所以一个进程创建一个LimitAPI来使用就足够了

	```c++
	// 使用运行目录下的polaris.yaml配置创建Limit API对象
	polaris::LimitApi* limit_api = polaris::LimitApi::CreateWithDefaultFile();
	if (limit_api == NULL) {
	  std::cout << "create limit api failed" << std::endl;
	  abort();
	}
	// 使用limit_api

	// 不再使用后，释放limit_api
	delete limit_api;
	```

	在运行目录下创建polaris.yaml文件，写入如下内容：
	```yml
	rateLimiter:
	  mode: local
	```

3. 针对/path1获取配额

	每次收到访问/path1的请求时，需要先获取配额，以判断本次是否限流

	```c++
	polaris::QuotaRequest quota_request;                   // 限流请求
	quota_request.SetServiceNamespace("Test");  // 设置限流规则对应服务的命名空间
	quota_request.SetServiceName("dummyLimit");            // 设置限流规则对应的服务名
	std::map<std::string, std::string> labels;
	labels["method"] = "/path1";
	quota_request.SetLabels(labels);                       // 设置label用于匹配限流规则

	polaris::ReturnCode ret;
	polaris::QuotaResultCode result;
	if ((ret = limit_api->GetQuota(quota_request, result)) != polaris::kReturnOk) {
	  std::cout << "get quota for service with error:" << polaris::ReturnCodeToMsg(ret).c_str() << std::endl;
	  abort();
	}
	if (result == polaris::kQuotaResultOk) {
	  //quota acquired, now can continue the procedure process
	  std::count << "quota result ok" << std::endl;
	} else {
	  //quota limited, we should block the user request
	  std::count << "quota result fail" << std::endl;
	}
	```

4. 针对/path2获取配额

	```c++
	polaris::QuotaRequest quota_request;                   // 限流请求
	quota_request.SetServiceNamespace("Test");  // 设置限流规则对应服务的命名空间
	quota_request.SetServiceName("dummyLimit");            // 设置限流规则对应的服务名
	std::map<std::string, std::string> labels;
	labels["method"] = "/path2";
	quota_request.SetLabels(labels);                       // 设置label用于匹配限流规则

	polaris::ReturnCode ret;
	polaris::QuotaResultCode result;
	if ((ret = limit_api->GetQuota(quota_request, result)) != polaris::kReturnOk) {
	  std::cout << "get quota for service with error:" << polaris::ReturnCodeToMsg(ret).c_str() << std::endl;
	  abort();
	}
	if (result == polaris::kQuotaResultOk) {
	  //quota acquired, now can continue the procedure process
	  std::count << "quota result ok" << std::endl;
	} else {
	  //quota limited, we should block the user request
	  std::count << "quota result fail" << std::endl;
	}
	```


## 相关链接

[Polaris](https://github.com/polarismesh)


[Polaris CPP](https://github.com/polarismesh/polaris-cpp)
