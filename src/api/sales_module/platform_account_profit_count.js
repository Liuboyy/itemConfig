/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/4 17:04
 */

/**  --->>>>   |^ 平台账号利润统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getPlatformAccountProfitCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/platform/Platform_account/getProfitReportData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Platform_account/getProfitReportData', data);
    }
}