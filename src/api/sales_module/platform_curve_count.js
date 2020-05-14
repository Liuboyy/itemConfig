/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/30 14:38
 */

/**  --->>>>   |^ JUM与DAR曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//获取列表数据
export function getPlatformCurveCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/southasia/Southasia_report/getCurveData', data);
}

// 获取树形菜单
export function getPlatformTreeMenuList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/southasia/Southasia_report/getTree', data);
}
