import { defineStore } from 'pinia'
import type UserModel from "~/features/LoginFeature/Data/models/user_model"

export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserModel | null,
    image: null as string | null,
    isAuth: false,
  }),
  actions: {
    setUser(data: UserModel) {
      this.user = data;
      this.isAuth = true;
    },
    updateUser(data: Partial<UserModel>) {
      if (!this.user) return;

      Object.assign(this.user, data);
    },
    setImage(img: string) {
      this.image = img;
    },
    markVerified() {
      if (this.user) {
        this.user.isVerified = true;
        this.isAuth = true;
      }
    },
    logout() {
      this.user = null;
      this.image = null;
      this.isAuth = false;
    },
  
  },
  persist: true
});
