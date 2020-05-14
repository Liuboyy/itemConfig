/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/24 18:54
 */

/**  --->>>>   |^ FBA库存推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getFWarehouseInventoryChartInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaFourCurve', data);
}