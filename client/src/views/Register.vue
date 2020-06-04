<template>
  <div class="register">
    <entry-frame>
      <el-form
        :model="registerForm"
        :rules="registerRules"
        ref="registerForm"
        label-width="120px"
        class="register-form"
      >
        <el-form-item label="User Name" prop="name">
          <el-input v-model="registerForm.name" size="medium"></el-input>
        </el-form-item>

        <el-form-item label="Email" prop="email">
          <el-input v-model="registerForm.email" size="medium"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input v-model="registerForm.password" type="password" size="medium"></el-input>
        </el-form-item>

        <el-form-item label="Confirm" prop="confirm">
          <el-input @keyup.enter.native.prevent="submitForm('registerForm')" v-model="registerForm.confirmPass" type="password" size="medium"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            class="btn-submit"
            @click.prevent="submitForm('registerForm')"
          >Register</el-button>
        </el-form-item>

        <div class="tips">
          <span>
            Already have an account?
            <router-link to="/login">Sign in.</router-link>
          </span>
        </div>
      </el-form>
    </entry-frame>
  </div>
</template>
<script>
import EntryFrame from "@/components/entry-frame";

export default {
  name: "Register",
  components: { EntryFrame },
  data() {
    var validatePass = (rule, value, callback) => {
      if (value !== this.registerForm.password) {
        callback(new Error("Two inputs don't match!"));
      } else {
        callback();
      }
    };
    return {
      registerForm: {
        name: "",
        email: "",
        password: "",
        confirmPass: ""
      },
      registerRules: {
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
          trigger: ["blur", "change"]
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
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$axios.post("api/user", this.registerForm).then(() => {
            this.$message.success("registration success");
            this.$router.push("/login");
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
$bg: #f0f2f5;
$box-shadow: #e3e4e6;
.register {
  background-color: $bg;

  /* Set the height to match that of the viewport. */
  height: 100vh;

  /* Set the width to match that of the viewport. */
  width: 100vw;

  &-form {
    width: 380px;
    margin: 20px auto 0;
    height: auto;
    padding: 40px 40px 20px 0;
    background-color: white;
    box-shadow: 0px 2px 12px $box-shadow;

    .btn-submit {
      width: 100%;
    }
    .tips {
      text-align: right;
      span {
        color: #616266;
      }
    }
  }
}
</style>