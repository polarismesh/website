<template>
  <b-navbar toggleable="lg" type="dark">
    <b-navbar-brand href="/">
      <img
        src="/vuepress-image/logo-polaris.png"
        class="d-inline-block align-top"
        alt="Polaris"
        style="height: 30px"
      />
    </b-navbar-brand>
    <b-navbar-toggle target="nav-collapse" class="navbar-toggle-btn"></b-navbar-toggle>

    <b-collapse id="nav-collapse" is-nav>
      <b-navbar-nav class="ml-auto">
        <b-nav-item href="/" class="navlink">首页</b-nav-item>
        <!-- <b-nav-item
          :to="`/${language}/news/`"
          :class="showLayoutType === 'news' ? 'navlink active' : 'navlink'"
          >新闻</b-nav-item
        >-->
        <b-nav-item
          :to="`/${language}/doc/简介/北极星是什么.html#简介`"
          :class="showLayoutType === 'doc' ? 'navlink active' : 'navlink'"
        >文档</b-nav-item>
        <b-nav-item href="https://github.com/PolarisMesh" target="_blank" class="navlink">Github</b-nav-item>
        <b-nav-item href="http://159.75.195.18/" target="_blank" class="navlink">体验版</b-nav-item>
      </b-navbar-nav>
    </b-collapse>
  </b-navbar>
</template>

<script>
import AlgoliaSearchBox from "@AlgoliaSearchBox";
import SearchBox from "@SearchBox";
import SidebarButton from "@theme/components/SidebarButton.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import { Component, Vue } from "vue-property-decorator";

export default {
  name: "Navbar",

  components: {
    SidebarButton,
    NavLinks,
    SearchBox,
    AlgoliaSearchBox,
  },

  data() {
    return {
      linksWrapMaxWidth: null,
      showLayoutType: "",
      language: "",
    };
  },
  watch: {
    $route(to, from) {
      this.showLayoutType =
        window.location.pathname.indexOf("/doc/") >= 0 ? "doc" : "news";
      this.language = window.localStorage.getItem("language") || "zh";
    },
  },
  mounted() {
    const MOBILE_DESKTOP_BREAKPOINT = 719; // refer to config.styl
    const NAVBAR_VERTICAL_PADDING =
      parseInt(css(this.$el, "paddingLeft")) +
      parseInt(css(this.$el, "paddingRight"));
    const handleLinksWrapWidth = () => {
      if (document.documentElement.clientWidth < MOBILE_DESKTOP_BREAKPOINT) {
        this.linksWrapMaxWidth = null;
      } else {
        this.linksWrapMaxWidth =
          this.$el.offsetWidth -
          NAVBAR_VERTICAL_PADDING -
          ((this.$refs.siteName && this.$refs.siteName.offsetWidth) || 0);
      }
    };
    handleLinksWrapWidth();
    window.addEventListener("resize", handleLinksWrapWidth, false);
    this.showLayoutType =
      window.location.pathname.indexOf("/doc/") >= 0 ? "doc" : "news";
    this.language = window.localStorage.getItem("language") || "zh";
  },
};

function css(el, property) {
  // NOTE: Known bug, will return 'auto' if style value is 'auto'
  const win = el.ownerDocument.defaultView;
  // null means not to return pseudo styles
  return win.getComputedStyle(el, null)[property];
}
</script>

<style lang="stylus">
.navlink {
  margin: 0px 1vw;
}

.navbar-nav {
  background-color: #030213;
}

.navbar-toggler:focus {
  box-shadow: none;
}

.navbar {
  height: 56px;
}

.router-link-active.nav-link {
  color: #0d6efd !important;
}
</style>
