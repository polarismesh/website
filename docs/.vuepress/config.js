const path = require("path");
const sidebar = {
    "/zh/doc/": [{
            title: "概念",
            children: [
                "概念/北极星是什么",
                "概念/北极星组件",
                "概念/北极星和K8s",
				{
					title: "北极星资源模型",
					children: [
						"概念/北极星资源模型/命名空间",
						"概念/北极星资源模型/服务",
						"概念/北极星资源模型/实例分组",
						"概念/北极星资源模型/服务实例",
						"概念/北极星资源模型/配置分组"
					]
				},
				{
					title: "北极星服务治理",
					children: [
						"概念/北极星服务治理/基本原理",
						"概念/北极星服务治理/动态路由",
						"概念/北极星服务治理/负载均衡",
						"概念/北极星服务治理/健康检查",
						"概念/北极星服务治理/熔断降级",
						"概念/北极星服务治理/访问限流",
					]
				},
				{
					title: "北极星架构原理",
					children: [
						"概念/北极星架构原理/polaris架构设计",
					]
				}
            ],
        },
        {
            title: "入门",
            children: [{
                    title: "安装服务端",
                    children: [
                        "入门/安装服务端/安装单机版",
                        "入门/安装服务端/安装集群版",
                    ]
                },
                "入门/使用SDK接入",
                "入门/使用框架接入",
                "入门/使用网关接入",
                "入门/使用服务网格"
            ],
        },
        {
            title: "教程",
            children: [
                {
                    title: "服务注册",
                    children: [
                        "教程/服务注册/概述",
                        "教程/服务注册/使用控制台",
                        "教程/服务注册/使用REST接口",
                        "教程/服务注册/使用SDK",
                        "教程/服务注册/使用k8s服务同步"
                    ],
                },
                {
                    title: "服务发现",
                    children: [
                        "教程/服务发现/概述",
                        "教程/服务发现/使用REST接口",
                        "教程/服务发现/使用SDK"
                    ],
                },
                {
                    title: "动态路由",
                    children: [
                        "教程/动态路由/规则路由",
                        "教程/动态路由/就近路由"
                    ],
                },
                {
                    title: "熔断降级",
                    children: [
                        "教程/熔断降级/故障熔断"
                    ],
                },
                {
                    title: "访问限流",
                    children: [
                        "教程/访问限流/单机限流"
                    ],
                },
                {
                    title: "服务网格",
                    children: [
                        "教程/服务网格/概念及原理",
                    ],
                },
                {
                    title: "配置中心",
                    children: [
                        "教程/配置中心/使用控制台",
                        "教程/配置中心/使用JavaSDK"
                    ],
                },
                {
                    title: "鉴权控制",
                    children: [
                        "教程/鉴权控制/概述",
                        "教程/鉴权控制/使用控制台",
                        "教程/鉴权控制/使用SDK",
                    ],
                },
                {
                    title: "存量兼容",
                    children: [
                        "教程/存量兼容/兼容eureka客户端",
                    ],
                },
            ],
        },
		{
			 title: "参考",
			 children: [
				{
					title: "接口文档",
					children: [
						"参考/接口文档/命名空间管理",
						"参考/接口文档/服务管理",
						"参考/接口文档/服务别名管理",
						"参考/接口文档/实例管理",
						"参考/接口文档/路由规则管理",
						"参考/接口文档/限流规则管理",
						"参考/接口文档/服务发现",
						"参考/接口文档/配置管理",
						"参考/接口文档/鉴权管理",
					],
				},
			]
		},
    {
         title: "社区",
         children: [
              "社区/如何加入",
              "社区/如何获取学习资料",
              {
                  title: "路线规划",
                  children: [
                     "社区/路线规划/2021路线图",
                     "社区/路线规划/2022路线图"
                  ],
               },
           ],
       },
    ],
    "/zh/news/": [{
        collapsable: false,
        sidebarDepth: 0,
        children: [
            ["", "版本更新"], "new1", "new2", "new3"
        ],
    }, ],
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
    "/en/news/": [{
        collapsable: false,
        sidebarDepth: 0,
        children: [
            ["", "Updated Version"], "new1", "new2", "new3"
        ],
    }, ],
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
                integrity: "sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm",
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