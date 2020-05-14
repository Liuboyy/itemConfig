/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/12 9:40
 */

/**  --->>>>   |^ 销售统计数据报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSalesDataReportInfo(params = {}) {

    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/report/Sales_report/getSalesData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/report/Sales_report/getSalesData', data);
    }
}

//获取平台下拉数据
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getAllPlatform', data);
}