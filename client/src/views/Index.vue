<template>
  <div class="main-frame">
    <sidebar class="sidebar-container"/>
    <div class="main-container">
      <navbar />
      <app-main />
    </div>
  </div>
</template>
<script>
import { Navbar, Sidebar, AppMain } from "@/components/main-frame";
export default {
  name: "Index",
  components: {
    Navbar,
    Sidebar,
    AppMain
  }
};
</script>
<style  lang="scss" scoped>
    .main-frame {
        display: flex;
        .main-container {
          height: 100%;
          width: 100%;
          overflow: hidden;
        }
    }
</style>