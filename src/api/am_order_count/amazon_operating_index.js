/**
 * Creator: KarYanLam
 * Creation Date: 2019/8/12 16:13
 */

/**  --->>>>   |^ 亚马逊运营指标^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getAmazonOperatingIndexInfo(params = {}) {
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