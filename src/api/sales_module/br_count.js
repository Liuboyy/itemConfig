/**
 * Creator: KarYanLam
 * Creation Date: 2020/4/8 15:57
 */

/**  --->>>>   |^ 报表BR统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getBrStatementCountInfo(params = {}) {
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
        window.open('/report/Account_br/getSaleExcel' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/report/Account_br/getSaleExcel', data);
    }
}
