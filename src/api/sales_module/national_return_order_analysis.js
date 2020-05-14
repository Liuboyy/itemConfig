/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/27 9:55
 */

/**  --->>>>   |^ 各国退单分析^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getNationalReturnOrderInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Back_charge/getSiteSummary', data);
}

export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Back_charge/getSelectList', data);
}