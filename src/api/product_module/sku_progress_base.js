/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/20 19:11
 */

/**  --->>>>   |^ SKU进度跟进-基础表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSkuProgressBaseInfo(params = {}) {
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
        window.open('/overseas/Sku_flow/getFlowListData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Sku_flow/getFlowListData', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Sku_flow/getSelectData', data);
}

//获取产品线下拉
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Sku_flow/getProductLine', data);
}