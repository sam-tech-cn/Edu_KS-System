<template>
  <div class="nav-bar">
    <div class="toggle">
      <i
        :class="(sidebarStatus?'el-icon-s-unfold':'el-icon-s-fold')+' icon-nav'"
        @click="toggleSidebar"
      ></i>
    </div>
    <div class="alert">
      <!-- combined a popover use trgger manual + v-model + click toggle avoid fade out automatically-->
      <el-popover placement="bottom" width="430" trigger="manual" v-model="visible">
        <div class="pop-wrapper">
          <div class="alert-header">
            <div>
              <span>Notifications</span>&nbsp;
              <span v-if="count>0" class="alert-count">{{ count }}</span>
            </div>
            <span class="handle-alert read" @click="updateAll('read')">Mark all as read</span>
            <span class="handle-alert" @click="updateAll('delete')">Clear all</span>
          </div>

          <div class="alert-container">
            <!-- aliert items we grouped by project code here and only show the lastest modification -->
            <div v-if="notifications.length>0">
              <alert-item
                @refresh="refresh"
                @getLog="getLog"
                v-for="notification in notifications"
                :key="notification.project_code"
                :read_status.sync="notification.read_status"
                :project_code="notification.project_code"
                :notification="notification"
                :alertItem="notification.alerts[0]"
              ></alert-item>
            </div>
            <div v-else>
              <div class="nodata">No Notifications</div>
            </div>
          </div>
          <div class="alert-footer" v-if="notifications.length>0">
            <span @click="seeAll" class="handle-alert">See all</span>
          </div>
        </div>

        <el-badge slot="reference" is-dot :hidden="count <= 0" class="item">
          <i @click="visible = !visible" class="el-icon-message-solid icon-nav"></i>
        </el-badge>
      </el-popover>
    </div>
    <div class="avatar">
      <el-dropdown class="avatar-container" trigger="click" @click.native="visible = false">
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
          <i class="el-icon-caret-bottom"></i>
        </div>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item @click.native="changeUserInfo">{{ userTitle }}</el-dropdown-item>
          <el-dropdown-item @click.native="changePass">{{ changePassTitle }}</el-dropdown-item>
          <el-dropdown-item divided @click.native="logout">Log Out</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <section>
      <dialog-user-info :dialog="userInfoDialog" :form="userInfoForm"></dialog-user-info>
      <dialog-pass :dialog="passDialog" :form="passForm"></dialog-pass>
      <drawer-project  :drawer="drawer"></drawer-project>
    </section>
  </div>
</template>
<script>
import { LOG_OUT, TOGGLE_SIDEBSR } from "@/store/action-types";
import { mapGetters } from "vuex";
import DialogUserInfo from "./dialog-user-info";
import DialogPass from "./dialog-pass";
import AlertItem from "./alert-item";
import DrawerProject from "@/components/drawer-project";

export default {
  name: "Navbar",
  components: { DialogUserInfo, DialogPass, AlertItem, DrawerProject },
  computed: {
    ...mapGetters(["avatar", "sidebarStatus", "user"])
  },
  created: function() {
    this.getNotification();
  },
  data: function() {
    return {
      notifications: [],
      count: 0,
      userInfoDialog: {
        title: "",
        show: false
      },
      passDialog: {
        title: "",
        show: false
      },
      userTitle: "User Profile",
      changePassTitle: "Change Password",
      // @edu can't use created data
      userInfoForm: {},
      passForm: {},
      // toggle popover of notification
      visible: false,
      drawer: {}
    };
  },
  methods: {
    toggleSidebar: function() {
      this.$store.dispatch(TOGGLE_SIDEBSR, !this.sidebarStatus);
    },
    getNotification: function() {
      let count = 0;
      this.$axios.get("api/notification").then(res => {
        const rawData = res.data;
        const notifications = [];
        if (rawData.length > 0) {
          /**
           * format raw data (constructure refer to the API doc )
           * 1. group by project code (Prioritize use it from project object, otherwise use backup data)
           * 2. sort each group data by action_time descending
           * 3. format to [{project_code:'',alerts:[]}] also sort by each item's latest action_time
           * properties refer the API doc
           */
          const groupObj = rawData.reduce((rv, x) => {
            const key = x.project_id
              ? x.project_id.project_code
              : x.project_code;

            if (!rv[key]) {
              rv[key] = [];
              rv[key].push(x);
            } else {
              let insert = false;
              for (let i = 0; i < rv[key].length; i++) {
                if (x.action_time >= rv[key].action_time) {
                  rv[key].splice(i, 0, x);
                  insert = true;
                  break;
                }
              }
              if (!insert) {
                rv[key].push(x);
              }
            }
            return rv;
          }, {});
          Object.keys(groupObj).forEach(k => {
            const itemReadStatus = groupObj[k][0].read_status;
            const item = {
              project_code: k,
              alerts: groupObj[k],
              read_status: itemReadStatus
            };
            if (!itemReadStatus) {
              count = count + groupObj[k].length;
            }
            if (notifications.length == 0) {
              notifications.push(item);
            } else {
              let insert = false;
              for (let i = 0; i < notifications.length; i++) {
                if (
                  new Date(groupObj[k][0].action_time) >=
                  new Date(notifications[i]["alerts"].action_time)
                ) {
                  notifications.splice(i, 0, item);
                  insert = true;
                  break;
                }
              }
              if (!insert) {
                notifications.push(item);
              }
            }
          });
        }
        this.count = count;
        this.notifications = notifications;
      });
    },
    logout: function() {
      this.$store.dispatch(LOG_OUT);
      this.$router.push("/login");
    },
    changeUserInfo: function() {
      //@edu assign a new object
      this.userInfoForm = Object.assign({}, this.user);
      this.userInfoDialog.title = this.userTitle;
      this.userInfoDialog.show = true;
    },
    changePass: function() {
      this.passForm = {
        _id: this.user["_id"],
        currentPass: "",
        newPass: "",
        confirmPass: ""
      };
      this.passDialog.title = this.changePassTitle;
      this.passDialog.show = true;
    },
    refresh: function() {
      this.getNotification();
    },
    updateAll: function(val) {
      if (this.notifications.length > 0) {
        let url = "";

        if (val == "read") {
          url = "api/notification/updateAll?read_status=true";
        } else {
          url = "api/notification/updateAll?delete_status=true";
        }

        this.$axios.put(url).then(() => {
          this.getNotification();
        });
      }
    },
    getLog: function(ids) {
      if (ids.length > 0) {
        this.$axios.post(`api/log/findByIds`, ids).then(res => {
          this.drawer = {
            show: true,
            displayType: "alert",
            activeName: "logs",
            logs: res.data,
            readOnly: true
          };
        });
      }
    },
    seeAll: function() {
      if (this.count > 0) {
        this.updateAll("read");
      }
      const ids = this.notifications.flatMap(x => x.alerts.map(x => x.log_id));
      if (ids.length > 0) {
        this.$axios.post(`api/log/findByIds`, ids).then(res => {
          this.drawer = {
            show: true,
            displayType: "alert",
            activeName: "logs",
            logs: res.data,
            readOnly: true
          };
        });
      }
    }
  }
};
</script>

<style lang="scss" scoped>
$box-shadow: #e3e4e6;
.nav-bar {
  box-shadow: 0px 0px 12px $box-shadow;
  height: 45px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  > div {
    margin: 5px;
    cursor: pointer;
  }
  .alert {
    margin-left: auto;
  }
  .icon-nav {
    font-size: 25px;
  }
}
.el-dropdown {
  display: flex;
  .avatar-wrapper {
    display: flex;
    justify-content: flex-start;
    align-items: flex-end;
  }
}

.el-dropdown-menu {
  width: 170px;
}

.alert-header {
  // border: 1px solid tomato;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .alert-count {
    font-weight: bold;
  }
  .read {
    margin-left: auto;
    margin-right: 8px;
  }
}

.handle-alert {
  color: #385898;
}
.handle-alert:hover {
  cursor: pointer;
  text-decoration: underline;
}

.alert-container {
  position: absolute;
  left: 0;
  margin-top: 8px;
  height: 250px;
  width: 100%;
  overflow: auto;
  // border: 1px solid tomato;
}
.alert-footer {
  // border: 1px solid tomato;
  position: absolute;
  bottom: 10px;
  left: 0;
  width: 100%;
  display: flex;
  span {
    margin: 0 auto;
  }
}
.nodata {
  width: 100%;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #8893a4;
  font-size: 24px;
  font-weight: bold;
}
</style>

// @edu no scoped means global
<style lang="scss">
.el-popover {
  height: 330px;
}
</style>
