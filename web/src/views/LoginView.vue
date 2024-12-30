<script lang="ts" setup>
import { ref, onMounted, watch, computed } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";
import axiosAdmin from "@/api/admin";

const router = useRouter();
const adminStore = useAdminStore();

// 检查登录状态
if (adminStore.access_exp > Date.now()) {
  router.push("/");
}

// 登录输入相关状态
const loginKeyInput = ref<string>("");
const loginKeyInputLength = computed(() => {
  let v = loginKeyInput.value + "";
  return v.length;
});
const keyInputRef = ref<HTMLInputElement | null>(null);
const hasFocus = ref(false);

const handleLogin = async () => {
  const loadingInstance = ElLoading.service();
  try {
    const response = await axiosAdmin.post("/login", { key: loginKeyInput.value });
    const data = response.data.data;

    if (data.qr) {
      await ElMessageBox.confirm(`<img src="${data.qr}" style="width: 100%; height: 100%;" />`, "", {
        dangerouslyUseHTMLString: true,
        showClose: false,
        showCancelButton: false,
        showConfirmButton: false,
        customClass: "login-qr-code-box"
      });
    } else {
      adminStore.access_token = data.access;
      adminStore.refresh_token = data.refresh;
      loginKeyInput.value = "";
      ElMessage.success("欢迎回来");
      router.push("/");
    }
  } catch (err: any) {
    loginKeyInput.value = "";
    keyInputRef.value?.focus();
    ElMessage.error(err.response?.data?.msg || "登录失败，请稍后重试");
  } finally {
    loadingInstance.close();
  }
};

onMounted(() => {
  // 设置输入框初始焦点
  keyInputRef.value?.focus();

  // 监听输入内容变化
  watch(loginKeyInput, (newVal) => {
    let v = loginKeyInput.value + "";
    if (v.length >= 6) {
      keyInputRef.value?.blur();
      handleLogin();
    }
  });
});
</script>

<template>
  <div class="LoginView">
    <div class="container">
      <input
        type="number"
        ref="keyInputRef"
        v-model="loginKeyInput"
        @focus="hasFocus = true"
        @blur="hasFocus = false"
      />
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
          :key="i"
          :class="{
            active: loginKeyInputLength >= i,
            on: loginKeyInputLength === i - 1 && hasFocus
          }"
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
.login-qr-code-box {
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
