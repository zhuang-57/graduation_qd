import dayjs from "dayjs"
export const timeFormatter = (row = undefined,cloumn = undefined,value) => {
    
    return dayjs(value).format("YYYY-MM-DD HH:mm:ss")
}

export const timeDayFormatter = (row = undefined,cloumn = undefined,value) => {
    
    return dayjs(value).format("YYYY-MM-DD")
}