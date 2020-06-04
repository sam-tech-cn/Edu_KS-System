<template>
  <div class="progress">
    <el-progress :text-inside="true" :stroke-width="15" :percentage="per()" :status="status"></el-progress>
    <span @click="increase" class="icon-plus">
      <i class="el-icon-plus"></i>
    </span>
    <span @click="decrease" class="icon-minus">
      <i class="el-icon-minus"></i>
    </span>
    <el-input class="hidden-input" type="number" :min="0" :max="100" v-model="percentage"></el-input>
  </div>
</template>
<script>
export default {
  name: "Progress",
  props: ["value"],
  computed: {
    status: function() {
      if (this.percentage <= 30) {
        return null;
      } else if (this.percentage <= 99) {
        return "warning";
      } else {
        return "success";
      }
    }
  },
  methods: {
    decrease() {
      this.percentage -= 10;
      if (this.percentage < 0) {
        this.percentage = 0;
      }

      if (this.percentage % 10 !== 0) {
        this.percentage = Math.round(this.percentage / 10) * 10;
      }
    },
    increase() {
      this.percentage += 10;
      if (this.percentage > 100) {
        this.percentage = 100;
      }

      if (this.percentage % 10 !== 0) {
        this.percentage = Math.round(this.percentage / 10) * 10;
      }
    },
    per() {
      if (this.value <= 100 && this.value >= 0) {
        return this.percentage;
      }

      // @edu avoid init data out of range
      if (this.value > 100) {
        // then trigger two ways binding
        this.percentage = 100;
      } else if (this.value < 0) {
        this.percentage = 0;
      }
    }
  },
  data() {
    return {
      percentage: this.value
    };
  },
  watch: {
    percentage: function(val) {
      this.$emit("input", val);
    },

    // if value updated the v-model will follow the data
    value: function(val) {
      this.percentage = val;
    }
  }
};
</script>
<style lang="scss" scoped>
.progress {
  display: flex;
  align-items: center;
  .el-progress {
    flex: 1;
    margin-right: 5px;
  }
  span {
    cursor: pointer;
    height: 20px;
    width: 20px;
    border: 1px solid #dcdfe6;
    padding: 2px;
    margin: 0px;
  }
  span:hover {
    background-color: #edf5ff;
    border: 1px solid #c6e2ff;
    i {
      color: #409fff;
    }
  }
  .icon-plus:hover {
    + span {
      border-left: 1px solid #c6e2ff;
    }
  }
  span:active {
    border: 1px solid #409fff;
  }
  .icon-plus:active {
    + span {
      border-left: 1px solid #409fff;
    }
  }
  i {
    color: #616266;
    font-size: 14px;
  }
  .icon-minus {
    margin-left: -1px;
    border-radius: 0px 4px 4px 0px;
  }
  .icon-plus {
    border-radius: 4px 0px 0px 4px;
  }
  .hidden-input {
    width: 0px;
    height: 0px;
    visibility: hidden;
  }
}
</style>