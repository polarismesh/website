# Release V1.11.0

  - [下载地址](#下载地址)
      - [Github](#github)
      - [Gitee](#gitee)
  - [版本信息](#版本信息)
    - [polaris-server](#polaris-server)
      - [功能优化](#功能优化)
      - [Bug修复](#bug修复)
      - [安装优化](#安装优化)
      - [代码测试](#代码测试)
      - [新贡献者](#新贡献者)
    - [polaris-console](#polaris-console)
      - [功能优化](#功能优化-1)
      - [Bug修复](#bug修复-1)
  - [升级步骤](#升级步骤)
      - [之前已经安装过北极星集群](#之前已经安装过北极星集群)
        - [执行 SQL 升级动作](#执行-sql-升级动作)

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
- 执行以下 SQL 语句

```SQL
USE `polaris_server`;

CREATE TABLE `config_file_template` (
    `id` bigint(10) unsigned NOT NULL AUTO_INCREMENT COMMENT '主键',
    `name` varchar(128) COLLATE utf8_bin NOT NULL COMMENT '配置文件模板名称',
    `content` longtext COLLATE utf8_bin NOT NULL COMMENT '配置文件模板内容',
    `format` varchar(16) COLLATE utf8_bin DEFAULT 'text' COMMENT '模板文件格式',
    `comment` varchar(512) COLLATE utf8_bin DEFAULT NULL COMMENT '模板描述信息',
    `flag` tinyint(4) NOT NULL DEFAULT '0' COMMENT '软删除标记位',
    `create_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    `create_by` varchar(32) COLLATE utf8_bin DEFAULT NULL COMMENT '创建人',
    `modify_time` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间',
    `modify_by` varchar(32) COLLATE utf8_bin DEFAULT NULL COMMENT '最后更新人',
    PRIMARY KEY (`id`),
    UNIQUE KEY `uk_name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=1 DEFAULT CHARSET=utf8 COLLATE=utf8_bin COMMENT='配置文件模板表';

ALTER TABLE `ratelimit_config` CHANGE `cluster_id` `name` varchar(64) NOT NULL;
ALTER TABLE `ratelimit_config` ADD COLUMN `disable` tinyint(4)  NOT NULL DEFAULT '0';
ALTER TABLE `ratelimit_config` ADD COLUMN `etime` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE `ratelimit_config` ADD COLUMN `method` varchar(512)   NOT NULL;
```
