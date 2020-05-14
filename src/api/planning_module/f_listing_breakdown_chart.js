/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/31 9:41
 */

/**  --->>>>   |^ FBA断货listing推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getFListingBreakdownChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaListingCurve', data);
}