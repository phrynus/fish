<script lang="ts" setup>
import { ref, onMounted, watch } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import axiosAdmin from "@/api/admin";

const router = useRouter();
const adminStore = useAdminStore();
if (adminStore.access_exp > Date.now()) router.push("/");
const LoginKeyInput = ref("");
const KeyInput = ref<null | any>(null);
// 判断是否有焦点
const hasFocus = ref(false);
// 判断是否输入完成
const isComplete = ref(false);

const handleLogin = async () => {
  if (!isComplete.value) {
    isComplete.value = true;
    const loadingInstance = ElLoading.service({});
    await axiosAdmin
      .post(
        "/login",
        {},
        {
          params: {
            key: LoginKeyInput.value
          }
        }
      )
      .then((res) => {
        if (res.data.qr) {
          ElMessageBox.confirm(`<img src="${res.data.qr}" style='width: 100%;height: 100%;' />`, "", {
            dangerouslyUseHTMLString: true,
            showClose: false,
            showCancelButton: false,
            showConfirmButton: false,
            customClass: "qr-code-box",
            callback: () => {
              adminStore.access_token = res.data.access;
              adminStore.refresh_token = res.data.refresh;
              LoginKeyInput.value = "";
              loadingInstance.close();
              router.push("/");
            }
          });
        } else {
          adminStore.access_token = res.data.access;
          adminStore.refresh_token = res.data.refresh;
          LoginKeyInput.value = "";
          loadingInstance.close();
          router.push("/");
        }
      })
      .catch((err) => {
        console.log(err);

        LoginKeyInput.value = "";
        ElMessage.error(err.response);
        loadingInstance.close();
      });
    isComplete.value = false;
  }
};

onMounted(() => {
  KeyInput.value.focus();
  watch(LoginKeyInput, (newVal) => {
    let val = newVal + "";
    if (val.length >= 6) {
      KeyInput.value.blur();
      handleLogin();
    }
  });
});
</script>
<template>
  <div class="LoginView">
    <div class="container">
      <input type="number" @focus="hasFocus = true" @blur="hasFocus = false" ref="KeyInput" v-model="LoginKeyInput" />
      <div class="line">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div class="span">
        <div
          v-for="i in 6"
          :class="
            (LoginKeyInput + '').length >= i ? 'active' : (LoginKeyInput + '').length + 1 == i && hasFocus ? 'on ' : ''
          "
        ></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.LoginView {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(-90deg, #6d6d6d10 1px, transparent 0), linear-gradient(#6d6d6d10 1px, transparent 0),
    linear-gradient(-90deg, #6d6d6d10 1px, transparent 0), linear-gradient(#6d6d6d10 1px, transparent 0),
    linear-gradient(transparent 6px, transparent 0, transparent 156px, transparent 0),
    linear-gradient(-90deg, #6d6d6d10 1px, transparent 0),
    linear-gradient(-90deg, transparent 6px, transparent 0, transparent 156px, transparent 0),
    linear-gradient(#6d6d6d10 1px, transparent 0), 0 0;
  background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px, 100px 100px, 100px 100px, 100px 100px, 100px 100px;
  .container {
    width: 360px;
    height: 60px;
    background-color: #fff;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 10px;
    position: relative;
    .line {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-evenly;
      div {
        height: 60%;
        width: 1px;
        background-color: #ebebeb7a;
      }
    }
    .span {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      display: flex;
      height: 100%;
      align-items: center;
      justify-content: space-around;
      div {
        height: 16px;
        width: 16px;
        border-radius: 50%;
        position: relative;
        &.active {
          background-color: rgb(0 0 0 / 89%);
          color: #0000;
        }
        &.on::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 1px;
          height: 150%;
          background-color: rgb(0 0 0 / 89%);
          transform: translate(-50%, -50%);
          animation: blink 1s steps(1, start) infinite;
        }
      }
    }
    input {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      opacity: 0;
      color: transparent;
      text-shadow: 0 0 0 #000;
      caret-color: transparent;
    }
  }
}
@keyframes blink {
  50% {
    opacity: 0;
  }
}
</style>
<style lang="scss" scoped>
.qr-code-box {
  max-width: 240px;
  .el-message-box__header,
  .el-message-box__btns {
    padding: 0;
  }
  .el-message-box__message {
    width: 100%;
  }
}
</style>
