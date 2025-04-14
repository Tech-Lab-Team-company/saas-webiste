import type UserModel from "~/features/LoginFeature/Data/models/user_model";
import {defineStore} from "pinia";



export const useUserStore = defineStore('user', {
    state: () => ({
        user: null as UserModel | null,
        isAuth: false,
    }),
    getters: {
        token: (state) => state.user?.apiToken ?? null, // Getter for token
    },
    actions: {
        setUser(user: UserModel) {
            this.user = user;
            this.isAuth = true;
        },
        logout() {
            this.user = null;
            this.isAuth = false;
        },
    },
    persist: true,
})