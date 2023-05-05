---
title: "Release v1.11"
linkTitle: "Release v1.11"
weight: 8
---


## 下载地址

- [Github Release v1.11.0](https://github.com/polarismesh/polaris/releases/tag/v1.11.0)
- [Gitee Release v1.11.0](https://gitee.com/polarismesh/polaris/releases/tag/v1.11.0)

## 版本信息

### polaris-server

#### 功能优化

- [PR #532] 支持配置某些服务在控制台列表进行隐藏
- [PR #526] 支持配置模版功能（UI交互暂未支持）
- [PR #552] 新限流后台功能 & UI 交互优化
- [PR #550] 服务端报错支持 i18n
- [PR #553] 配置中心代码结构调整

#### Bug修复

- [ISSUE #520] 服务注册后，没有做任何操作但是实例的修改时间会发生变化 

#### 安装优化

- [PR #530] 调整 docker 镜像 tag 的发布规则

#### 代码测试

* [PR #509] 单元测试 & 集成测试添加MySQL存储测试场景
* [PR #542] 优化整体的集成测试 & 单元测试
* [PR #548] 单元测试 & 集成测试添加Redis存储测试场景

#### 新贡献者

* @mhcvs2 made their first contribution in https://github.com/polarismesh/polaris/pull/530
* @GuiyangZhao made their first contribution in https://github.com/polarismesh/polaris/pull/532
* @shuiqingliu made their first contribution in https://github.com/polarismesh/polaris/pull/548
* @mangoGoForward made their first contribution in https://github.com/polarismesh/polaris/pull/547

**Full Changelog**: https://github.com/polarismesh/polaris/compare/v1.10.0...v1.11.1

### polaris-console

#### 功能优化

- [PR #66] 创建配置文件时，文件的格式自动从文件名中识别
- [PR #66] 调整创建配置文件页面 Card body 的高度，尽可能充满整个浏览器
- [PR #86] 优化服务实例新增/编辑表单
 
#### Bug修复

- [PR #95] 修复前端删除熔断规则最后一条时没有触发熔断规则解绑


## 升级步骤

**注意：升级步骤仅针对部署了北极星集群版本**

#### 之前已经安装过北极星集群

##### 执行 SQL 升级动作

- 登陆北极星的MySQL存储实例
- 执行以下 SQL 增量脚本

```bash
mysql -u $db_user -p $db_pwd -h $db_host < store/sqldb/scripts/delta/v1_8_0-v1_11_0.sql
```
