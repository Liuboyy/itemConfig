/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/22 20:08
 */

/**  --->>>>   |^ 订单完结跟进报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getOrderFollowReportInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/order_over_followup/list/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/order_over_followup/list/`, data, true, true);
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

//弹框
export function getDialogDetailsInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/order_over_followup/detail/down` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_purchase_report/order_over_followup/detail/`, data, true, true)
    }

}

