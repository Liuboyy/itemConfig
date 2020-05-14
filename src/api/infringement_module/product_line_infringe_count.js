/**
 * Creator: KarYanLam
 * Creation Date: 2019/12/5 21:41
 */

/**  --->>>>   |^ 产品线侵权统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getProductLineInfringeCountInfo(params = {}) {
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
        window.open('/tort/Examine_number/getTortList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getTortList', data);
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
