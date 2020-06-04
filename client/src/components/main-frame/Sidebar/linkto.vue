<template>
  <div v-if="toBlank">
    <a :href="path" target="_blank">
      <slot />
    </a>
  </div>
  <div v-else>
    <router-link :to="path">
      <slot />
    </router-link>
  </div>
</template>
<script>
import { specifiedPath } from "@/utils/utils";
export default {
  name: "LinkTo",
  props: {
    path: {
      type: String,
      required: true
    }
  },
  computed: {
    toBlank: function() {
      return specifiedPath(this.path);
    }
  }
};
</script>
<style scoped>
a {
  text-decoration: none;
}
</style>