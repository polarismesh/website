<template>
  <div class="sidebar-wrapper">
    <div class>
      <SearchBox aria-placeholder="请输入关键词" />
    </div>
    <aside class="sidebar">
      <NavLinks />

      <slot name="top" />

      <SidebarLinks :depth="0" :items="items" />
      <slot name="bottom" />
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
};
</script>

<style lang="stylus">
.sidebar-wrapper {
  .search-box {
    width: 100%;

    input {
      width: 100%;
      border-radius: 0;
    }
  }
  position: sticky;
  top: 70px;
  margin: 70px 0px;
}

.sidebar {
  ul {
    padding: 0;
    margin: 0;
    list-style-type: none;
  }

  a {
    display: inline-block;
  }

  .nav-links {
    display: none;
    border-bottom: 1px solid $borderColor;
    padding: 0.5rem 0 0.75rem 0;

    a {
      font-weight: 600;
    }

    .nav-item, .repo-link {
      display: block;
      line-height: 1.25rem;
      font-size: 1.1em;
      padding: 0.5rem 0 0.5rem 1.5rem;
    }
  }

  & > .sidebar-links {
    padding: 10px 0;

    & > li > a.sidebar-link {
      font-size: 1.1em;
      line-height: 1.7;
      font-weight: bold;
    }

    & > li:not(:first-child) {
      margin-top: 0.75rem;
    }
  }
}

@media (max-width: $MQMobile) {
  .sidebar {
    .nav-links {
      display: block;

      .dropdown-wrapper .nav-dropdown .dropdown-item a.router-link-active::after {
        top: calc(1rem - 2px);
      }
    }

    & > .sidebar-links {
      padding: 1rem 0;
    }
  }
}
</style>
