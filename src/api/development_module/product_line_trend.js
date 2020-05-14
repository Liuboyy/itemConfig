/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/3 15:18
 */

/**  --->>>>   |^ 产品线销售趋势报表 ^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getProductLineSalesTrendInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/development/Product_report/getProductsAvg' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Product_report/getProductsAvg', data);
    }
}

export function getDateOptionListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/development/Product_report/getTimes', data);
}