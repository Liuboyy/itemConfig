/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/17 14:36
 */

/**  --->>>>   |^ 各国FBA实时库存^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getNationalFbaTimeInventoryInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getFbaRealTimeData', data);
}

export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getSiteList', data);
}