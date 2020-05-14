/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/17 17:02
 */

/**  --->>>>   |^ 国内仓SKU统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//国内仓sku
export function getDomesticSkuReportInfo(params = {}) {
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
        window.open('/overseas/Overseas_sku/getDomesticData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_sku/getDomesticData', data);
    }
}

//国内核心sku
export function getCoreDomesticSkuReportInfo(params = {}) {
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
        window.open('/overseas/Overseas_sku/getCoreDomesticData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/overseas/Overseas_sku/getCoreDomesticData', data);
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