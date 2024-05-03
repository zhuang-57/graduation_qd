import {defineStore} from 'pinia';

interface Token {
    token:string
}

export const useTokenStore = defineStore("mytoken",() => {
    //ref相当于 state 创建初始化变量保存token
    const tokenJson = ref("");
    //computed 相当于 getters
    const token = computed<Token>(() => {
        try{
            
            return tokenJson.value|| window.localStorage.getItem("TokenInfo") || "{}"
        }catch(err) {
            ElMessage.error("json字符串格式不合格，转化对象失败...");
            window.localStorage.setItem("TokenInfo","");
            throw err;
        }
    })
    //function 相当于 actions
    function saveToken(data: string) {
        tokenJson.value = data;
        window.localStorage.setItem("TokenInfo",data);
    }

    // 向外暴露
    return {token, saveToken}
}) 