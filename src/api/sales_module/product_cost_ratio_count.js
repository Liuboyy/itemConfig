/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/17 17:52
 */

/**  --->>>>   |^ 产品成本CNY及占比统计报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getProductCostRatioCountInfo(params = {}) {
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
        window.open('/platform/Ali_product_cost/getAliProductList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Ali_product_cost/getAliProductList', data);
    }
}