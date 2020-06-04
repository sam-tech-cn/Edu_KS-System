<template>
  <el-menu-item :index="path">
    <template v-if="item.meta">
      <i :class="item.meta.icon"></i>
      <span slot="title">{{item.meta.title }}</span>
    </template>
  </el-menu-item>
</template>
<script>
export default {
  name: "MenuItem",
  props: {
    item: {
      type: Object,
      required: true
    },
    path: {
      type: String,
      required: true
    }
  }
};
</script>