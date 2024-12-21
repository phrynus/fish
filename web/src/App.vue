<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
import axiosAdmin from "@/api/admin";
axiosAdmin.post("/users", {});
console.log(localStorage.getItem("admin"));
</script>
<template>
  <RouterView />
</template>

<style scoped></style>
