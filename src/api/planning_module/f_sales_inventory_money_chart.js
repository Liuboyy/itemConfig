/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/31 13:58
 */

/**  --->>>>   |^ FBA模拟销库金额图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getSalesInventoryMoneyChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaLackCurve', data);
}