import { ElMessage } from 'element-plus';
import { reactive } from 'vue';
import { getAcademyList } from '../../api/users';

export type AcademyMap = {
    id:number,
    acadName:string
  };
export const AcademyMenus = reactive<AcademyMap>({
    id:null,
    acadName:''
});

//获取学院列表数据
export const getAcademyList = async () => {
    const { data } = await getAcademyList();
    if(data.code === 0) {
        Object.assign(AcademyMenus,data.data)
    }else {
        ElMessage.error(data.msg)
    }
}
