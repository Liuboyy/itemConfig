/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/2 10:42
 */

/**  --->>>>   |^ 海外仓SKU基础数据^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getOverseaSkuBaseDataInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/overseas/Report_sever/getSkuReportData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Report_sever/getSkuReportData', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Report_sever/getSelectData', data);
}

//获取产品线下拉
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Report_sever/getProductLine', data);
}