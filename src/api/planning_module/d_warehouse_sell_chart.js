/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/25 20:15
 */

/**  --->>>>   |^ 国内仓预计可售卖天数^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getDWarehouseSellChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getSaleDays', data);
}