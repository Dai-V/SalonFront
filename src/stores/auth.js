import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    isLoggedIn: false, 
    csrftoken: null
  }),
  actions: {
    login(token) {
      this.isLoggedIn = true;
      this.csrftoken = token
    },
    logout() {
      this.isLoggedIn = false;
      this.csrftoken = null
    },
  },
});