<template>
  <div class="project">
    <div class="project-header">
      <div class="project-title">
        <span>Project</span>
      </div>

      <div class="mark">
        <div class="mark-content">
          <span class="total-projects">{{ tableData.length }}&nbsp;</span>
          <span>TOTAL</span>
        </div>
      </div>

      <div class="dashbord design">
        <el-progress
          type="dashboard"
          :percentage="dashboard.design_perc"
          :color="customColorMethod(dashboard.design_perc)"
        ></el-progress>
        <span>DESIGN</span>
      </div>
      <div class="dashbord coding">
        <el-progress
          type="dashboard"
          :percentage="dashboard.coding_perc"
          :color="customColorMethod(dashboard.coding_perc)"
        ></el-progress>
        <span>CODING</span>
      </div>
      <div class="dashbord testing">
        <el-progress
          type="dashboard"
          :percentage="dashboard.testing_perc"
          :color="customColorMethod(dashboard.testing_perc)"
        ></el-progress>
        <span>TESTING</span>
      </div>
      <div class="dashbord release">
        <el-progress
          type="dashboard"
          :percentage="dashboard.release_perc"
          :color="customColorMethod(dashboard.release_perc)"
        ></el-progress>
        <span>RELEASE</span>
      </div>
    </div>
    <div class="project-operation">
      <el-button @click.native="addProject" size="mini">
        <i class="el-icon-plus"></i>
        <span>NEW PROJECT</span>
      </el-button>
      <el-button size="mini" @click.native="deleteProject">
        <i class="el-icon-minus"></i>
        <span>DELETE</span>
      </el-button>
      <el-input class="search" size="mini" placeholder="Type to search" v-model="search">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <i class="el-icon-refresh-right reset-icon"></i>
    </div>
    <div class="project-content">
      <el-table
        :data="tableData.filter(data => !search || data.project_code.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;"
        :max-height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>

        <el-table-column fixed="left" prop="project_code" label="ProjectCode" width="120"></el-table-column>
        <el-table-column prop="assignee.name" label="Assignee" width="120"></el-table-column>
        <el-table-column prop="design_start" label="DesignStartDate" width="130"></el-table-column>
        <el-table-column prop="design_end" label="DesignEndDate" width="130"></el-table-column>
        <el-table-column prop="design_perc" label="%" width="80"></el-table-column>
        <el-table-column prop="design_approval" label="DesignApproval" width="120"></el-table-column>
        <el-table-column prop="coding_start" label="CodingStartDate" width="130"></el-table-column>
        <el-table-column prop="coding_end" label="CodingEndDate" width="130"></el-table-column>
        <el-table-column prop="coding_perc" label="%" width="80"></el-table-column>
        <el-table-column prop="coding_approval" label="CodingApproval" width="120"></el-table-column>
        <el-table-column prop="testing_start" label="TestingStartDate" width="130"></el-table-column>
        <el-table-column prop="testing_end" label="TestingEndDate" width="130"></el-table-column>
        <el-table-column prop="testing_perc" label="%" width="80"></el-table-column>
        <el-table-column prop="testing_approval" label="TestingApproval" width="120"></el-table-column>
        <el-table-column prop="release" label="ReleaseDate" width="130"></el-table-column>
        <el-table-column align="center" fixed="right" label="Operations" width="90">
          <template slot-scope="scope">
            <div class="table-operation">
              <img
                @click="displayProject(scope.$index, scope.row)"
                src="@/assets/more.svg"
                class="icon-more"
              />
              <i
                class="el-icon-edit"
                style="cursor: pointer"
                @click.prevent="editProject(scope.$index, scope.row)"
              ></i>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <drawer-project :drawer="drawer" :form="projectForm" @refresh="getProjectList"></drawer-project>
  </div>
</template>
<script>
import { getFmtVal } from "@/utils/utils";
import DrawerProject from "@/components/drawer-project";

export default {
  name: "Project",
  components: { DrawerProject },
  data: function() {
    return {
      search: "",
      multipleSelection: [],
      tableHeight: 0,
      rawTableData: [],
      input: 0,
      approval: "NG",
      drawer: {},
      projectForm: {}
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 360;
    });
  },
  computed: {
    tableData: function() {
      //@edu deep clone the data, value need to be formatted here
      let data = JSON.parse(JSON.stringify(this.rawTableData));

      // format data
      Object.keys(data).forEach(key => {
        data[key] = getFmtVal(data[key]);
      });

      return data.map(x => {
        Object.keys(x).forEach(key => {
          x[key] = getFmtVal(x[key]);
        });
        return x;
      });
    },
    dashboard: function() {
      const tmp = {
        design_perc: 0,
        coding_perc: 0,
        testing_perc: 0,
        release_perc: 0
      };

      if (this.rawTableData.length <= 0) {
        return tmp;
      } else {
        return this.rawTableData
          .map(x => {
            // assume the last step release automatically to be 1 when all previous steps passed
            if (
              x.design_perc == 100 &&
              x.design_approval == "OK" &&
              x.coding_perc == 100 &&
              x.coding_approval == "OK" &&
              x.testing_perc == 100 &&
              x.testing_approval == "OK"
            ) {
              x.release_perc = 100;
            } else {
              x.release_perc = 0;
            }
            return x;
          })
          .reduce((rv, x, i, { length }) => {
            tmp.design_perc = rv.design_perc + x.design_perc / length;
            tmp.coding_perc = rv.coding_perc + x.coding_perc / length;
            tmp.testing_perc = rv.testing_perc + x.testing_perc / length;
            tmp.release_perc = rv.release_perc + x.release_perc / length;

            if (i == length - 1) {
              tmp.design_perc = Math.round(tmp.design_perc);
              tmp.coding_perc = Math.round(tmp.coding_perc);
              tmp.testing_perc = Math.round(tmp.testing_perc);
              tmp.release_perc = Math.round(tmp.release_perc);
            }
            return tmp;
          }, tmp);
      }
    }
  },
  created: function() {
    this.initForm();
    this.getProjectList();
  },
  methods: {
    getProjectList: function() {
      this.$axios.get("api/project").then(res => {
        this.rawTableData = res.data;
      });
    },
    customColorMethod: function(percentage) {
      if (percentage <= 30) {
        return "#20A0FF";
      } else if (percentage <= 99) {
        return "#E6A23C";
      } else {
        return "#14CE66";
      }
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val;
    },
    displayProject: function(index, row) {
      const id = row["_id"];

      this.initForm();
      this.$axios
        .get(`api/project/${id}`)
        .then(res => {
          Object.assign(this.projectForm, res.data);
          return this.$axios.get(`api/log/findByProject?project_id=${id}`);
        })
        .then(res => {
          this.drawer = {
            show: true,
            readOnly: true,
            displayType: "all",
            activeName: "details",
            logs: res.data
          };
        });
    },
    initForm() {
      this.projectForm = {
        // _id: null,
        assignee: null,
        project_code: "",
        design_perc: 0,
        design_start: null,
        design_end: null,
        design_approval: "TODO",
        coding_perc: 0,
        coding_start: null,
        coding_end: null,
        coding_approval: "TODO",
        testing_perc: 0,
        testing_start: null,
        testing_end: null,
        testing_approval: "TODO",
        release: null
      };
    },
    addProject: function() {
      this.initForm();
      this.drawer = {
        show: true,
        displayType: "project",
        model: "add",
        activeName: "details",
        logs: []
      };
    },
    deleteProject: function() {
      if (this.multipleSelection.length <= 0) {
        return;
      }

      const ids = this.multipleSelection.map(x => x._id);

      this.$confirm("Are you sure you want to delete?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      }).then(() => {
        this.$axios
          .delete("api/project/deleteProjects", { params: { projectIds: ids } })
          .then(() => {
            this.$message({
              type: "success",
              message: "Delete completed"
            });
            this.getProjectList();
          });
      });
    },
    editProject: function(index, row) {
      const id = row["_id"];

      // clear data first avoid contamination
      this.initForm();
      this.$axios.get(`api/project/${id}`).then(res => {
        Object.assign(this.projectForm, res.data);
        this.drawer = {
          show: true,
          displayType: "project",
          model: "edit",
          activeName: "details",
          logs: []
        };
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.project {
  display: flex;
  height: 100%;
  flex-direction: column;
  &-header {
    height: 140px;
    display: flex;
    padding: 0px 20px;
    > div {
      margin-left: 40px;
    }
    .project-title {
      margin-left: 0px;
    }
    .dashbord {
      width: 128px;
      span {
        display: block;
        position: relative;
        top: -16px;
        text-align: center;
        width: auto;
      }
    }

    .mark {
      display: flex;
      width: 128px;
      margin-left: auto;
      // @edu preserved whitespace, otherwise conflict
      white-space: pre;
      justify-content: center;
      align-items: center;
      position: relative;

      // adjust location, align with process bar percentage
      &-content{
        position: absolute; 
        top: 53px;
      }
      .total-projects {
        font-size: 16px;
        font-weight: bold;
      }
    }

    span {
      font-size: 13px;
    }

    .project-title span {
      font-size: 35px;
    }
  }
  &-operation {
    position: relative;
    top: -8px;
    height: 95px;
    display: flex;
    justify-content: center;
    align-items: center;
    > * {
      margin: 0px;
      margin-right: 10px;
    }
    .reset-icon {
      font-size: 26px;
      color: #797979;
      margin-right: 0px;
    }
    .search {
      width: 180px;
      margin-left: auto;
    }
  }
  &-content {
    flex: 1 1 auto;
  }
}
.table-operation {
  display: flex;
  justify-content: center;
  align-items: center;
  > * {
    margin: 0 5px;
  }
  .icon-more {
    width: 15px;
    height: 15px;
    cursor: pointer;
  }
}
</style>