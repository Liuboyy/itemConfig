/**
 * Creator: KarYanLam
 * Creation Date: 2020/1/7 15:19
 */

/**  --->>>>   |^ 产品线汇总统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getProductLineCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Task_summary/summaryProductList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Task_summary/summaryProductList', data);
    }
}