<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAdminStore } from "@/stores/admin";

const router = useRouter();
const adminStore = useAdminStore();
// 路由
if (adminStore.access_exp > Date.now()) router.push("/");
// 加载
onMounted(() => {});
</script>
<template>
  <div class="LoginView">
    <div class="container">
      <div class="line">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
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
  .container {
    width: 360px;
    height: 60px;
    background-color: #fff;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    border-radius: 10px;
    .line {
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
  }
}
</style>
<style>
body {
  background: linear-gradient(-90deg, #6d6d6d10 1px, transparent 0), linear-gradient(#6d6d6d10 1px, transparent 0),
    linear-gradient(-90deg, #6d6d6d10 1px, transparent 0), linear-gradient(#6d6d6d10 1px, transparent 0),
    linear-gradient(transparent 6px, transparent 0, transparent 156px, transparent 0),
    linear-gradient(-90deg, #6d6d6d10 1px, transparent 0),
    linear-gradient(-90deg, transparent 6px, transparent 0, transparent 156px, transparent 0),
    linear-gradient(#6d6d6d10 1px, transparent 0), 0 0;
  background-size: 20px 20px, 20px 20px, 100px 100px, 100px 100px, 100px 100px, 100px 100px, 100px 100px, 100px 100px;
}
</style>
