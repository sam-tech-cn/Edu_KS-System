<template>
  <div class="dialog-pass-container">
    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.show"
      class="dialog-pass"
      @close="clearForm"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="passForm"
        label-width="140px"
        class="pass-form"
        label-position="left"
      >
        <el-form-item label="Current Password" prop="currentPass" :error="newPassFailMsg">
          <el-input type="password" v-model="form.currentPass" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="New Password" prop="newPass">
          <el-input type="password" v-model="form.newPass" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPass">
          <el-input type="password" v-model="form.confirmPass" size="medium"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialog.show = false" size="medium">Cancel</el-button>
        <el-button type="primary" @click.prevent="onSubmit('passForm')" size="medium">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import bcrypt from "bcryptjs";

export default {
  name: "ChangePass",
  props: {
    dialog: Object,
    form: Object
  },
  data: function() {
    let validatePass = (rule, value, callback) => {
      if (value !== this.form.newPass) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };

    return {

      // @edu element-ui validation filed by v-model not property, property is a specific key
      formRules: {
        currentPass: [
          {
            required: true,
            message: "Please input password",
            trigger: "blur"
          },
          {
            min: 4,
            max: 20,
            message: "Length should be 4 to 20",
            trigger: "blur"
          }
        ],
        newPass: [
          {
            required: true,
            message: "Please input password",
            trigger: "blur"
          },
          {
            min: 4,
            max: 20,
            message: "Length should be 4 to 20",
            trigger: "blur"
          }
        ],
        confirmPass: [
          {
            required: true,
            message: "Please input password again",
            trigger: "blur"
          },
          {
            min: 4,
            max: 20,
            message: "Length should be 4 to 20",
            trigger: "blur"
          },
          { validator: validatePass, trigger: "blur" }
        ]
      },
      newPassFailMsg: ""
    };
  },
  methods: {
    onSubmit: async function(formName) {
      const valid = await this.$refs[formName].validate();
      if (valid) {
        const res = await this.$axios.get(`api/user/${this.form["_id"]}`);

        // check current pass match
        if (!bcrypt.compareSync(this.form.currentPass, res.data.password)) {
          this.newPassFailMsg = "The current password is wrong";
          return false;
        } else {
          this.$axios
            .put(`api/user/${this.form["_id"]}`, {
              password: this.form.newPass
            })
            .then(() => {
              this.$message.success("password changed successfully")
              this.dialog.show = false;
            });
        }
      } else {
        this.$message.error("error submit!!");
        return false;
      }
    },
    clearForm: function() {
      // when open dialog clear all validation
      this.$refs["passForm"].resetFields();
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-pass {
  margin: 0 auto;
  width: 55%;
}
.el-button {
  width: 85px;
}
</style>