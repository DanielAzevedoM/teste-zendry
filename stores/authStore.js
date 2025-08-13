import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    userId: "",
    isAuthenticated: false,
  }),
  actions: {
    
    },
  },
);