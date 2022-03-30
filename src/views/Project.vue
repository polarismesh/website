<template>
  <div>
    <TopNavbar></TopNavbar>
    <div class="navbar-bone"></div>
    <div class="wrap-container banner-project">
      <b-row align-v="center" style="padding: 12vh 0 5px 0">
        <b-col
          style="
            color: #fff;
            font-size: 24px;
            font-weight: 500;
            text-align: center;
          "
          >项目和生态</b-col
        >
      </b-row>
      <b-row align-v="center" style="padding: 0 0 3vw 0px">
        <b-col class="description-header" cols="12"
          >为分布式或者微服务架构提供标准化的服务发现和治理方案，支持多语言、多框架和服务网格
        </b-col>
        <b-col class="description-header" cols="12"
          >注册发现、故障容错、流量调度、访问控制、可观测性
        </b-col>
      </b-row>
    </div>
    <div class="wrap-container categories-container">
      <b-row align-v="center" style="padding: 20px 0 20px 0">
        <b-col>
          <b-badge
            variant="light"
            class="categories-badge"
            v-for="item in badgeType"
            :key="item"
            :href="`#${item}`"
          >
            {{ item }}
          </b-badge>
        </b-col>
      </b-row>
    </div>
    <div class="wrap-container">
      <div v-for="item in categories" :key="item.name" class="categories">
        <div class="scroll-anchor" :id="item.name"></div>
        <div class="categories-header">{{ item.name }}</div>
        <b-row>
          <b-col
            v-for="project in item.projects"
            :key="project.name"
            cols="12"
            sm="12"
            md="12"
            lg="6"
            xl="4"
            style="margin-bottom: 20px"
          >
            <b-card class="project-card mb-2">
              <div
                :class="`card-logo ${
                  project.name.indexOf('polaris') === -1
                    ? 'color2'
                    : project.name.indexOf('polaris') === 0
                    ? 'color1'
                    : 'color3'
                }`"
              >
                <img
                  src="../assets/image/small-polaris-logo.png"
                  class="small-logo"
                  alt="Polaris"
                />
              </div>
              <b-card-title class="project-title">{{
                project.name
              }}</b-card-title>
              <b-card-text class="project-description">{{
                project.description
              }}</b-card-text>
              <b-button
                variant="outline-secondary"
                class="project-github-btn"
                :href="project.githubLink"
                target="_blank"
                ><img
                  src="../assets/image/github-icon.png"
                  class="small-logo"
                  alt="github"
                />
                Github</b-button
              >
            </b-card>
          </b-col>
        </b-row>
      </div>
    </div>
    <Footer></Footer>
  </div>
</template>
<script>
import { Component, Vue } from "vue-property-decorator";
import TopNavbar from "@/components/TopNavbar.vue";
import Footer from "@/components/Footer.vue";

export default {
  name: "Project",
  components: { TopNavbar, Footer },
  data() {
    return {
      colors: ["#0052D9", "#6C44AE", "#007595", "#4742B9"],
      categories: [
        // {
        //   name: "标准",
        //   projects: [
        //     {
        //       name: "specification",
        //       description: "",
        //       githubLink: "",
        //     },
        //   ],
        // },
        {
          name: "服务端",
          projects: [
            {
              name: "polaris",
              description:
                "Service Discovery and Governance Center for Distributed and Microservice Architecture.",
              githubLink: "https://github.com/polarismesh/polaris",
            },
            {
              name: "polaris-console",
              description: "Console for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-console",
            },
            {
              name: "polaris-controller",
              description:
                "K8s Controller for Automatic Injection of K8s Service and Polaris Sidecar.",
              githubLink: "https://github.com/polarismesh/polaris-controller",
            },
          ],
        },
        {
          name: "Java 应用开发",
          projects: [
            {
              name: "polaris-java",
              description: "Java Client for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-java",
            },
            {
              name: "grpc-java-polaris",
              description: "grpc-java integrates with polaris-java.",
              githubLink: "https://github.com/polarismesh/grpc-java-polaris",
            },
            {
              name: "spring-cloud-tencent",
              description:
                "an integration solution for spring cloud and tencent open source middleware.",
              githubLink: "https://github.com/tencent/spring-cloud-tencent",
            },
            {
              name: "spring-boot-polaris",
              description: "spring-boot integrates with polaris-java.",
              githubLink: "https://github.com/polarismesh/spring-boot-polaris",
            },
            {
              name: "polaris-java-agent",
              description: "inject polaris-java into spring cloud and dubbo.",
              githubLink: "https://github.com/polarismesh/polaris-java-agent",
            },
          ],
        },
        {
          name: "Go 应用开发",
          projects: [
            {
              name: "polaris-go",
              description: "Go Client for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-go",
            },
            {
              name: "grpc-go-polaris",
              description: "grpc-go integrates with polaris-go.",
              githubLink: "https://github.com/polarismesh/grpc-go-polaris",
            },
            {
              name: "go-kratos",
              description: "go-kratos integrates with polaris-go.",
              githubLink:
                "https://github.com/go-kratos/kratos/tree/main/contrib/registry/polaris",
            },
            {
              name: "go-zero",
              description: "go-zero integrates with polaris-go.",
              githubLink:
                "https://github.com/zeromicro/zero-contrib/tree/main/zrpc/registry/polaris",
            },
            {
              name: "go-frame",
              description: "go-frame integrates with polaris-go.",
              githubLink: "https://github.com/gogf/polaris",
            },
            {
              name: "dubbo-go",
              description: "dubbo-go integrates with polaris-go.",
              githubLink:
                "https://github.com/apache/dubbo-go/tree/master/registry/polaris",
            },
            {
              name: "kitex",
              description: "kitex integrates with polaris-go.",
              githubLink: "https://github.com/kitex-contrib/registry-polaris",
            },
          ],
        },
        {
          name: "C/C++ 应用开发",
          projects: [
            {
              name: "polaris-cpp",
              description: "C++ Client for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-cpp",
            },
          ],
        },
        {
          name: "其他语言应用开发",
          projects: [
            {
              name: "polaris-php",
              description: "PHP Client based on C++ for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-php",
            },
            {
              name: "polaris-lua",
              description: "Lua Client based on C++ for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-lua",
            },
          ],
        },
        {
          name: "DNS 和 Proxy",
          projects: [
            {
              name: "polaris-sidecar",
              description:
                "Enhanced DNS Agent and Proxy Service Mesh Solution for Polaris.",
              githubLink: "https://github.com/polarismesh/polaris-sidecar",
            },
          ],
        },
        {
          name: "网关接入",
          projects: [
            {
              name: "nginx-polaris",
              description: "nginx integrates with polaris-cpp.",
              githubLink: "https://github.com/polarismesh/nginx-polaris",
            },
          ],
        },
      ],
    };
  },
  computed: {
    badgeType() {
      // `this` 指向 vm 实例
      return this.categories.map((item) => item.name);
    },
  },
};
</script>
<style>
.banner-project {
  background-image: url("../assets/image/project-banner.png");
}
.categories-container {
  text-align: center;
}
.categories-badge {
  margin: 5px 5px;
  text-align: center;
  text-decoration: none;
  background-color: rgba(0, 0, 0, 0.05);
  color: #000;
  font-size: 12px;
  font-family: "PingFangSC";
  font-weight: 400;
  padding: 4px 12px;
}
.project-card {
  height: 100%;
  background-color: #f8f8f8;
  border: none;
  border-radius: 0;
  margin-bottom: 20px;
}
.project-card .card-text {
  height: 60px;
  overflow: hidden;
}
.categories {
  padding: 12px 0px 0px 0px;
  font-family: "PingFangSC";
}
.categories-header {
  font-size: 20px;
  margin-bottom: 32px;
  font-weight: 600;
}
.project-card .card-logo {
  width: 36px;
  height: 36px;
  border-radius: 4px;
  margin-bottom: 10px;
}
.project-title {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 14px;
}
.project-description {
  font-size: 14px;
  font-weight: 400;
  margin-bottom: 24px;
}
.small-logo {
  width: 16px;
  height: 16px;
  margin-right: 5px;
  float: left;
}
.description-header {
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  text-align: center;
  font-family: "PingFangSC";
  font-weight: 400;
}
.project-github-btn:focus {
  box-shadow: none;
}
.project-github-btn:hover {
  color: #6c757d;
  border-color: #6c757d;
  background-color: transparent;
}
.project-github-btn .small-logo {
  margin-top: 3px;
}
.color1 {
  background-color: #0052d9;
}
.color2 {
  background-color: #6c44ae;
}
.color3 {
  background-color: #007595;
}
.color4 {
  background-color: #4742b9;
}
.project-card .card-body {
  padding: 32px;
}
.scroll-anchor {
  position: relative;
  top: -80px;
  float: left;
}
@media screen and (max-width: 768px) {
  .project-card .card-text {
    height: 80px;
    overflow: scroll;
  }
}
</style>
