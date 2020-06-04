<template>
  <div class="dialog-userinfo-container">
    <el-dialog :title="dialog.title" :visible.sync="dialog.show" class="dialog-userinfo">
      <el-form
        :model="form"
        :rules="formRules"
        ref="userInfoForm"
        label-width="120px"
        label-position="left"
      >
        <el-form-item label="User Name" prop="name">
          <!-- just assume admin can not be modified -->
          <el-input
            :disabled="!form.admin || user.name == 'admin'"
            v-model="form.name"
            size="medium"
          ></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click.prevent="onSubmit('userInfoForm')" size="medium">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { UPDATE_USERINFO } from "@/store/action-types";
import { mapGetters } from "vuex";

export default {
  name: "UserInfo",
  props: { dialog: Object, form: Object },
  computed: {
    ...mapGetters(["user"])
  },
  data: function() {
    return {
      formRules: {
        name: [
          {
            required: true,
            message: "Please input user name",
            trigger: "blur"
          },
          {
            min: 3,
            max: 20,
            message: "Length should be 3 to 20",
            trigger: "blur"
          }
        ],
        email: {
          type: "email",
          required: true,
          message: "Please input correct email address",
          trigger: "blur"
        }
      }
    };
  },
  methods: {
    onSubmit: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios
            .put(`api/user/${this.form["_id"]}`, {
              name: this.form.name,
              email: this.form.email
            })
            .then(res => {
              this.$store.dispatch(UPDATE_USERINFO, res.data);
              this.$message.success("user saved successfully");
              this.dialog.show = false;
            });
        } else {
          this.$message.error("error submit!!");
          return false;
        }
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-userinfo {
  margin: 0 auto;
  width: 55%;
}
.el-button {
  width: 85px;
}
</style>