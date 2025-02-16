import {http} from "../../common/https";

export const addAvailableHours=async(availhoursPayload)=>{
    const response=await http.post('/api/teacher/add',availhoursPayload)
    return response.data;
}