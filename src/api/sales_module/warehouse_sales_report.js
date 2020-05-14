/**
 * Creator: KarYanLam
 * Creation Date: 2020/2/22 11:54
 */

/**  --->>>>   |^ 仓库销售统计报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getWarehouseSalesReportInfo(params = {}) {

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
        window.open('/report/Sales_report/getWarehouseSalesData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/report/Sales_report/getWarehouseSalesData', data);
    }
}
//平台
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getPlatformNew', data);
}