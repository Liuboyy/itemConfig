/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/31 16:26
 */

/**  --->>>>   |^ FBA模拟listing占比图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getSalesInventoryListingChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaLackListingCurve', data);
}