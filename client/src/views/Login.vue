<template>
  <div class="login">
    <entry-frame>
      <el-form
        :model="loginForm"
        :rules="loginRules"
        ref="loginForm"
        label-width="120px"
        class="login-form"
      >
        <el-form-item label="User Name" prop="name">
          <el-input v-model="loginForm.name" size="medium"></el-input>
        </el-form-item>

        <el-form-item label="Password" prop="password">
          <el-input @keyup.enter.native.prevent="submitForm('loginForm')" v-model="loginForm.password" type="password" size="medium"></el-input>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            size="medium"
            class="btn-submit"
            @click.prevent="submitForm('loginForm')"
          >Sign in</el-button>
        </el-form-item>
        <div class="tips">
          <span>
            New user?
            <router-link to="/register">Register now.</router-link>
          </span>
        </div>
      </el-form>
    </entry-frame>
  </div>
</template>
<script>
import EntryFrame from "@/components/entry-frame";
import { LOG_IN } from "@/store/action-types";

export default {
  name: "Login",
  components: { EntryFrame },
  data() {
    return {
      loginForm: {
        name: "",
        password: ""
      },
      loginRules: {
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
        ]
      }
    };
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.$store.dispatch(LOG_IN, this.loginForm).then(() => {
            this.$router.push("/");
          });

          // @edu error catched by axios interceptor
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

.login {
  background-color: $bg;

  /* Set the height to match that of the viewport. */
  // @edu vh Relative to 1% of the height of the viewport, * Viewport = the browser window size. If the viewport is 50cm wide, 1vw = 0.5cm.
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