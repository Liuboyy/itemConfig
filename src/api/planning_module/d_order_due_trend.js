/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/23 14:52
 */

/**  --->>>>   |^ 国内日订单及欠货趋势^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getDOrderDueTrendInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/warehouse/Domestic_pass/getDataList', data);
}