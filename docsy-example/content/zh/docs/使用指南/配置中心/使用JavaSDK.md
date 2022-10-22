---
title: "使用JavaSDK"
linkTitle: "使用JavaSDK"
weight: 462
---

## 一、准备工作

- 北极星服务端 v1.7.0 以上版本
- polaris-java v1.3.0 版本

## 二、增加 Maven 依赖

### 2.1 增加北极星 DependencyManager

```xml
<dependencyManagement>
    <dependencies>
        <dependency>
            <groupId>com.tencent.polaris</groupId>
            <artifactId>polaris-dependencies</artifactId>
            <version>1.4.0</version>
            <type>pom</type>
            <scope>import</scope>
        </dependency>
    </dependencies>
</dependencyManagement>
```

### 2.2 增加配置中心依赖

```xml
<dependency>
    <groupId>com.tencent.polaris</groupId>
    <artifactId>polaris-configuration-factory</artifactId>
</dependency>
```

## 三、添加北极星配置文件

在 resources 目录下新增一个配置文件：polaris.yml，注意放是 resources 根目录下。
内容为：

```yaml
global:
  system:
    configCluster:
      namespace: Polaris
      service: polaris.config
      sameAsBuiltin: true
    discoverCluster:
      sameAsBuiltin: true
    healthCheckCluster:
      sameAsBuiltin: true
  # configuration for connecting the polaris server
  serverConnector:
    # target server address
    addresses:
      - 127.0.0.1:8091
#描述:主调端配置
consumer:
  #描述:节点熔断相关配置
  circuitBreaker:
    #描述:是否启用节点熔断功能
    enable: false
config:
  serverConnector:
    connectorType: polaris
    addresses:
      - 127.0.0.1:8093
```

服务地址需要根据实际部署的北极星服务替换。需要注意点是：global.serverConnector.addresses 为服务发现的地址，configFile.serverConnector.addresses 为配置中心的地址。为了能够隔离物理连接，注册中心和配置中心虽然部署在同一个进程内部，但通过端口区分。默认情况下注册中心为 8091 端口，配置中心为 8093 端口。

## 四、编写代码

### 4.1 获取并监听文本类型的配置文件

properties、yaml 格式的配置文件可以解析成 key、value 的格式。但是其它类型的配置文件例如 xml、json 并不能解析成 key、value 格式，只能以整个文本形式处理。下面先介绍非 key、value 格式的配置文件使用方式。

```java
public static void main(String[] args) throws Exception {
        //定义配置文件三元组
        String namespace = "dev";
        String fileGroup = "order-service";
        String fileName = "common/application.yaml";


        //创建配置中心服务类，一般情况下只需要单例对象
        ConfigFileService configFileService = ConfigFileServiceFactory.createConfigFileService();

        //获取配置文件
        ConfigFile configFile = configFileService.getConfigFile(namespace, fileGroup, fileName);

        //打印配置文件内容
        Utils.print(configFile.getContent());

        //添加变更监听器
        configFile.addChangeListener(new ConfigFileChangeListener() {
            @Override
            public void onChange(ConfigFileChangeEvent event) {
                System.out
                    .printf("Received config file change event. old value = %s, new value = %s, change type = %s%n",
                            event.getOldValue(), event.getNewValue(), event.getChangeType());

                //获取配置文件最新内容
                Utils.print(configFile.getContent());
            }
        });

        //更多 API 用法
        //User user = configFile.asJson(User.class, null);  自动反序列化配置文件成 JSON 对象
        //List<User> users = configFile.asJson(new TypeToken<List<User>>() {}.getType(), null)

        System.in.read();
    }
```

运行后控制台将打印配置文件内容，如下图所示：

![](../images/get-config-file-result.png)

控制台上修改并发布配置文件，将会收到变更事件：

![](../images/receive-config-file-event.png)

更多的 API 用法，可自行查看 API 接口说明。

### 4.2 使用 properties、yaml 格式的配置文件

实际生产使用过程中，绝大部分配置文件还是以 properties、yaml 格式的配置文件为主。所以 polaris-sdk 针对这两种配置文件提供了一系列自动解析的能力，方便在业务代码中快速使用配置文件，减少重复工作。

#### 4.2.1 使用 properties 配置文件

代码如下：

```java
public static void main(String[] args) throws IOException {
        // 定义配置文件三元组
        String namespace = "dev";
        String fileGroup = "order-service";
        String fileName = "application.properties";

        //创建配置中心服务类，一般情况下只需要单例对象
        ConfigFileService configFileService = ConfigFileServiceFactory.createConfigFileService();

        //获取 properties 格式配置文件对象
        ConfigKVFile configFile = configFileService.getConfigPropertiesFile(namespace, fileGroup, fileName);

        //获取配置文件完整内容
        Utils.print(configFile.getContent());

        //获取特定的 key 的值
        Utils.print(configFile.getProperty("age", "some default value"));

        //更多基础类型方法
        // getIntProperty、getFloatProperty ...

        //更多高级数据结构方法
        //getEnumProperty、getArrayProperty、getJsonProperty

        //监听变更事件，kv类型的变更事件可以细化到 key 粒度的变更
        configFile.addChangeListener(new ConfigKVFileChangeListener() {
            @Override
            public void onChange(ConfigKVFileChangeEvent event) {
                for (String key : event.changedKeys()) {
                    ConfigPropertyChangeInfo changeInfo = event.getChangeInfo(key);
                    System.out.printf("\nChange info ：key = %s, old value = %s, new value = %s, change type = %s\n%n",
                                      changeInfo.getPropertyName(), changeInfo.getOldValue(),
                                      changeInfo.getNewValue(), changeInfo.getChangeType());
                }
            }
        });

        System.err.println("Please input key to get the value. Input quit to exit.");

        while (true) {
            System.out.print("Input key > ");
            String input = new BufferedReader(new InputStreamReader(System.in, Charsets.UTF_8)).readLine();
            if (input == null || input.length() == 0) {
                continue;
            }
            input = input.trim();
            if ("quit".equalsIgnoreCase(input)) {
                System.exit(0);
            }
            Utils.print(configFile.getProperty(input, null));
        }
    }
```

和获取配置文件相比，区别有以下几个点：

1. configFileService.getConfigPropertiesFile(namespace, fileGroup, fileName) 返回 ConfigKVFile 对象。

2. ConfigKVFile 会自动解析 properties 格式的配置文件，提供了一系列自动类型转化的方法，例如基础类型的 getIntProperty、getFloatProperty，高级类型有：getEnumProperty、getArrayProperty、getJsonProperty

3. 配置文件变更回调事件中，可以精确到每个 key 的粒度

#### 4.2.2 使用 yaml 配置文件

```java
public static void main(String[] args) throws IOException {
        //配置文件三元组
        String namespace = "dev";
        String fileGroup = "order-service";
        //文件名通过 / 分割在管控端按目录格式展示
        String fileName = "common/bootstrap.yaml";

        //创建配置中心服务类，一般情况下只需要单例对象
        ConfigFileService configFileService = ConfigFileServiceFactory.createConfigFileService();

        //获取 yaml 格式配置文件对象，这里是唯一跟 properties 格式区别的地方
        ConfigKVFile configFile = configFileService.getConfigYamlFile(namespace, fileGroup, fileName);

        String[] arr = configFile.getArrayProperty("configFile.arr",",", null);
        System.out.println(arr);
        //获取配置文件完整内容
        Utils.print(configFile.getContent());

        //获取特定的 key 的值
        Utils.print(configFile.getProperty("x.y.z", "some default value"));

        //更多基础类型方法
        // configFile.getIntProperty()、configFile.getFloatProperty() ...

        //更多高级数据结构方法
        //configFile.getEnumProperty()、configFile.getArrayProperty()、configFile.getJsonProperty()

        //监听变更事件，kv类型的变更事件可以细化到 key 粒度的变更
        configFile.addChangeListener(new ConfigKVFileChangeListener() {
            @Override
            public void onChange(ConfigKVFileChangeEvent event) {
                for (String key : event.changedKeys()) {
                    ConfigPropertyChangeInfo changeInfo = event.getChangeInfo(key);
                    System.out.printf("\nChange info ：key = %s, old value = %s, new value = %s, change type = %s\n%n",
                                      changeInfo.getPropertyName(), changeInfo.getOldValue(),
                                      changeInfo.getNewValue(), changeInfo.getChangeType());
                }
            }
        });

        System.err.println("Please input key to get the value. Input quit to exit.");

        while (true) {
            System.out.print("Input key > ");
            String input = new BufferedReader(new InputStreamReader(System.in, Charsets.UTF_8)).readLine();
            if (input == null || input.length() == 0) {
                continue;
            }
            input = input.trim();
            if ("quit".equalsIgnoreCase(input)) {
                System.exit(0);
            }
            Utils.print(configFile.getProperty(input, null));
        }
    }
```

和使用 properties 文件唯一区别是 

ConfigKVFile configFile = configFileService.getConfigYamlFile(namespace, fileGroup, fileName);
