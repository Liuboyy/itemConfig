/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/20 16:15
 */

/**  --->>>>   |^ 国内MRP采购推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getDMrpPurchaseChartInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/warehouse/Domestic_mrp/getDataList', data);
}