<template>
  <div class="drawer-prj">
    <el-drawer :visible.sync="drawer.show" size="28%" :with-header="false" @close="clearForm">
      <div class="header">
        <img
          @click.prevent="onSubmit"
          src="@/assets/save.svg"
          class="icon-header save"
          v-if="!drawer.readOnly"
        />
        <img @click="handleClose" src="@/assets/close.svg" class="icon-header close" />
      </div>
      <div class="tabs">
        <el-tabs v-model="drawer.activeName">
          <el-tab-pane
            label="Details"
            name="details"
            v-if="drawer.displayType == 'project' || drawer.displayType == 'all'"
          >
            <div class="details-content">
              <el-form ref="form" :model="form" :rules="formRules">
                <div class="assignee">
                  <p>ASSIGNEE</p>
                  <el-select v-model="form.assignee" filterable>
                    <el-option
                      v-for="item in users"
                      :key="item._id"
                      :label="item.name"
                      :value="item._id"
                    ></el-option>
                  </el-select>
                </div>

                <div class="project-code">
                  <el-form-item prop="project_code">
                    <p>CODE</p>
                    <el-input v-model="fmtcode"></el-input>
                  </el-form-item>
                </div>

                <div class="design project-card">
                  <p>DESIGN</p>
                  <span>Process</span>
                  <cus-progress v-model="form.design_perc"></cus-progress>
                  <div class="date">
                    <div class="start">
                      <span>Start Date</span>
                      <el-date-picker
                        class="cal"
                        v-model="form.design_start"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="Pick a day"
                      ></el-date-picker>
                    </div>
                    <div class="end">
                      <span>End Date</span>
                      <el-date-picker
                        class="cal"
                        v-model="form.design_end"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="Pick a day"
                      ></el-date-picker>
                    </div>
                  </div>
                  <span>Approval</span>
                  <approval v-model="form.design_approval"></approval>
                </div>

                <div class="coding project-card">
                  <p>CODING</p>
                  <span>Process</span>
                  <cus-progress v-model="form.coding_perc"></cus-progress>
                  <div class="date">
                    <div class="start">
                      <span>Start Date</span>
                      <el-date-picker
                        class="cal"
                        v-model="form.coding_start"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="Pick a day"
                      ></el-date-picker>
                    </div>
                    <div class="end">
                      <span>End Date</span>
                      <el-date-picker
                        class="cal"
                        v-model="form.coding_end"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="Pick a day"
                      ></el-date-picker>
                    </div>
                  </div>
                  <span>Approval</span>
                  <approval v-model="form.coding_approval"></approval>
                </div>

                <div class="testing project-card">
                  <p>TESTING</p>
                  <span>Process</span>
                  <cus-progress v-model="form.testing_perc"></cus-progress>
                  <div class="date">
                    <div class="start">
                      <span>Start Date</span>
                      <el-date-picker
                        class="cal"
                        v-model="form.testing_start"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="Pick a day"
                      ></el-date-picker>
                    </div>
                    <div class="end">
                      <span>End Date</span>
                      <el-date-picker
                        class="cal"
                        v-model="form.testing_end"
                        value-format="yyyy-MM-dd"
                        type="date"
                        placeholder="Pick a day"
                      ></el-date-picker>
                    </div>
                  </div>
                  <span>Approval</span>
                  <approval v-model="form.testing_approval"></approval>
                </div>

                <div class="release project-card">
                  <p>RELEASE</p>
                  <span>Release</span>
                  <el-date-picker
                    class="release-cal"
                    v-model="form.release"
                    value-format="yyyy-MM-dd"
                    type="date"
                    placeholder="Pick a day"
                  ></el-date-picker>
                </div>
              </el-form>
            </div>
          </el-tab-pane>
          <el-tab-pane
            label="Logs"
            name="logs"
            class="logs"
            v-if="drawer.displayType == 'alert'|| drawer.displayType == 'all'"
          >
            <div class="logs-sort">
              <el-radio-group v-model="reverse">
                <el-radio :label="false">descending</el-radio>
                <el-radio :label="true">ascending</el-radio>
              </el-radio-group>
            </div>
            <div class="logs-content">
              <el-timeline :reverse="reverse">
                <el-timeline-item
                  v-for="(log, index) in drawer.logs"
                  :key="index"
                  :timestamp="fmtTime1(log)"
                  placement="top"
                >
                  <el-card>
                    <!-- we only show 'update log' content -->
                    <div class="detail" v-if="hasRecord(log)">
                      <el-row v-for="(item, index) in genRecordTable(log.record)" :key="index">
                        <el-col :span="9">
                          <span>{{ item.name }}</span>
                        </el-col>
                        <el-col :span="6">
                          <span>{{ item.old }}</span>
                        </el-col>
                        <el-col :span="3">
                          <span>>></span>
                        </el-col>
                        <el-col :span="6">
                          <span>{{ item.new }}</span>
                        </el-col>
                      </el-row>
                    </div>
                    <div class="time">
                      <p>{{ fmtTime2(log) }}</p>
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </el-drawer>
  </div>
</template>
<script>
import { getFmtVal } from "@/utils/utils";
import CusProgress from "@/components/customize/progress";
import Approval from "@/components/customize/approval";

export default {
  name: "DrawerProject",
  components: { CusProgress, Approval },
  props: {
    //{show: boolean,model:'alert' or 'project',activeName:'logs' or 'details', logs:[], readOnly: boolean}
    drawer: {
      type: Object,
      default: function() {
        return { show: false };
      }
    },
    form: Object
  },
  computed: {
    // @edu to limit upcase only
    fmtcode: {
      get: function() {
        return this.form.project_code
          ? this.form.project_code.toUpperCase()
          : this.form.project_code;
      },
      set: function(val) {
        this.form.project_code = val.toUpperCase();
      }
    },
    initData() {
      return this.drawer;
    }
  },
  data: function() {
    return {
      reverse: false,
      users: [],
      formRules: {
        project_code: [
          {
            required: true,
            message: "Please input project code",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "Length should be 5 to 20",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.getUsers();
  },
  methods: {
    onSubmit: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.drawer.model == "add") {
            this.$axios.post("api/project", this.form).then(() => {
              this.$message.success("Record saved successfully");
              this.drawer.show = false;
              this.$emit("refresh");
            });
          } else if (this.drawer.model == "edit") {
            this.$axios
              .put(`api/project/${this.form["_id"]}`, this.form)
              .then(() => {
                this.$message.success("Record updated successfully");
                this.drawer.show = false;
                this.$emit("refresh");
              });
          }
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    },
    clearForm: function() {
      // when closing from alert no need to clear validate, because no detail tab
      if (this.drawer.displayType !== "alert") {
        this.$refs["form"].clearValidate();
      }
    },
    getUsers: function() {
      this.$axios.get("api/user").then(res => {
        this.users = res.data;
      });
    },
    handleClose: function() {
      this.drawer.show = false;
    },
    // the time pattern <yyyy-mm-dd> in the timeline
    fmtTime1: function(val) {
      const { action_time } = val;
      const time = new Date(action_time);
      return getFmtVal(time);
    },
    // tips with pattern <operator project-code yyyy/mm/dd hh:mm> in the card
    fmtTime2: function(val) {
      const {
        operator_name,
        operator_id,
        action_type,
        action_time,
        project_code
      } = val;

      const operator = operator_id ? operator_id.name : operator_name;

      const time = new Date(action_time);

      const ymd = getFmtVal(time, "/");

      const fmtTime = `${project_code} ${ymd} ${time
        .getHours()
        .toString()
        .padStart(2, "0")}:${time
        .getMinutes()
        .toString()
        .padStart(2, "0")}`;

      if (operator) {
        return `${operator[0].toUpperCase() +
          operator.slice(1)} ${action_type.toLowerCase() + "d"} ${fmtTime}`;
      } else {
        return `<undefined> ${action_type.toLowerCase() + "d"} ${fmtTime}`;
      }
    },

    // can't use async fucntion redener data to dom
    genRecordTable: function(val) {
      const records = val.split(",").map(x => {
        const record = {};
        const strArr = x.split("|");
        record.name = strArr[0];
        record.old = getFmtVal(strArr[1]);
        record.new = getFmtVal(strArr[2]);

        if (record.name === "Assignee") {
          if (record.old !== "undefined") {
            record.old = this.users.find(e => e._id === record.old)
              ? this.users.find(e => e._id === record.old).name
              : "";
          }

          if (record.new !== "undefined") {
            record.new = this.users.find(e => e._id === record.new)
              ? this.users.find(e => e._id === record.new).name
              : "";
          }
        }

        if (record.old === "undefined") {
          record.old = "";
        }

        if (record.new === "undefined") {
          record.new = "";
        }

        return record;
      });

      return records;
    },
    hasRecord: function(log) {
      // only show update log
      if (log.record !== "" && log.action_type === "UPDATE") {
        return true;
      } else {
        return false;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.drawer-prj {
  margin: 0px;
}
.header {
  display: flex;
  justify-content: flex-end;
  .icon-header {
    width: 15px;
    height: 15px;
    cursor: pointer;
    margin-left: 10px;
  }
}
.logs-sort {
  margin-top: 10px;
}
.logs-content {
  margin-top: 25px;
  padding: 2px;
  height: calc(100vh - 150px);
  overflow: auto;
  .detail {
    .el-row {
      margin-bottom: 10px;
    }
  }
  .time {
    overflow: auto;
  }
}

.details-content {
  height: calc(100vh - 100px);
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 2px 0px;
}

.el-form {
  > div {
    margin-bottom: 20px;
  }
  > div:last-child {
    margin-bottom: 0px;
  }
  p {
    font-size: 14px;
  }
  span {
    font-size: 12px;
  }
  .assignee {
    p {
      margin-bottom: 5px;
    }
    .el-select {
      width: 100%;
    }
    margin-bottom: 5px;
  }
  .project-code {
    p {
      margin-bottom: 5px;
    }
    .el-input {
      width: 100%;
    }
    margin-bottom: 0px;
  }

  .project-card {
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 5px #e3e4e6;
    padding: 10px;
    > * {
      margin-bottom: 5px;
    }

    > *:last-child {
      margin-bottom: 0px;
    }
    .date {
      display: flex;
      .cal {
        width: 150px !important;
        margin-top: 5px;
      }
      > div {
        > * {
          display: block;
        }
      }
      .end {
        margin-left: auto;
      }
    }

    .release-cal {
      width: 100%;
    }
  }
}
</style>
<style lang="scss">
.el-drawer {
  padding: 15px;
}

.el-tabs *:focus {
  /* avoid default outline */
  outline: none !important;
  box-shadow: none !important;
}

// the original frame has padding 20px
.el-card {
  > div {
    padding: 15px;
  }
  overflow-x: scroll !important;
  p {
    color: #868686;
  }
}
</style>
