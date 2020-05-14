/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/28 21:38
 */

/**  --->>>>   |^ listing业绩曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getListingCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getListingSaleSummary', data);
}