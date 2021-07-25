<template>
  <div>
    <div class="news-container">
      <b-row>
        <b-col cols="12" align-self="center">
          <Page :sidebar-items="sidebarItems"></Page>
        </b-col>
      </b-row>
    </div>
  </div>
</template>
<script>
import Page from "@theme/components/NewsPage.vue";
import NewsSidebar from "@theme/components/NewsSidebar.vue";
import HomeSkeleton from "@theme/components/HomeSkeleton.vue";

import { resolveSidebarItems } from "../util";

export default {
  name: "NewsMainLayout",

  components: {
    Page,
    NewsSidebar,
    HomeSkeleton,
  },

  data() {
    return {
      isSidebarOpen: false,
      carouselSlide: 0,
      sliding: null,
    };
  },

  computed: {
    shouldShowNavbar() {
      const { themeConfig } = this.$site;
      const { frontmatter } = this.$page;
      if (frontmatter.navbar === false || themeConfig.navbar === false) {
        return false;
      }
      return (
        this.$title ||
        themeConfig.logo ||
        themeConfig.repo ||
        themeConfig.nav ||
        this.$themeLocaleConfig.nav
      );
    },

    shouldShowSidebar() {
      const { frontmatter } = this.$page;
      return (
        !frontmatter.home &&
        frontmatter.sidebar !== false &&
        this.sidebarItems.length
      );
    },

    sidebarItems() {
      return resolveSidebarItems(
        this.$page,
        this.$page.regularPath,
        this.$site,
        this.$localePath
      );
    },

    pageClasses() {
      const userPageClass = this.$page.frontmatter.pageClass;
      return [
        {
          "no-navbar": !this.shouldShowNavbar,
          "sidebar-open": this.isSidebarOpen,
          "no-sidebar": !this.shouldShowSidebar,
        },
        userPageClass,
      ];
    },
  },

  mounted() {
    this.$router.afterEach(() => {
      this.isSidebarOpen = false;
    });
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
      this.$emit("toggle-sidebar", this.isSidebarOpen);
    },
    onSlideStart(slide) {
      this.sliding = true;
    },
    onSlideEnd(slide) {
      this.sliding = false;
    },
  },
};
</script>
<style>
.news-topic {
  width: 100%;
}

.news-container {
  margin-top: 40px;
}

.news-topic-decoration-a,
.news-topic-decoration-b {
  width: 15px;
  height: 15px;
  transform: rotate(-45deg);
  border-radius: 2px;
  display: inline-block;
}

.news-topic-decoration-a {
  background-color: #014fdb;
}

.news-topic-decoration-b {
  background-color: rgba(150, 197, 255, 0.5);
  margin-left: -10px;
}
.news-topic-text {
  margin-left: 6px;
}
@media screen and (max-width: 1000px) {
  .news-topic-decoration-a {
    display: none;
  }

  .news-topic-decoration-b {
    display: none;
  }
  .news-topic-text {
    display: block;
    font-size: 36px;
    width: 100%;
    padding-left: 1.5rem;
    font-weight: 600;
  }
}
</style>
