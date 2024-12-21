import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAdminStore = defineStore(
  "admin",
  () => {
    const access_token = ref<string | null>(null);
    const refresh_token = ref<string | null>(null);
    return { access_token, refresh_token };
  },
  {
    persist: true
  }
);
