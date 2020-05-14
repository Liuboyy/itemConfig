/**
 * Creator: KarYanLam
 * Creation Date: 2019/8/12 17:36
 */

/**  --->>>>   |^ FBA超期库存^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getFbaOverrunInventoryInfo(params = {}) {
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
        window.open('/' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/', data);
    }
}