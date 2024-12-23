import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useAdminStore = defineStore(
  "admin",
  () => {
    const getTokenPayload = (token: any, join: string) => {
      if (token.value) {
        const payload = token.value.split(".")[1];
        return JSON.parse(atob(payload))[join] || null;
      }
      return null;
    };
    const access_token = ref<string | null>(null);
    const access_exp = computed(() => getTokenPayload(access_token, "exp") * 1000);
    const refresh_token = ref<string | null>(null);
    const refresh_exp = computed(() => getTokenPayload(refresh_token, "exp") * 1000);

    return { access_token, refresh_token, access_exp, refresh_exp };
  },
  {
    persist: true
  }
);
