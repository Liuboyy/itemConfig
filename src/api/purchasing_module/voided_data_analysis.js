/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/25 2:21
 */

/**  --->>>>   |^ 作废数据分析^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getVoidedDataAnalysisInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_invalid_dwon/list/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_invalid/list/`, data, true, true);
    }
}

//下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_query/`, data, true, true)
}

//汇总
export function getVoidedAnalysisSumInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/pur_invalid_sum/`, data, true, true);
}