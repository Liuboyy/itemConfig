/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 17:04
 */

/**  --->>>>   |^ 国内核心SKU周统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//国内仓sku
export function getDomesticSkuWeekInfo(params = {}) {
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
        window.open('/overseas/Overseas_week/getDomesticData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_week/getDomesticData', data);
    }
}

//国内核心sku
export function getCoreDomesticSkuWeekInfo(params = {}) {
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
        window.open('/overseas/Overseas_week/getCoreDomesticData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_week/getCoreDomesticData', data);
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