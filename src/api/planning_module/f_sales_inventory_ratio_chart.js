/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/31 15:46
 */

/**  --->>>>   |^ FBA模拟销量占比图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getSalesInventoryRatioChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaLackSaleCurve', data);
}