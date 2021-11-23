const path = require("path");
const sidebar = {
  "/zh/doc/": [
    {
      title: "北极星是什么",
      children: [
        "北极星是什么/简介",
        "北极星是什么/架构原理",
        "北极星是什么/北极星和k8s",
        "北极星是什么/对比其他组件",
      ],
    },
    {
      title: "快速入门",
      children: [
        "快速入门/单机版安装",
        "快速入门/集群版安装",
        "快速入门/使用polaris-java",
        "快速入门/使用polaris-go",
        "快速入门/使用polaris-cpp",
        "快速入门/使用polaris-php",
        "快速入门/使用spring cloud",
        "快速入门/使用grpc-go",
        "快速入门/使用k8s和服务网格",
      ],
    },
    {
      title: "开源建设",
      children: [
        "开源建设/如何加入",
        "开源建设/行为准则",
        {
          title: "双周例会",
          children: ["开源建设/双周例会/第一次开发者例会"],
        },
      ],
    },
    {
      title: "接口文档",
      children: [
        "接口文档/服务端接口",
        // "接口文档/客户端接口"
      ],
    },
    // {
    //   title: "使用指南",
    //   collapsable: false,
    //   children: ["使用指南/动态路由"],
    // },
    // {
    //   title: "用户案例",
    //   collapsable: false,
    //   children: [
    //     "用户案例/腾讯会议",
    //     "用户案例/腾讯视频",
    //     "用户案例/微信支付",
    //     "用户案例/央视频",
    //   ],
    // },
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
    smoothScroll: true,
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
    [
      "link",
      {
        rel: "icon",
        type: "image/x-icon",
        href: "/vuepress-image/favicon.ico",
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
  title: "文档",
  markdown: {
    extendMarkdown: (md) => {
      md.use(require("markdown-it-disable-url-encode"));
    },
  },
};
