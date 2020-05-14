/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/7 9:12
 */

/**  --->>>>   |^ 站点销售统计曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSiteSalesCurveInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getSiteSales', data);
}

//获取站点下拉数据
export function getSiteList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getSite', data);
}
//平台
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getPlatformNew', data);
}