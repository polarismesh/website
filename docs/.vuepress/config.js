const path = require("path");
module.exports = {
  theme: path.resolve("./docs/.vuepress/theme-default"),
  themeConfig: {
    // Public 文件路径
    logo: "/assets/logo-polaris.png",
    locales: {
      "/": {
        label: "简体中文",
        selectText: "选择语言",
        ariaLabel: "选择语言",
        editLinkText: "在 GitHub 上编辑此页",
        lastUpdated: "上次更新",
        nav: require("./nav/zh"),
      },
    },
    search: true,
    searchMaxSuggestions: 10,
    sidebar: {
      "/api/": ["cli", "node"],
      "/doc/": [
        {
          title: "指南",
          collapsable: false,
          children: [
            "",
            "getting-started",
            "directory-structure",
            "basic-config",
            "assets",
            "using-vue",
            "i18n",
            "deploy",
          ],
        },
        {
          title: "深入",
          collapsable: false,
          children: [
            "frontmatter",
            "permalinks",
            "markdown-slot",
            "global-computed",
          ],
        },
      ],
      "/news/": [
        {
          collapsable: false,
          sidebarDepth: 0,
          children: [
            ["", "版本更新"],
            "using-a-plugin",
            "writing-a-plugin",
            "life-cycle",
            "option-api",
            "context-api",
            "context-api",
            "context-api",
          ],
        },
      ],
    },
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
