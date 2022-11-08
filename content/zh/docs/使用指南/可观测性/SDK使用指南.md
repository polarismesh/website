---
title: "SDK 使用指南"
linkTitle: "SDK 使用指南"
weight: 801
---

## Prometheus准备

- 修改 prometheus.yaml 文件，参考如下配置
```yaml
...

# Load rules once and periodically evaluate them according to the global 'evaluation_interval'.
rule_files:
  # - "first_rules.yml"
  # - "second_rules.yml"

# A scrape configuration containing exactly one endpoint to scrape:
# Here it's Prometheus itself.
scrape_configs:
  # The job name is added as a label `job=<job_name>` to any timeseries scraped from this config.
  - job_name: "polarismesh"

    # 这里使用 prometheus 的 http-discovery，通过北极星接口获取 targets 列表
    http_sd_configs:
       - url: http://{北极星 server ip}:9000/prometheus/v1/clients

...
```

## Polaris-Console准备

- 修改polaris-console.yaml，配置 prometheus 服务端地址信息

```yaml
...
polarisServer:
  address: "{ 北极星 server ip }:8090"
monitorServer:
  address: "{ prometheus 所在 IP }:9090"
...
```

## SDK准备

### Golang

```yaml
global:
  serverConnector:
    addresses:
      - { 北极星 server ip }:8091
  statReporter:
    enable: true
    chain:
      - prometheus
    plugin:
      prometheus:
        #描述: 设置 prometheus http-server 的监听端口
        #类型:int
        #如果不填写，或者填写0, 则随机选择一个可用端口进行启动 http-server
        metricPort: 0
```




