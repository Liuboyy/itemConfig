/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/12 16:54
 */

/**  --->>>>   |^ listing动销柱状图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//列表数据
export function getListingMoveBarInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getDynamicData', data);
}


//获取小组
export function getGroupList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getAllGroup', data);
}

//获取账号
export function getAccountList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getAllAccount', data);
}