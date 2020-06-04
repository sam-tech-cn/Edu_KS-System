<template>
  <div class="user">
    <div class="user-header">
      <div class="user-title">
        <span>User</span>
      </div>
    </div>
    <div class="user-operation">
      <el-button @click="addUser" size="mini">
        <i class="el-icon-plus"></i>
        <span>NEW USER</span>
      </el-button>
      <el-button size="mini" @click.native="deleteUser">
        <i class="el-icon-minus"></i>
        <span>DELETE</span>
      </el-button>
      <el-button size="mini" @click.native="setAdmin">
        <i class="el-icon-user"></i>
        <span>SET AS ADMIN</span>
      </el-button>
      <el-input class="search" size="mini" placeholder="Type to search" v-model="search">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <i style="cursor: pointer" class="el-icon-refresh-right reset-icon" @click="resetTable"></i>
    </div>
    <div class="user-content">
      <el-table
        :data="tableData.filter(data => !search || data.name.toLowerCase().includes(search.toLowerCase()))"
        style="width: 100%;"
        :max-height="tableHeight"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" width="50"></el-table-column>

        <el-table-column fixed="left" prop="name" label="Username" width="120"></el-table-column>
        <el-table-column prop="email" label="Email" width="200"></el-table-column>
        <el-table-column prop="admin" label="Admin" width="100">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.admin" active-color="#13ce66" disabled></el-switch>
          </template>
        </el-table-column>
        <el-table-column prop="password" label="Password" width="300"></el-table-column>
        <el-table-column prop="note" label="Note" width="300"></el-table-column>
        <el-table-column align="center" fixed="right" label="Operations" width="90">
          <template slot-scope="scope">
            <i
              class="el-icon-edit"
              style="cursor: pointer"
              @click.prevent="editUser(scope.$index, scope.row)"
            ></i>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <dialog-user :dialog="userDialog" :form="userForm" @refresh="getUserList"></dialog-user>
  </div>
</template>
<script>
import DialogUser from "@/components/dialog-user";
export default {
  name: "User",
  components: { DialogUser },

  // @edu nextTick reset table max-height by asyn updated
  mounted() {
    this.$nextTick(() => {
      this.tableHeight = window.innerHeight - 285;
    });
  },
  data: function() {
    return {
      users: [],
      search: "",
      userDialog: {
        title: "",
        show: false,
        model: ""
      },
      userForm: {
        _id: "",
        name: "",
        admin: false,
        email: "",
        password: "",
        confirmPass: "",
        newPass: "",
        note: ""
      },
      tableHeight: 0,
      tableData: [],
      multipleSelection: []
    };
  },
  created: function() {
    this.getUserList();
  },
  methods: {
    getUserList: function() {
      this.$axios.get("api/user").then(res => {
        // just assume admin is a super user here
        this.tableData = res.data.filter(x => x.name !== "admin");
      });
    },
    initForm: function() {
      this.userForm = {
        _id: "",
        name: "",
        admin: false,
        email: "",
        password: "",
        confirmPass: "",
        newPass: "",
        note: ""
      };
    },
    addUser: function() {
      this.initForm();
      this.userDialog = {
        title: "User",
        show: true,
        model: "add"
      };
    },
    handleSelectionChange: function(val) {
      this.multipleSelection = val;
    },
    setAdmin: function() {
      if (this.multipleSelection.length <= 0) {
        return;
      }
      if (
        this.multipleSelection.filter(x => x.admin).length ==
        this.multipleSelection.length
      ) {
        this.$message({
          type: "info",
          message: "No need to set admin"
        });
        return;
      }

      const ids = this.multipleSelection.map(x => x._id);

      this.$axios.put("api/user/updateAllByIds?admin=true", ids).then(() => {
        this.$message({
          type: "success",
          message: "Admin setted successfully"
        });
        this.getUserList();
      });
    },
    deleteUser: function() {
      if (this.multipleSelection.length <= 0) {
        return;
      }
      const ids = this.multipleSelection.map(x => x._id);

      this.$confirm("Are you sure you want to delete?", "Warning", {
        confirmButtonText: "OK",
        cancelButtonText: "Cancel",
        type: "warning"
      }).then(() => {
        // @edu the server side will get params in query, e.g. express req.query.userIds
        this.$axios
          .delete("api/user/deleteUsers", { params: { userIds: ids } })
          .then(() => {
            this.$message({
              type: "success",
              message: "Delete completed"
            });
            this.getUserList();
          });
      });
    },
    resetTable: function() {
      this.search = "";
    },
    editUser: function(index, row) {
      const id = row["_id"];
      this.initForm();
      this.$axios.get(`api/user/${id}`).then(res => {
        Object.assign(this.userForm, res.data);
        this.userForm.password = "";
        this.userDialog = {
          title: "User",
          show: true,
          model: "edit"
        };
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.user {
  display: flex;
  height: 100%;
  width: 100%;
  flex-direction: column;
  &-header {
    height: 50px;
    display: flex;
    padding: 0px 20px;
    .user-title {
      span {
        font-size: 35px;
      }
    }
  }
  &-operation {
    height: 110px;
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
</style>