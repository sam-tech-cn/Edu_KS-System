<template>
  <div class="sidebar">
    <el-menu
      :default-active="activeMenu"
      class="sidebar-menu"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#3F9EFF"
      :collapse="sidebarStatus"
      :collapse-transition="false"
      mode="vertical"
    >
      <sidebar-item
        v-for="route in routes"
        :key="route.path"
        :item="route"
        :base-path="route.path"
      />
    </el-menu>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
import SidebarItem from "./sidebar-item";
export default {
  name: "Sidebar",
  components: { SidebarItem },
  computed: {
    ...mapGetters(["sidebarStatus", "user"]),
    routes: function() {
      // @edu get routes data
      return this.$router.options.routes.filter(x => !x.hidden);
    },
    activeMenu: function() {
      // @edu return current route path
      return this.$route.path;
    }
  },
  data: function() {
    return {};
  },
  methods: {}
};
</script>
<style lang="scss" scoped>
.sidebar {
  height: 100vh;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 200px;
  max-height: 100vh;
}

.sidebar-menu {
  height: 100%;
  border: none;
  overflow: auto;
}

.el-submenu .el-menu-item {
  width: 200px;
}
</style>

<style lang=scss>
/* the original stuff not working well */
.el-menu--collapse {
  .el-submenu {
    & > .el-submenu__title {
      & > span {
        height: 0;
        width: 0;
        overflow: hidden;
        visibility: hidden;
        display: inline-block;
      }
      span + i {
         visibility: hidden;
      }
    }
  }
}
</style>