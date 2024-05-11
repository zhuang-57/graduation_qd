import { defineStore } from 'pinia'
import {reactive, ref} from 'vue'

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

// 逆向映射函数
 type AcademyMap = {
  id:number,
  acadName:string
};

export const useUserStore = defineStore('user', () =>{
    const userInfo = ref<UserList | null>(null);
    const academyInfo = ref<AcademyMap | null>(null);
   
      function loginSuccess(newUserInfo:UserList) {
        userInfo.value = newUserInfo
      }
      function AcademyList(academy:AcademyMap) {
        academyInfo.value = academy
      }

      return {userInfo, loginSuccess,academyInfo,AcademyList}
  })