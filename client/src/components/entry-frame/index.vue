<template>
  <div class="entry">
    <p class="header">KS-System</p>
    <slot></slot>
    <p class="footer">- Power By Sam</p>
  </div>
</template>

<style lang="scss" scoped>
.entry {
  width: 480px;
  padding: 100px 20px 0;
  margin: 0 auto;

  .header {
    font-size: 32px;
    text-align: center;
  }

  .footer {
    font-size: 22px;
    margin-top: 100px;
    text-align: center;
    margin-right: -140px;
  }

  p {
    color: #5e6d82;
  }
}
</style>

<script>
export default {
  name: "EntryFrame"
};
</script>