---
title: "服务端相关"
linkTitle: "服务端相关"
weight: 1
---

#### 北极星集群版安装，初始化数据库发生 “Specified key 'name' was too long; max key length is 767 bytes”

> 解决方案

- 启用**innodb_large_prefix**参数能够取消对于索引中每列长度的限制(但是无法取消对于索引总长度的限制)
- 启用**innodb_large_prefix**必须同时指定**innodb_file_format=barracuda，innodb_file_per_table=true**，并且建表的时候指定表的**row_format**为**dynamic**或者**compressed**（mysql 5.6中row_format默认值为compact）
