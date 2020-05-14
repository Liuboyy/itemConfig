/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/9 22:12
 */

/**  --->>>>   |^ FBA库存监控统计^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

//计量统计
export function getFbaInventoryControlMeterInfo(params = {}) {
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
        window.open('/monitor/Seller_sku/getFBAStock' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Seller_sku/getFBAStock', data);
    }
}

//金额统计
export function getFbaInventoryControlAmountInfo(params = {}) {
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
        window.open('/monitor/Seller_sku/getFBAMoney' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Seller_sku/getFBAMoney', data);
    }
}

//种类统计
export function getFbaInventoryControlTypeInfo(params = {}) {
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
        window.open('/monitor/Seller_sku/getFBAType' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Seller_sku/getFBAType', data);
    }
}

//获取站点下拉数据
export function getSiteList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Seller_sku/getSite', data);
}

//获取产品状态下拉数据
export function getProductStatusList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Seller_sku/getProductStatus', data);
}

//获取产品线下拉数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Seller_sku/getProductLine', data);
}


//获取开发类型下拉数据
export function getDevTyoeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Seller_sku/getDevelopType', data);
}