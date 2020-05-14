/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/25 17:55
 */

/**  --->>>>   |^ 欠货统计报表定格^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getArrearsFreezeCountReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/orderlack/Order_lack/getLackReport' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/orderlack/Order_lack/getLackReport', data);
    }
}

//获取平台下拉数据
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/orderlack/Order_lack/getPlatform', data);
}