const path = require("path");
const sidebar = {
  "/zh/doc/": [
    "",
    {
      title: "快速入门",
      collapsable: false,
      children: [
        "快速入门/安装服务端",
        "快速入门/使用grpc-go",
        "快速入门/使用k8s和服务网格",
        "快速入门/使用polaris-cpp",
        "快速入门/使用polaris-go",
        "快速入门/使用polaris-java",
        "快速入门/使用spring cloud",
      ],
    },
    {
      title: "北极星是什么",
      collapsable: false,
      children: [
        "北极星是什么/简介",
        "北极星是什么/概念",
        "北极星是什么/对比其他组件",
      ],
    },
    {
      title: "接口文档",
      collapsable: false,
      children: ["接口文档/服务端接口", "接口文档/客户端接口"],
    },
    {
      title: "使用指南",
      collapsable: false,
      children: [
        "使用指南/服务熔断",
        "使用指南/服务限流",
        "使用指南/路由和负载均衡",
      ],
    },
    {
      title: "用户案例",
      collapsable: false,
      children: [
        "用户案例/腾讯会议",
        "用户案例/腾讯视频",
        "用户案例/微信支付",
        "用户案例/央视频",
      ],
    },
  ],
  "/zh/news/": [
    {
      collapsable: false,
      sidebarDepth: 0,
      children: [["", "版本更新"], "new1", "new2", "new3"],
    },
  ],
};
const EnglishSidebar = {
  "/en/doc/": [
    "",
    {
      title: "Getting Started",
      collapsable: false,
      children: [
        "getting-started/",
        "getting-started/Installation",
        "getting-started/Using Native SDK",
        "getting-started/Using gRPC",
        "getting-started/Using Spring Boot",
        "getting-started/Using Spring Cloud",
        "getting-started/Using k8s and Service Mesh",
      ],
    },
    {
      title: "Principle",
      collapsable: false,
      children: ["principle/", "principle/Basic conception"],
    },
  ],
  "/en/news/": [
    {
      collapsable: false,
      sidebarDepth: 0,
      children: [["", "Updated Version"], "new1", "new2", "new3"],
    },
  ],
};
module.exports = {
  theme: path.resolve("./docs/.vuepress/theme-default"),
  locales: {
    "/zh/": {
      sidebar: sidebar,
    },
    "/en/": {
      sidebar: EnglishSidebar,
    },
  },
  themeConfig: {
    // Public 文件路径
    logo: "/assets/logo-polaris.png",
    locales: {
      "/zh/": {
        label: "简体中文",
        selectText: "选择语言",
        ariaLabel: "选择语言",
        editLinkText: "在 GitHub 上编辑此页",
        lastUpdated: "上次更新",
        nav: require("./nav/zh"),
        sidebar: sidebar,
      },
      "/en/": {
        sidebar: EnglishSidebar,
      },
    },
    search: true,
    searchMaxSuggestions: 10,
  },
  head: [
    [
      "link",
      {
        rel: "stylesheet",
        href: "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css",
        integrity:
          "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm",
        crossorigin: "anonymous",
      },
    ],
  ],
  configureWebpack: {
    resolve: {
      alias: {
        "@assets": "../../src/assets",
      },
    },
  },
};
