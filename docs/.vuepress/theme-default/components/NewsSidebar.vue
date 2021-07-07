<template>
  <div class="news-sidebar-wrapper">
    <aside class="sidebar">
      <NavLinks />

      <SidebarLinks :depth="0" :items="constraintItem" />
    </aside>
  </div>
</template>

<script>
import SidebarLinks from "@theme/components/SidebarLinks.vue";
import NavLinks from "@theme/components/NavLinks.vue";
import SearchBox from "@SearchBox";

export default {
  name: "Sidebar",

  components: { SidebarLinks, NavLinks, SearchBox },

  props: ["items"],

  computed: {
    constraintItem(){
      console.log(this.items)
      this.items[0].children =  this.items[0].children.slice(0,7)
      return this.items
    }
  }
};
</script>

<style lang="stylus">
.news-sidebar-wrapper {
  a.sidebar-link.active {
    font-weight: 400;
    color: #000;
    border-left-color: transparent;
  }

  .sidebar-link {
    margin: calc(((2.4vw - 21px) / 2)) 0;
    padding-top: 0px;
    padding-bottom: 0px;
  }
}
</style>
