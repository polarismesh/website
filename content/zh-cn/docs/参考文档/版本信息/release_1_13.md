---
title: "Release v1.13"
linkTitle: "Release v1.13"
weight: 6
---


## 下载地址

- [Github Release v1.13.0](https://github.com/polarismesh/polaris/releases/tag/v1.13.0)

## 版本信息

### polaris-server

#### Features

- [ISSUE #338] support config auth by @chuntaojun in https://github.com/polarismesh/polaris/pull/623
- feat: support data sync between eureka and polaris by @andrewshan in https://github.com/polarismesh/polaris/pull/818

####  Enhancement

* Fix: rename module name(#714) by @enjoyliu in https://github.com/polarismesh/polaris/pull/716
* protobuf go struct tag inject and other OS platfrom support by @onecer in https://github.com/polarismesh/polaris/pull/748
* Refactor remove third plugin by @chuntaojun in https://github.com/polarismesh/polaris/pull/756
* fix: 移除platform和bussiness逻辑代码(#720) by @alexwanglei in https://github.com/polarismesh/polaris/pull/761
* fix: #672 优化日志 by @hoErYu in https://github.com/polarismesh/polaris/pull/735
* feat: organize part of the repetitive content by @houseme in https://github.com/polarismesh/polaris/pull/767
* feat: 丰富运维管理接口相关接口swagger信息 by @onecer in https://github.com/polarismesh/polaris/pull/770
* [ISSUE #804] 支持 eureka 服务大小写不敏感在北极星的存储方式 by @reallovelei in https://github.com/polarismesh/polaris/pull/804
* feat: 北极星内部事件中心机制优化(#342) by @alexwanglei in https://github.com/polarismesh/polaris/pull/796
* feat：优化eureka插件大小写敏感，默认大小写不敏感 by @andrewshan in https://github.com/polarismesh/polaris/pull/820
* fix: #751 timewheel用来做轮转任务会每轮增加timewheel.interval时间的问题 by @hoErYu in https://github.com/polarismesh/polaris/pull/752
* Feature: improve code and improve golangci-lint config by @houseme in https://github.com/polarismesh/polaris/pull/777
* enrich naming swagger docs by @onecer in https://github.com/polarismesh/polaris/pull/778
* fix: 鉴权插件优化(#709) by @alexwanglei in https://github.com/polarismesh/polaris/pull/771
* 等待 apiserver 都启动完成，再自注册。 by @reallovelei in https://github.com/polarismesh/polaris/pull/785
* Golangci action part 1 by @chuntaojun in https://github.com/polarismesh/polaris/pull/763
* Fix action yaml name by @chuntaojun in https://github.com/polarismesh/polaris/pull/764
* feat: improve code golangci config by @houseme in https://github.com/polarismesh/polaris/pull/765
* feat: fix server exit or restart signal by @daheige in https://github.com/polarismesh/polaris/pull/768
* feat: code style for cache package by @daheige in https://github.com/polarismesh/polaris/pull/773
* feat: update go.mod for require by @daheige in https://github.com/polarismesh/polaris/pull/728
* feat: update namespace for code style by @daheige in https://github.com/polarismesh/polaris/pull/730
* feat: update plugin for code style by @daheige in https://github.com/polarismesh/polaris/pull/733
* [ISSUE #741] Fix import style by @chuntaojun in https://github.com/polarismesh/polaris/pull/740
* 优化mysql参数判断 by @reallovelei in https://github.com/polarismesh/polaris/pull/797
* Add batch clean instances maintian interface by @shichaoyuan in https://github.com/polarismesh/polaris/pull/784
* refactor:Adjust instance event implementation by @chuntaojun in https://github.com/polarismesh/polaris/pull/811

#### Plugins

- fix:discoverevent 添加上报日志到loki插件 (#648) by @alexwanglei in https://github.com/polarismesh/polaris/pull/708
- fix: history添加插件上报Loki(#656) by @alexwanglei in https://github.com/polarismesh/polaris/pull/719

#### Install

- fix: 修复polaris-console.yaml启动问题 by @xinyuwang in https://github.com/polarismesh/polaris/pull/725
- [ISSUE #737] Install standalone limiter by @chuntaojun in https://github.com/polarismesh/polaris/pull/746
- 修复：windows中修改端口后无效的问题 by @qindong0809 in https://github.com/polarismesh/polaris/pull/780

#### BugFix

* fix:优化v2路由规则对于v1路由规则的兼容逻辑 by @chuntaojun in https://github.com/polarismesh/polaris/pull/707
* fix：修改数据库升级脚本导入失败问题 by @andrewshan in https://github.com/polarismesh/polaris/pull/713
* [ISSUE #754] feat: 修复XDS正则表达式不生效问题 by @chuntaojun in https://github.com/polarismesh/polaris/pull/755
* [ISSUE #760] 限流规则禁用SDK无法感知 by @chuntaojun in https://github.com/polarismesh/polaris/pull/772
* fix-shellcheck(SC1128) The shebang must be on the first line. by @dyrnq in https://github.com/polarismesh/polaris/pull/815
* typo: 替换错别字 by @Skyenought in https://github.com/polarismesh/polaris/pull/816
* docs: 修复 README 中失效的链接 by @Skyenought in https://github.com/polarismesh/polaris/pull/806
* docs: 修复图片链接失效 by @Skyenought in https://github.com/polarismesh/polaris/pull/807
* feat: fix restart by @daheige in https://github.com/polarismesh/polaris/pull/810
* polaris 集群模式副本数取值错误问题 by @xuyiyu411 in https://github.com/polarismesh/polaris/pull/813
* fix:修复zh.toml中的错误码描述 by @chuntaojun in https://github.com/polarismesh/polaris/pull/743
* Fix limiter yaml name by @chuntaojun in https://github.com/polarismesh/polaris/pull/801
* 注释修正 by @reallovelei in https://github.com/polarismesh/polaris/pull/800

#### Test

- Unit test auth by @chuntaojun in https://github.com/polarismesh/polaris/pull/718
- 支持 eureka 服务大小写不敏感在北极星的存储方式,调整集成测试。 by @reallovelei in https://github.com/polarismesh/polaris/pull/809
- [ISSUE #759] feat: 添加 github action by @chuntaojun in https://github.com/polarismesh/polaris/pull/758
- Test/it bootstrap file by @chuntaojun in https://github.com/polarismesh/polaris/pull/788
- fix gilangci config by @houseme in https://github.com/polarismesh/polaris/pull/799

## New Contributors
* @alexwanglei made their first contribution in https://github.com/polarismesh/polaris/pull/708
* @hoErYu made their first contribution in https://github.com/polarismesh/polaris/pull/735
* @qindong0809 made their first contribution in https://github.com/polarismesh/polaris/pull/780
* @reallovelei made their first contribution in https://github.com/polarismesh/polaris/pull/785
* @Skyenought made their first contribution in https://github.com/polarismesh/polaris/pull/806
* @xuyiyu411 made their first contribution in https://github.com/polarismesh/polaris/pull/813
* @dyrnq made their first contribution in https://github.com/polarismesh/polaris/pull/815

**Full Changelog**: [点击链接查看](https://github.com/polarismesh/polaris/compare/v1.12.1...v1.13.0)
