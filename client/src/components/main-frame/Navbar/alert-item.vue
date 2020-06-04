<template>
  <div
    class="alert-item"
    :style="alertBgc"
    @mouseover="hoverBgc"
    @mouseleave="defaultBgc(read_status)"
  >
    <div class="alert-avatar">
      <img class="user-avatar" :src="editorAvatar" />
    </div>
    <div class="msg" @click.stop="getLog">
      <span>{{ msg }}</span>&nbsp;
      <span v-if="count > 0" class="count">({{ count }})</span>
      <br />
      <span class="alert-time">{{ editTime }}</span>
    </div>

    <!-- @edu to float the tips over content -->
    <section class="tips-wrapper">
      <div class="alert-tips">
        <span :style="[tipsBaseStyle,tipsDynStyle]">{{ tip }}</span>
      </div>
    </section>

    <div class="alert-status" @click="updateReadStatus">
      <div
        :style="[statusBaseStyle,statusDynStyle]"
        @mouseover="showTips(true)"
        @mouseleave="showTips(false)"
      ></div>
    </div>
  </div>
</template>
<script>
import { getAvatar, getTimeGapInfo } from "@/utils/utils";
export default {
  name: "AlertItem",
  props: {
    read_status: Boolean,
    project_code: String,
    notification: Object,
    // the latest modification log
    alertItem: Object
  },

  /*
   * @edu computed dependent on a value return the computed data, method can't operate this ... because computed item is a function
   * @edu watch can operate data
   */
  computed: {
    count: function() {
      return this.read_status ? 0 : this.notification.alerts.length;
    },
    editorAvatar: function() {
      return getAvatar(
        this.alertItem.operator_id ? this.alertItem.operator_id.email : ""
      );
    },
    editTime: function() {
      return getTimeGapInfo(this.alertItem.action_time);
    },
    msg: function() {
      const { operator_name, operator_id, action_type } = this.alertItem;

      const operator = operator_id ? operator_id.name : operator_name;
      return `${operator[0].toUpperCase() +
        operator.slice(1)} ${action_type.toLowerCase() + "d"} ${
        this.project_code
      }`;
    },
    tip: function() {
      return this.read_status ? "Mark as unread" : "Mark as read";
    }
  },
  watch: {
    read_status: function(val) {
      this.defaultBgc(val);
      this.getStatusStyle(val);
    }
  },
  created: function() {
    this.defaultBgc(this.read_status);
    this.getStatusStyle(this.read_status);
  },
  data: function() {
    return {
      statusBaseStyle: {
        height: "12px",
        width: "12px",
        "border-radius": "50%"
      },
      statusDynStyle: {},
      tipsBaseStyle: {
        width: "112px",
        height: "20px",
        padding: "0px 3px",
        display: "inline-block",
        "text-align": "center",
        color: "white",
        "border-radius": "4px",
        "background-color": "black",
      },
      tipsDynStyle: {
        visibility: "hidden"
      },
      alertBgc: {}
    };
  },
  methods: {
    updateReadStatus() {
      this.$emit("update:read_status", !this.read_status);

      //update read status
      const ids = this.notification.alerts.map(x => {
        return x.receiver_id;
      });
      this.$axios
        .put(
          `api/notification/updateAllByIds?read_status=${!this.read_status}`,
          ids
        )
        .then(() => {
          this.$emit("refresh");
        });
    },
    hoverBgc() {
      this.alertBgc = {
        "background-color": this.read_status ? "#F6F6F6" : "#E4E9F0"
      };
    },
    defaultBgc(val) {
      this.alertBgc = {
        "background-color": val ? "#FFFFFF" : "#EDF2FA"
      };
    },
    getStatusStyle(val) {
      this.statusDynStyle = val
        ? {
            border: "1px solid #DDDFE6"
          }
        : {
            border: "4px solid #409FFF"
          };
    },
    showTips(val) {
      if (val) {
        this.tipsDynStyle = {
          visibility: ""
        };
      } else {
        this.tipsDynStyle = {
          visibility: "hidden"
        };
      }
    },
    getLog() {
      const ids = this.notification.alerts.map(x => x.log_id);
      this.$emit("getLog", ids);
      if (!this.read_status) {
        this.updateReadStatus();
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.alert-item {
  cursor: pointer;
  height: 50px;
  display: flex;
  padding: 1px 12px 1px 5px;
  > div {
    margin: 5px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
  .alert-avatar,
  .alert-tips,
  .alert-status {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .msg {
    flex: 1 1 auto;
    overflow: auto;
    .count {
      font-weight: bold;
    }
    .alert-time {
      font-size: 0.9em;
      color: #8893a4;
    }
  }
}

.tips-wrapper{
  position: relative;
  .alert-tips{
    position: absolute;
    top:12.5px;
    left:-112px
  }
}
</style>