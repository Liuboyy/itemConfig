/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/27 10:55
 */

/**  --->>>>   |^ TOB各国业绩^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getTobPerformanceCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };

    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/amazon/Sale_summary/getTobCountryData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Sale_summary/getTobCountryData', data);
    }
}