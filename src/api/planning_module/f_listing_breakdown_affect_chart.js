/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/31 16:27
 */

/**  --->>>>   |^ FBA断货占比推移图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getListingBreakdownAffectChart(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getFbaLackRateCurve', data);
}