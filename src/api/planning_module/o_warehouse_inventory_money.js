/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/24 16:59
 */

/**  --->>>>   |^ 海外仓库存金额推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getOWarehouseInventoryMoneyChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getMoneyList', data);
}