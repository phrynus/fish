<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from "vue-router";
import axiosAdmin from "@/api/admin";
import { useAdminStore } from "@/stores/admin";
import { onMounted, computed } from "vue";
import { ElLoading, ElMessage, ElMessageBox } from "element-plus";

const router = useRouter();
const adminStore = useAdminStore();

const isAccessTokenExpiringSoon = computed(() => {
  const currentTime = Date.now();
  return adminStore.access_exp && adminStore.access_exp - currentTime < 30 * 60 * 1000; // 30分钟
});

onMounted(() => {
  // 10分钟循环检查一次token是否过期
  setInterval(async () => {
    try {
      if (adminStore.refresh_exp < Date.now()) router.push("/login");
      if (isAccessTokenExpiringSoon.value) {
        let res = await axiosAdmin.post("/ref", { token: adminStore.refresh_token });
        adminStore.access_token = res.data.data.access;
      }
    } catch (err: any) {
      ElMessage.error(err.response?.data?.msg || "更新TOKEN失败");
      router.push("/login");
    }
  }, 10 * 60 * 1000);
});
</script>
<template>
  <RouterView />
</template>

<style scoped></style>
