/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/31 13:58
 */

/**  --->>>>   |^ FBA断货金额推移图^|   <<<<---**/


import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getListingBreakdownMoneyChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaLackMoneyCurve', data);
}