/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/21 11:36
 */

/**  --->>>>   |^ SKU进度跟进-SKU维度^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSkuProgressSkuDimensionInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/overseas/Sku_flow/getFlowSkuListData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Sku_flow/getFlowSkuListData', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Sku_flow/getSelectSkuData', data);
}

//获取产品线下拉
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Sku_flow/getProductLine', data);
}