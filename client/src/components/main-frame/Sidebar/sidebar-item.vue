<template>
  <div v-if="(item.privilege && user.admin) || !item.privilege">
    <el-submenu 
      v-if="item.children && item.children.length > 0 && item.singleNode == undefined"
      :index="resolvePath(item.path)"
    >
      <template v-if="item.meta" slot="title">
        <i :class="item.meta.icon"></i>
        <span>{{ item.meta.title }}</span>
      </template>

      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :base-path="resolvePath(child.path)"
        :item="child"
      />
    </el-submenu>
    <link-to v-else :path="extractPath(item)">
      <menu-item :path="extractPath(item)" :item="item"></menu-item>
    </link-to>
  </div>
</template>
<script>
import LinkTo from "./linkto";
import MenuItem from "./menu-item";
import path from "path";
import { specifiedPath } from "@/utils/utils";
import { mapGetters } from "vuex";
export default {
  name: "SidebarItem",
  components: { LinkTo, MenuItem },
  computed: {
    ...mapGetters(["sidebarStatus", "user"])
  },
  props: {
    basePath: {
      type: String,
      default: ""
    },
    item: {
      type: Object,
      required: true
    }
  },
  methods: {
    resolvePath: function(val) {
      if (specifiedPath(val)) {
        return val;
      } else if (specifiedPath(this.basePath)) {
        return this.basePath;
      } else {
        return path.resolve(this.basePath, val);
      }
    },
    extractPath: function(item) {
      if (item.singleNode) {
        return path.resolve(this.basePath, item.children[0].path);
      } else {
        return this.basePath;
      }
    }
  }
};
</script>