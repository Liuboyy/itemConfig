/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/26 14:26
 */

/**  --->>>>   |^ 亚马逊退单分析^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//获取下拉
export function getOptionsList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Back_charge/getSelectList', data);
}

//曲线图表
export function getAmazonReturnOrderInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Back_charge/getSaleSummary', data);
}