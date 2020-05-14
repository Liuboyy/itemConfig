/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/25 20:14
 */


/**  --->>>>   |^ 国内仓库存推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getDWarehouseInventoryChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getDomesticCurve', data);
}