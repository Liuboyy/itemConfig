/**
 * Creator: KarYanLam
 * Creation Date: 2019/8/12 17:34
 */

/**  --->>>>   |^ 仓库损益统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//仓库损益统计
export function getWarehouseProfitAndLossCountInfo(params = {}) {
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
        window.open('/storehouse/Store_report/getStoreReport' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/storehouse/Store_report/getStoreReport', data);
    }
}

//仓库损益统计
export function getWarehouseProfitAndLossDetailsInfo(params = {}) {
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
        window.open('/storehouse/Store_report/getStoreReportDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/storehouse/Store_report/getStoreReportDetail', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/storehouse/Store_report/getTypeData', data);
}