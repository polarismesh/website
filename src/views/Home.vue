<template>
  <div>
    <TopNavbar></TopNavbar>
    <img style="display: none" src="../assets/image/favicon.png" />
    <div class="navbar-bone"></div>
    <div class="wrap-container banner-background">
      <b-row align-v="center" style="padding: 5vw 0">
        <b-col>
          <b-jumbotron
            class="banner-jumbotron"
            header="北极星"
            lead
            style="background-color: transparent; color: #fff"
          >
            <p>一个支持多种开发语言和常用开发框架的服务发现和治理中心</p>
            <p>提供高性能SDK和无侵入Sidecar两种接入方式</p>
            <div class="banner-button-group">
              <b-button
                variant="primary"
                href="zh/doc/北极星是什么/简介.html#简介"
                class="banner-button"
                >文档</b-button
              >
              <b-button
                variant="outline-primary"
                href="https://github.com/PolarisMesh"
                class="banner-button"
                target="_blank"
                >Github</b-button
              >
            </div>
          </b-jumbotron>
        </b-col>
      </b-row>
    </div>
    <div class="responsive-function-info function-info wrap-container">
      <b-row>
        <b-col
          align-self="center"
          style="margin: 4.5vw 0 0 0; text-align: center"
        >
          <h1>核心功能</h1>
        </b-col>
      </b-row>
      <b-row style="margin: 6.3vw 0 0 0; text-align: center">
        <b-col xl="3" lg="6" md="6" cols="12" class="function-card">
          <b-row>
            <b-col cols="12">
              <img
                src="../assets/image/Registration-discovery.svg"
                class="function-image"
              />
            </b-col>
            <b-col cols="12" class="function-text-title">
              <span>服务注册和发现</span>
            </b-col>
            <b-col cols="12" class="function-text-desc">
              <span
                >以服务为中心的分布式应用架构，通过服务和注册发现的方式维护不断变化的请求地址，提高应用的扩展能力，降低应用的迁移成本</span
              >
            </b-col>
          </b-row>
        </b-col>
        <b-col xl="3" lg="6" md="6" cols="12" class="function-card">
          <b-row>
            <b-col cols="12">
              <img src="../assets/image/Router.svg" class="function-image" />
            </b-col>
            <b-col cols="12" class="function-text-title">
              <span>路由和负载均衡</span>
            </b-col>
            <b-col cols="12" class="function-text-desc">
              <span
                >根据请求标签、实例标签和标签匹配规则，对线上流量进行动态调度，可以应用于按地域就近、单元化隔离和金丝雀发布等多种场景</span
              >
            </b-col>
          </b-row>
        </b-col>
        <b-col xl="3" lg="6" md="6" cols="12" class="function-card">
          <b-row>
            <b-col cols="12">
              <img
                src="../assets/image/Fault-fusing.svg"
                class="function-image"
              />
            </b-col>
            <b-col cols="12" class="function-text-title">
              <span>熔断降级和限流</span>
            </b-col>
            <b-col cols="12" class="function-text-desc">
              <span
                >及时熔断异常的服务、接口、实例或者实例分组，降低请求失败率。针对不同的请求来源和系统资源进行访问限流，避免服务被压垮</span
              >
            </b-col>
          </b-row>
        </b-col>
        <b-col xl="3" lg="6" md="6" cols="12" class="function-card">
          <b-row>
            <b-col cols="12">
              <img
                src="../assets/image/Observability.svg"
                class="function-image"
              />
            </b-col>
            <b-col cols="12" class="function-text-title">
              <span>可观测性</span>
            </b-col>
            <b-col cols="12" class="function-text-desc">
              <span
                >支持请求量、请求延时和请求成功率的指标查询，支持服务调用关系和多维度的流量曲线查询，实现服务治理功能和流量观测一体化</span
              >
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <div class="responsive-topo-info wrap-container">
      <b-row align-v="center">
        <img class="topo-graph" src="../assets/image/topo-graph.png" />
      </b-row>
    </div>

    <div class="feature-container wrap-container">
      <b-row>
        <b-col
          align-self="center"
          style="margin: 4.5vw 0 0 0; text-align: center"
        >
          <h1 class="feature-title">特色亮点</h1>
        </b-col>
      </b-row>
      <b-row style="margin-top: 6vw" aligh-h="center">
        <b-col
          xl="6"
          lg="8"
          md="8"
          cols="12"
          offset-md="2"
          offset-cols="2"
          offset-lg="2"
          offset-xl="0"
        >
          <b-card class="feature-card">
            <b-row align-v="center" style="height: 100%">
              <b-col>
                <b-media>
                  <template #aside>
                    <img
                      src="../assets/image/One-stopServiceGovernance.svg"
                      alt="placeholder"
                      style="width: 5vw"
                    />
                  </template>

                  <h5 class="mt-0">一站式服务治理中心</h5>
                  <p>
                    集服务注册中心和服务治理控制面于一体，帮助业务解决分布式或者微服务架构面临的注册发现、故障容错、流量控制和安全问题
                  </p>
                </b-media>
              </b-col>
            </b-row>
          </b-card>
          <b-row
            align-v="center"
            style="height: 100%"
            class="feature-card-small"
          >
            <b-col>
              <b-row>
                <b-col cols="12">
                  <img
                    src="../assets/image/One-stopServiceGovernance.svg"
                    class="function-image"
                  />
                </b-col>
                <b-col cols="12" class="function-text-title">
                  <span>一站式服务治理中心</span>
                </b-col>
                <b-col cols="12" class="function-text-desc">
                  <span
                    >集服务注册中心和服务治理控制面于一体，帮助业务解决分布式或者微服务架构面临的注册发现、故障容错、流量控制和安全问题</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col
          xl="6"
          lg="8"
          md="8"
          cols="12"
          offset-md="2"
          offset-cols="2"
          offset-lg="2"
          offset-xl="0"
        >
          <b-card class="feature-card">
            <b-row align-v="center" style="height: 100%">
              <b-col>
                <b-media>
                  <template #aside>
                    <img
                      src="../assets/image/Multi-language-console.svg"
                      alt="placeholder"
                      style="width: 5vw"
                    />
                  </template>

                  <h5 class="mt-0">支持多种开发语言</h5>
                  <p>
                    提供Java、Go和C++等多种高性能、功能语义相同的SDK，可以轻松集成到不同的技术栈，帮助企业实现统一的服务发现和治理
                  </p>
                </b-media>
              </b-col>
            </b-row>
          </b-card>
          <b-row
            align-v="center"
            style="height: 100%"
            class="feature-card-small"
          >
            <b-col>
              <b-row>
                <b-col cols="12">
                  <img
                    src="../assets/image/Multi-language-console.svg"
                    class="function-image"
                  />
                </b-col>
                <b-col cols="12" class="function-text-title">
                  <span>支持多种开发语言</span>
                </b-col>
                <b-col cols="12" class="function-text-desc">
                  <span
                    >提供Java、Go和C++等多种高性能、功能语义相同的SDK，可以轻松集成到不同的技术栈，帮助企业实现统一的服务发现和治理</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row style="margin-top: 1vw">
        <b-col
          xl="6"
          lg="8"
          md="8"
          cols="12"
          offset-md="2"
          offset-cols="2"
          offset-lg="2"
          offset-xl="0"
        >
          <b-card class="feature-card">
            <b-row align-v="center" style="height: 100%">
              <b-col>
                <b-media>
                  <template #aside>
                    <img
                      src="../assets/image/Multi-Framework.svg"
                      alt="placeholder"
                      style="width: 5vw"
                    />
                  </template>

                  <h5 class="mt-0">支持常用开发框架</h5>
                  <p>
                    北极星服务治理SDK可以集成到gRPC和Spring
                    Cloud等开发框架中，帮助框架完善服务治理功能。框架用户不感知，接入成本低
                  </p>
                </b-media>
              </b-col>
            </b-row>
          </b-card>
          <b-row
            align-v="center"
            style="height: 100%"
            class="feature-card-small"
          >
            <b-col>
              <b-row>
                <b-col cols="12">
                  <img
                    src="../assets/image/Multi-Framework.svg"
                    class="function-image"
                  />
                </b-col>
                <b-col cols="12" class="function-text-title">
                  <span>支持常用开发框架</span>
                </b-col>
                <b-col cols="12" class="function-text-desc">
                  <span>
                    北极星服务治理SDK可以集成到gRPC和Spring
                    Cloud等开发框架中，帮助框架完善服务治理功能。框架用户不感知，接入成本低
                  </span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col
          xl="6"
          lg="8"
          md="8"
          cols="12"
          offset-md="2"
          offset-cols="2"
          offset-lg="2"
          offset-xl="0"
        >
          <b-card class="feature-card">
            <b-row align-v="center" style="height: 100%">
              <b-col>
                <b-media>
                  <template #aside>
                    <img
                      src="../assets/image/Support-Kubernetes.svg"
                      alt="placeholder"
                      style="width: 5vw"
                    />
                  </template>

                  <h5 class="mt-0">支持Kubernetes</h5>
                  <p>
                    提供原生的k8s polaris-controller，支持k8s
                    service自动注入，帮助k8s无缝兼容微服务框架体系，实现跨集群的服务发现和治理
                  </p>
                </b-media>
              </b-col>
            </b-row>
          </b-card>
          <b-row
            align-v="center"
            style="height: 100%"
            class="feature-card-small"
          >
            <b-col>
              <b-row>
                <b-col cols="12">
                  <img
                    src="../assets/image/Support-Kubernetes.svg"
                    class="function-image"
                  />
                </b-col>
                <b-col cols="12" class="function-text-title">
                  <span>支持Kubernetes</span>
                </b-col>
                <b-col cols="12" class="function-text-desc">
                  <span>
                    提供原生的k8s polaris-controller，支持k8s
                    service自动注入，帮助k8s无缝兼容微服务框架体系，实现跨集群的服务发现和治理
                  </span>
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
      <b-row style="margin-top: 1vw">
        <b-col
          xl="6"
          lg="8"
          md="8"
          cols="12"
          offset-md="2"
          offset-cols="2"
          offset-lg="2"
          offset-xl="0"
        >
          <b-card class="feature-card">
            <b-row align-v="center" style="height: 100%">
              <b-col>
                <b-media>
                  <template #aside>
                    <img
                      src="../assets/image/Service-Mesh.svg"
                      alt="placeholder"
                      style="width: 5vw"
                    />
                  </template>

                  <h5 class="mt-0">服务网格</h5>
                  <p>
                    提供高性能SDK和无侵入Sidecar两种接入方式，采用SDK和Sidecar的服务可以互相访问，功能语义相同，适用于不同的业务场景
                  </p>
                </b-media>
              </b-col>
            </b-row>
          </b-card>
          <b-row
            align-v="center"
            style="height: 100%"
            class="feature-card-small"
          >
            <b-col>
              <b-row>
                <b-col cols="12">
                  <img
                    src="../assets/image/Service-Mesh.svg"
                    class="function-image"
                  />
                </b-col>
                <b-col cols="12" class="function-text-title">
                  <span>服务网格</span>
                </b-col>
                <b-col cols="12" class="function-text-desc">
                  <span
                    >提供高性能SDK和无侵入Sidecar两种接入方式，采用SDK和Sidecar的服务可以互相访问，功能语义相同，适用于不同的业务场景</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
        <b-col
          xl="6"
          lg="8"
          md="8"
          cols="12"
          offset-md="2"
          offset-cols="2"
          offset-lg="2"
          offset-xl="0"
        >
          <b-card class="feature-card">
            <b-row align-v="center" style="height: 100%">
              <b-col>
                <b-media>
                  <template #aside>
                    <img
                      src="../assets/image/MassProductionApplications.svg"
                      alt="placeholder"
                      style="width: 5vw"
                    />
                  </template>

                  <h5 class="mt-0">大规模生产应用</h5>
                  <p>
                    腾讯服务治理中心的开源版本，为腾讯百万服务提供标准的服务治理功能，沉淀了腾讯从虚拟机到容器时代的分布式服务治理经验
                  </p>
                </b-media>
              </b-col>
            </b-row>
          </b-card>
          <b-row
            align-v="center"
            style="height: 100%"
            class="feature-card-small"
          >
            <b-col>
              <b-row>
                <b-col cols="12">
                  <img
                    src="../assets/image/MassProductionApplications.svg"
                    class="function-image"
                  />
                </b-col>
                <b-col cols="12" class="function-text-title">
                  <span>大规模生产应用</span>
                </b-col>
                <b-col cols="12" class="function-text-desc">
                  <span
                    >腾讯服务治理中心的开源版本，为腾讯百万服务提供标准的服务治理功能，沉淀了腾讯从虚拟机到容器时代的分布式服务治理经验</span
                  >
                </b-col>
              </b-row>
            </b-col>
          </b-row>
        </b-col>
      </b-row>
    </div>
    <div class="wrap-container customer-case">
      <b-row>
        <b-col align-self="center" class="customer-image-row">
          <h1 class="feature-title" style="color: #000">用户案例</h1>
        </b-col>
      </b-row>
      <b-row class="customer-image-row">
        <b-col
          align-self="center"
          xl="3"
          lg="3"
          md="6"
          cols="12"
          class="customer-image"
        >
          <img src="../assets/image/Wechat-pay.png" />
        </b-col>
        <b-col
          align-self="center"
          xl="3"
          lg="3"
          md="6"
          cols="12"
          class="customer-image"
        >
          <img src="../assets/image/Tencent-video.png" />
        </b-col>
        <b-col
          align-self="center"
          xl="3"
          lg="3"
          md="6"
          cols="12"
          class="customer-image"
        >
          <img src="../assets/image/Tencent-meeting.png" />
        </b-col>
        <b-col
          align-self="center"
          xl="3"
          lg="3"
          md="6"
          cols="12"
          class="customer-image"
        >
          <img src="../assets/image/yangshipin.png" />
        </b-col>
      </b-row>
    </div>
    <div class="footer">
      @ 2021 The PolarisMesh Authors | A Tencent Microservice Project
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import HomeSkeleton from "@/components/HomeSkeleton.vue";
import TopNavbar from "@/components/TopNavbar.vue";

@Component({
  components: {
    HomeSkeleton,
    TopNavbar,
  },
})
export default class Home extends Vue {}
</script>

<style>
.wrap-container {
  padding: 0 15vw;
}
.home {
  width: 70vw;
  margin: auto;
}
.navlink {
  margin: 0px 1vw;
}
.footer {
  width: 100%;
  background-color: #f8f8f8;
  padding: 20px 0;
  color: #999;
  text-align: center;
}
.banner-background {
  background-image: url("../assets/image/banner.jpeg");
}
.banner-button-group {
  margin: 3.75rem 0;
}
.banner-button {
  margin: 0 1.5rem 0 0;
  width: 12rem;
  height: 3rem;
  line-height: 2;
}
.function-image {
  width: 6.25vw;
  min-width: 100px;
}
.customer-case {
  padding-bottom: 50px;
  height: auto;
}
.function-text-title {
  margin-top: 1.5vw;
}
.function-text-desc {
  margin-top: 0.75vw;
}
.function-text-title > span {
  font-family: PingFangSC-Medium;
  font-size: 22px;
  color: #000000;
  letter-spacing: 0;
  font-weight: 500;
}
.function-text-desc > span {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #888888;
  letter-spacing: 0;
  text-align: center;
  line-height: 24px;
  font-weight: 400;
}
.topo-graph {
  width: 100vw;
  margin: 2vw auto;
  min-height: 300px;
  min-width: 676px;
}
.feature-title {
  font-family: PingFangSC-Semibold;
  color: #000000;
  letter-spacing: 0;
  font-weight: 600;
}
.feature-card {
  background: rgba(81, 82, 88, 0);
  border: none;
}
.feature-card h5 {
  font-family: PingFangSC-Medium;
  font-size: 22px;
  color: #000000;
  letter-spacing: 0;
  font-weight: 500;
}
.feature-card p {
  margin-top: 1vw;
  opacity: 0.7;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: #000000;
  letter-spacing: 0;
  font-weight: 400;
}
.customer-image-row {
  margin: 4.5vw 0 0 0;
  text-align: center;
}
.customer-image-row img {
  width: 15vw;
  height: auto;
  min-width: 200px;
  margin: 20px 0;
}
.row {
  --bs-gutter-x: 2vw;
}
.function-card {
  margin-bottom: 20px;
}
.feature-container {
  background-color: #f2f3f5;
  margin-bottom: 20px;
}
.responsive-function-info {
  padding-bottom: 50px;
}
.feature-card-small {
  display: none;
}
.feature-container {
  padding-bottom: 50px;
}
@media screen and (max-width: 1200px) {
  .feature-container {
  }
  .feature-info {
  }
  .feature-card {
    margin-top: 20px;
  }
  .responsive-topo-info {
    overflow-x: scroll;
  }
  .home {
    width: 100vw;
    margin: auto;
  }
  .navbar-background {
    width: 95vw;
    margin: 0 2.5vw;
  }
  .wrap-navbar-background {
    padding: 0;
  }
  .navbar-skeleton,
  .navbar-background,
  .wrap-navbar-background {
    background-color: rgba(14, 17, 36, 1) !important;
  }
  .banner-button {
    width: 8rem;
  }
}
@media screen and (max-width: 768px) {
  .banner-button {
    margin: 20px auto;
    width: 12rem;
    height: 3rem;
    line-height: 2;
    display: block;
  }
  .feature-card-small {
    display: flex;
    text-align: center;
    margin-bottom: 30px;
  }
  .feature-card {
    display: none;
  }
  .banner-jumbotron {
    margin-top: 100px;
  }
}
@media screen and (max-width: 1600px) and (min-width: 1200px) {
  .responsive-function-info {
  }
  .feature-info {
  }
  .feature-container {
  }
  .feature-card {
    margin-top: 20px;
  }
}
</style>
