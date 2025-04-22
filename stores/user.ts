import type UserModel from "~/features/LoginFeature/Data/models/user_model";
import { defineStore } from "pinia";



export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserModel | null,
        isAuth: false,
    }),
    getters: {
        token: (state) => state.user?.apiToken ?? null, // Getter for token
    },
    actions: {
        setUser(data: UserModel) {
            this.user = data;
            this.isAuth = true;
            // console.log(this.user)
        },
        logout() {
            this.user = null;
            this.isAuth = false;
        },
    },
    persist: true,
})