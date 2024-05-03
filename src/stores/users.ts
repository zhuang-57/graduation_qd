import { defineStore } from 'pinia'
import {ref} from 'vue'

interface UserList {
    academyId:number,
    birthday:string,
    educational:string,
    id:number,
    img:string,
    major:string,
    password:string,
    phone:string,
    remark:string
    roleId:number,
    roleName:string,
    username:string,
    sex:string,
}

export const useUserStore = defineStore('user', () =>{
    const userInfo = ref<UserList | null>(null);
   
      function loginSuccess(newUserInfo:UserList) {
        userInfo.value = newUserInfo
      }
      // function logout() {
      //   this.userInfo = null
      // },

      return {userInfo, loginSuccess}
  })