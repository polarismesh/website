---
title: "Release v1.12"
linkTitle: "Release v1.12"
weight: 7
---

## 下载地址

- [Github Release v1.12.0](https://github.com/polarismesh/polaris/releases/tag/v1.12.0)
- [Gitee Release v1.12.0](https://gitee.com/polarismesh/polaris/releases/tag/v1.12.0)

## 版本信息

### polaris-server

#### 功能优化

- [PR #642、#676] 北极星自定义路由功能优化
  
  ![](../images/release-v1.12/release-1.12.0-router.png)
- [PR #687] 支持 xdsv3 协议下发规则时输出debug日志
- [PR #627] 北极星OpenAPI支持Swagger2.0

#### Bug修复

- [PR #650] 修复错误码 i18n 可能导致的空指针问题
- [PR #659] 限流规则匹配标签无法完全删除的问题
- [PR #661] 修复限流用例失败问题
- [PR #673] 修复eureka协议中心跳错误的处理
- [PR #684] 修复自定义路由v1转v2的id漂移问题
- [PR #693] 修复v2路由规则对于v1路由规则兼容逻辑

#### 安装优化

- [PR #690] 单机版本支持部署 polaris-limiter 分布式限流server
- [PR #724] 修复helm部署包中polaris-console.yaml配置不对问题

#### 新贡献者

* [@lbbniu](https://github.com/lbbniu)

**Full Changelog**: [点击链接查看](https://github.com/polarismesh/polaris/compare/v1.11.3...v1.12.0)

### polaris-console

#### 功能优化

- [PR #86] 优化服务实例新增/编辑表单
- [PR #91] Console 使用 Json Web Token 代替用户资源访问凭据，避免浏览器泄露用户Token
- [PR #99] 支持配置中心配置文件编辑页面全屏编辑
- [PR #102] **beta能力** 提供Swagger UI 供加载Polaris Server的OpenAPI 接口, 访问北极星控制台地址（127.0.0.1:8080/apidocs）即可
  ![](../images/release-v1.12/release-1.12.0-swagger.png)
- [PR #110] 新建/编辑服务优化标签交互
 
#### Bug修复

- [PR #92] 修复编辑服务实例时不展示服务实例的地理位置信息数据
- [PR #98] 修复服务可观测性指标聚合查询语句不正确问题

## 配置变动

#### polaris-server.yaml

北极星的自注册服务只保留 polaris.checker ，其他自注册服务被移除

```yaml
# server启动引导配置
bootstrap:
  # 注册为北极星服务
  polaris_service:
    # probe_address: ##DB_ADDR##
    enable_register: true
    isolated: false
    services:
      - name: polaris.checker
        protocols:
          - service-grpc
```

## 升级步骤

**注意：升级步骤仅针对部署了北极星集群版本**

#### 之前已经安装过北极星集群

##### 北极星服务端升级操作

###### 执行 SQL 升级动作

- 登陆北极星的MySQL存储实例
- 执行以下 SQL 增量脚本

```bash
mysql -u $db_user -p $db_pwd -h $db_host < store/sqldb/scripts/delta/v1_11_0-v1_12_0.sql
```

##### 北极星控制台升级操作

更新 polaris-console.yaml 

```yaml
logger:
  RotateOutputPath: log/polaris-console.log
  RotationMaxSize: 500
  RotationMaxAge: 30
  RotationMaxBackups: 100
  level: info
webServer:
  mode: "release"
  listenIP: "0.0.0.0"
  listenPort: 8080
  jwt:
    secretKey: "polarismesh@2021"
    expired: 1800
  namingV1URL: "/naming/v1" # 本次 v1.9.0 版本变动
  namingV2URL: "/naming/v2" # 本次 v1.9.0 版本变动
  authURL: "/core/v1"
  configURL: "/config/v1"
  monitorURL: "/api/v1"
  webPath: "web/dist/"
polarisServer:
  address: "{北极星服务端IP}:8090"
monitorServer:
  address: "127.0.0.1:9090"
oaAuthority:
  enableOAAuth: false
hrData:
  enableHrData: false
```
