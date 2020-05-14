/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/23 15:53
 */

/**  --->>>>   |^ 海外仓库存推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getOWarehouseInventoryChartInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getDataList', data);
}