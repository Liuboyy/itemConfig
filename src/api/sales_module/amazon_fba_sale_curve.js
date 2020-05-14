/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/17 9:17
 */

/**  --->>>>   |^ FBA可售曲线^|   <<<<---**/


import CONFIG from '@/assets/js/config';
import http from '@/http';

//获取树下拉
export function getTreeDataList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getCategoryList', data);
}

//曲线图表
export function getAmazonCanSaleCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getFbaOnSellData', data);
}