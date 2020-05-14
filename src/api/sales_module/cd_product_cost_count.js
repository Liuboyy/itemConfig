/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/23 20:43
 */

/**  --->>>>   |^CD产品成本占比统计^|   <<<<---**/


import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getCdProductCostCurveInfo(params = {}) {
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
        window.open('/platform/Cd_product_cost/getCdProductList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Cd_product_cost/getCdProductList', data);
    }
}
