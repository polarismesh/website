<template>
  <div
    class="theme-container"
    :class="pageClasses"
    @touchstart="onTouchStart"
    @touchend="onTouchEnd"
  >
    <div class="wrap-container navbar-skeleton">
      <Navbar v-if="shouldShowNavbar" @toggle-sidebar="toggleSidebar" />
    </div>
    <!-- <div class="news-back wrap-container"></div> -->
    <div class="wrap-container">
      <div style="margin: auto; z-index: 30">
        <DocMainLayout v-if="showLayoutType === 'doc'"></DocMainLayout>
        <NewsMainLayout v-else-if="showLayoutType === 'news'"></NewsMainLayout>
      </div>
    </div>
  </div>
</template>

<script>
import Home from "@theme/components/Home.vue";
import Navbar from "@theme/components/Navbar.vue";
import Sidebar from "@theme/components/Sidebar.vue";
import DocMainLayout from "@theme/components/DocMainLayout.vue";
import NewsMainLayout from "@theme/components/NewsMainLayout.vue";

import { resolveSidebarItems } from "../util";

export default {
  name: "Layout",

  components: {
    Home,
    Sidebar,
    Navbar,
    DocMainLayout,
    NewsMainLayout,
  },

  data() {
    return {
      isSidebarOpen: false,
      showLayoutType: "",
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
    this.showLayoutType =
      window.location.pathname.indexOf("/doc/") >= 0 ? "doc" : "news";
  },

  watch: {
    $route(to, from) {
      this.showLayoutType =
        window.location.pathname.indexOf("/doc/") >= 0 ? "doc" : "news";
    },
  },

  methods: {
    toggleSidebar(to) {
      this.isSidebarOpen = typeof to === "boolean" ? to : !this.isSidebarOpen;
      this.$emit("toggle-sidebar", this.isSidebarOpen);
    },

    // side swipe
    onTouchStart(e) {
      this.touchStart = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY,
      };
    },

    onTouchEnd(e) {
      const dx = e.changedTouches[0].clientX - this.touchStart.x;
      const dy = e.changedTouches[0].clientY - this.touchStart.y;
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
        if (dx > 0 && this.touchStart.x <= 80) {
          this.toggleSidebar(true);
        } else {
          this.toggleSidebar(false);
        }
      }
    },
  },
};
</script>
<style>
.navlink {
  margin: 0px 1vw;
}
.doc-img-text {
  font-size: 40px;
  color: #fff;
  height: 11.5vw;
}
.wrap-container {
  width: 100vw;
  padding: 0 15vw;
}
@media screen and (max-width: 1000px) {
  .wrap-container {
    padding: 0 2.5vw;
  }
}
</style>
