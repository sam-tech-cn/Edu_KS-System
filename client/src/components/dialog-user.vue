<template>
  <div class="dialog-user-container">
    <el-dialog
      width="65%"
      :title="dialog.title"
      :visible.sync="dialog.show"
      class="dialog-user"
     @close="clearForm"
    >
      <el-form
        :model="form"
        :rules="formRules"
        ref="userForm"
        label-width="140px"
        label-position="left"
      >
        <el-form-item label="User Name" prop="name">
          <el-input v-model="form.name" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="Email" prop="email">
          <el-input v-model="form.email" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="Password" prop="password">
          <el-input v-model="form.password" type="password" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="Confirm Password" prop="confirmPass">
          <el-input type="password" v-model="form.confirmPass" size="medium"></el-input>
        </el-form-item>
        <el-form-item label="Admin" prop="admin">
          <el-switch v-model="form.admin" active-color="#13ce66"></el-switch>
        </el-form-item>
        <el-form-item label="Note" prop="note">
          <el-input type="textarea" :rows="2" v-model="form.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click.prevent="handleClose" size="medium">Cancel</el-button>
        <el-button type="primary" @click.prevent="onSubmit('userForm')" size="medium">OK</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: "DialogUser",
  props: { dialog: Object, form: Object },
  watch: {
    dialog: function(val) {
      if (val.model == "add") {
        this.formRules.password[0].required = true;
        this.formRules.confirmPass[0].required = true;
      } else {
        this.formRules.password[0].required = false;
        this.formRules.confirmPass[0].required = false;
      }
    }
  },
  data: function() {
    let validatePass = (rule, value, callback) => {
      if (this.form.password && value !== this.form.password) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
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
        },
        password: [
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
        ],
        admin: {
          required: true
        }
      }
    };
  },
  methods: {
    onSubmit: function(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if (this.dialog.model == "add") {
            this.$axios.post("api/user", this.form).then(() => {
              this.$message.success("Record saved successfully");
              this.dialog.show = false;
              this.$emit("refresh");
            });
          } else if (this.dialog.model == "edit") {
            this.$axios
              .put(`api/user/${this.form["_id"]}`, this.form)
              .then(() => {
                this.$message.success("Record updated successfully");
                this.dialog.show = false;
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
      this.$refs["userForm"].clearValidate();
    },
    handleClose: function() {
      this.dialog.show = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.dialog-user {
  margin: 0 auto;
  width: 50%;
}
.el-button {
  width: 85px;
}
</style>