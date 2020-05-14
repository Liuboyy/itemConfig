/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/31 20:27
 */

/**  --->>>>   |^ 售后渠道监控^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
import qs from 'qs';
import { postExcelFile } from '@/services';

export function getAfterSalesMonitoringInfo(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/order_after_sale/after_sales_monitoring/list/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({

                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_after_sale/after_sales_monitoring/list/`, data, true, true);
    }
}

//弹框接口
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/order_after_sale/after_sales_monitoring/query/`, data, true, true)
}