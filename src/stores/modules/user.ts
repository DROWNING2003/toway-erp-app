import { defineStore } from 'pinia';
import { STORAGE_TOKEN_KEY } from '../mutation-type';
import { getUserInfo, login } from '@/api/Base/user';
import { localStorage } from '@/utils/local-storage';
import pinia from '..';
import { showNotify } from 'vant';

export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    token: localStorage.get(STORAGE_TOKEN_KEY),
    // retoken: storage.get(RENEW_TOKEN, ''),
    username: '',
    welcome: '',
    avatar: '',
    permissions: [],
    info: localStorage.get("CURRENT_USER", {}),
    attendTemp:{},
  }),
  getters: {
    getToken(): string {
      return this.token;
    },
    // getRefreshToken(): string {
    //   return this.retoken;
    // },
    getAvatar(): string {
      return this.avatar;
    },
    // getID(): string {
    //   return this.info.employeeID.toString();
    // },
    // getNickname(): string {
    //   return this.username;
    // },
    // getPermissions(): [any][] {
    //   return this.permissions;
    // },
    // getUserInfo(): UserInfoType {
    //   return this.info;
    // },
  },
  actions: {
    setToken(token: string) {
      this.token = token;
    },
    setAvatar(avatar: string) {
      this.avatar = avatar;
    },
    setPermissions(permissions) {
      this.permissions = permissions;
    },
    setUserInfo(info) {
      this.info = info;
    },
    // 登录
    async login(params: any) {
      const response = await login(params);
      const { data, code,message } = response;
      if (code === 0) {
        localStorage.set(STORAGE_TOKEN_KEY,data.token);
        this.setToken(data.token)
        location.replace("/")
      }
      showNotify({
        type: 'success',
        message: message,
      })
      return response;
    },
    // 获取用户信息
    async getInfo() {
      const response = await getUserInfo();
      const { data } = response;
      
      if (data.permissions && data.permissions.length) {
        const permissionsList = data.permissions;
        this.setPermissions(permissionsList);
        this.setUserInfo(data);
      } else {
        throw new Error('getInfo: permissionsList must be a non-null array !');
      }
      console.log(data);
      this.setUserInfo({
        username: data.sName,
        employeeID: data.nEmployeeId,
        phone: data.sIdCard,
        email: data.sEmail
      })
      this.setAvatar(data.sIdPhotoUrl);
      return data;
    },

    // 登出
    async logout() {
      this.setPermissions([]);
      this.setUserInfo({ username: '', email: '',employeeID:0 });
      localStorage.remove(STORAGE_TOKEN_KEY);
      storage.remove("CURRENT_USER");
    },
  },
});

// Need to be used outside the setup
export function useUser() {
  return useUserStore(pinia);
}
