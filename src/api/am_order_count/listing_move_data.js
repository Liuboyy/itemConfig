/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/17 21:42
 */

/**  --->>>>   |^ listing动销数据报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//小组
export function getListingMoveDataGroupReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getReportData', data);
}

//账号
export function getListingMoveDataAccountReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getReportAccountData', data);
}