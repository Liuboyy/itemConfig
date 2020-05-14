/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 16:21
 */

/**  --->>>>   |^ 海外核心SKU周统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//海外仓sku
export function getOverseaSkuWeekReportInfo(params = {}) {
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
        window.open('/overseas/Overseas_week/getOverseasData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_week/getOverseasData', data);
    }
}

//海外核心sku
export function getCoreOverseaSkuWeekReportInfo(params = {}) {
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
        window.open('/overseas/Overseas_week/getCoreOverseasData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_week/getCoreOverseasData', data);
    }
}

//获取平台
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Overseas_week/getPlatform', data);
}