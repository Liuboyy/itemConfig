/**
 * Creator: KarYanLam
 * Creation Date: 2020/2/18 11:45
 */

/**  --->>>>   |^ 仓库销售统计曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getWarehouseSalesCurve(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getWarehouseSales', data);
}

//仓库树形
export function getWarehouseTreeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getWarehouseTree', data);
}

//平台
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getPlatformNew', data);
}