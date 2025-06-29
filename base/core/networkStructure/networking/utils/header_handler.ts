// import { useUserStore } from "~/stores/user";

import { useUserStore } from "~/stores/user";
import {getWebDomain} from "~/constant/webDomain";


class HeaderHandler {
  private static instance: HeaderHandler;

  private userStore = useUserStore();



  private constructor() {}

  public static getInstance(): HeaderHandler {
    if (!this.instance) {
      this.instance = new HeaderHandler();
    }
    return this.instance;
  }

  getHeader(isAuth = false, webDomain: string): { [key: string]: string } {
    const headers: { [key: string]: string } = {};
    const userStore = this.userStore; // Initialize the store here

    if (userStore?.user !== null) {
      const token: string | undefined = userStore?.user?.apiToken;
      if (userStore?.user) {
        headers['Authorization'] = 'Bearer ' + token;
      }
    }

    // const savedLocale = localStorage.getItem('lang');
    // if (savedLocale) {
    // }
    headers['Accept-Language'] = "ar";
    headers['Content-Type'] = 'application/json';
    headers['web-domain'] = "student";
    headers['Accept'] = 'application/json';


    return headers;
  }
}

export default HeaderHandler;
