
import http from '@/http';
import CONFIG from "../../assets/js/config";

// 获取用户信息
export function getUserInfo(queryParams) {
    // const data = {};
    return http.postAjax('/login/login/getuserinfo', queryParams);
}