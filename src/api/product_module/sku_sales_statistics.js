/**
 * Creator: KarYanLam
 * Creation Date: 2019/8/27 14:50
 */

/**  --->>>>   |^ SKU销售统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//产品线维度
export function getProductLineCountInfo(params = {}) {
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
        window.open('/skureport/Sku_report/getSkuReportData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax('/skureport/Sku_report/getSkuReportData', data);
    }
}

//SKU维度
export function getSkuSalesCountInfo(params = {}) {
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
        window.open('/skureport/Sku_report/getSkuDimensionData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/skureport/Sku_report/getSkuDimensionData', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/skureport/Sku_report/getPlatform', data);
}

//获取产品线数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/skureport/Sku_report/getProductLine', data);
}