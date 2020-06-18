<template>
  <el-radio-group :fill="fillColor" v-model="approval" size="mini">
    <el-radio-button class="todo" label="TODO"></el-radio-button>
    <el-radio-button class="ng" label="NG"></el-radio-button>
    <el-radio-button class="ok" label="OK"></el-radio-button>
  </el-radio-group>
</template>
<script>
export default {
  name: "Approval",
  props: ["value"],
  computed: {
    fillColor: function() {
      switch (this.approval) {
        case "TODO":
          return "#409EFF";
        case "NG":
          return "#F56C6C";
        case "OK":
          return "#67C23A";
        default:
          return "#409EFF";
      }
    }
  },
  mounted() {
    // avoid data missing
    if (!this.value) {
      this.approval = "TODO";
    }
  },
  data() {
    return {
      approval: this.value
    };
  },
  watch: {
    approval: function(val) {
      this.$emit("input", val);
    },
    value: function(val) {
      this.approval = val
    }
  }
};
</script>