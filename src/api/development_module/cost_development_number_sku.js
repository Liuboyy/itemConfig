
/**********************************  --->>>>   |^ 各成本区间SKU开发数 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//开发小组
export function getCostNumberSkuDevGroupInfo(params = {}) {
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
        window.open('/development/Price_range_qty_sku/getDataByGroup' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty_sku/getDataByGroup', data);
    }
}

//开发人员
export function getCostNumberSkuDeveloperInfo(params = {}) {
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
        window.open('/development/Price_range_qty_sku/getDataByUser' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty_sku/getDataByUser', data);
    }
}

//开发类型
export function getCostNumberSkuDevTypeInfo(params = {}) {
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
        window.open('/development/Price_range_qty_sku/getDataByDevType' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty_sku/getDataByDevType', data);
    }
}

//产品线
export function getCostNumberSkuProductLineInfo(params = {}) {
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
        window.open('/development/Price_range_qty_sku/getDataByLine' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/development/Price_range_qty_sku/getDataByLine', data);
    }
}

//获取下拉数据
export function getCostSkuOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/development/Price_range_qty_sku/getDropDownData', data);
}