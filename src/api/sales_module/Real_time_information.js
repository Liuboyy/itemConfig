/**  --->>>>   |^ 销售统计数据报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getRealtimeinformation(params = {}) {

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
        window.open('/monitor/Plan_purchase/getDataRealTime' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getDataRealTime', data);
    }
}

//获取平台下拉数据
export function getRealtimeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Plan_purchase/getSelectData', data);
}

// 查看seller_sku
export function getRealSellerskuList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Plan_purchase/getRealSeller' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getRealSeller', data);
    }
}


//获取PR数量(采购处理中)明细
export function getPickingList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Plan_purchase/getPickingList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getPickingList', data);
    }
}

//获取在途(待财务付款)明细
export function getOnwayList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Plan_purchase/getOnwayList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getOnwayList', data);
    }
}

//获取采购在途明细
export function getPurchaseOnway(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Plan_purchase/getPurchaseOnway' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getPurchaseOnway', data);
    }
}

//获取调拨在途明细
export function getAllotOnway(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Plan_purchase/getAllotOnway' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getAllotOnway', data);
    }
}
