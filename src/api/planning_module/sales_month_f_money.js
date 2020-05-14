/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/26 10:31
 */

/**  --->>>>   |^ FBA在库金额^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSalesMonthFMoneyInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Sale_fba_stock/getSaleFbaPriceList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Sale_fba_stock/getSaleFbaPriceList', data);
    }
}