<template>
  <div class="notfound-container">
    <div class="notfound">
      <p class="title-404">404</p>
      <p>Oops! This Page Could Not Be Found</p>
      <div>
        <router-link to="/">
          <el-button type="primary" size="medium" round>Go To Homepage</el-button>
        </router-link>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Page404"
};
</script>
<style lang="scss" scoped>
.notfound-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;

  .notfound {
    position: fixed;
    top: 20%;

    // below operation same as above diplay: flex + justify-content: center;
    // left: 50%;
    // transform: translate(-50%, -50%);

    * {
      margin: 10px;
      width: auto;
      text-align: center;
    }
    .title-404 {
      font-size: 8em;
    }
    .el-button {
      width: auto;
    }
  }
}
</style>