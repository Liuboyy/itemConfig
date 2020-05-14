/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/31 18:48
 */

/**  --->>>>   |^ 海外仓SKU统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//海外仓sku
export function getOverseaSkuReportInfo(params = {}) {
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
        window.open('/overseas/Overseas_sku/getOverseasData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_sku/getOverseasData', data);
    }
}

//海外核心sku
export function getCoreOverseaSkuReportInfo(params = {}) {
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
        window.open('/overseas/Overseas_sku/getCoreOverseasData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_sku/getCoreOverseasData', data);
    }
}

//获取平台
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/overseas/Overseas_sku/getPlatform', data);
}