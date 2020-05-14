/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/21 16:07
 */

/**  --->>>>   |^ 下单达成率^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getOrderToPlaceRatioInfo(params = {}) {
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
        window.open('/procure/Procure_list/getProcureList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/procure/Procure_list/getProcureList', data);
    }
}

//下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/procure/Procure_list/getBuyer', data);
}


//产品线数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/procure/Procure_list/getProductLine', data);
}