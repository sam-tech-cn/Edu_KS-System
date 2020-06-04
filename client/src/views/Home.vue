<template>
  <div class="index">
    <div class="avatar">
      <img :src="avatar" alt="none" />
    </div>
    <div class="user">{{ user.name }}</div>
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  computed: {
    ...mapGetters(["user", "avatar"])
  }
};
</script>
<style  lang="scss" scoped>
.index {
  display: flex;
  // height: 100%;
  justify-content: flex-start;
  align-items: center;
  * {
    margin: 0 5px;
  }
  img {
    width: 100px;
    height: 100px;
    border-radius: 50%;
  }
  .user {
    font-size: 2.5em;
  }
}
</style>