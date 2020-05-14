/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 20:57
 */

/**  --->>>>   |^ 产品线平均时效统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getProductLineAgingInfo(params = {}) {
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
        window.open('/tort/Examine_number/getAgingList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getAgingList', data);
    }
}


//产品线下拉数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tort/Examine_number/getProductLine', data);
}


//侵权类型下拉数据
export function getInfringementTypeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tort/Examine_number/getTortType', data);
}