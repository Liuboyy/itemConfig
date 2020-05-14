/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/23 14:32
 */

/**  --->>>>   |^ 到货时间分布(国内&FBA)^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getArrivalDomesticAndFbaInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/cn_fba_goods_time/list/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/cn_fba_goods_time/list/`, data, true, true);
    }
}

//下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report_query/`, data, true, true)
}

//产品线数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/procure/Procure_list/getProductLine', data);
}

