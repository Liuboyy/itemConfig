/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/3 9:35
 */

/**  --->>>>   |^ 订单执行时效^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//日统计
export function getOrderExecutionAgingDayInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        if(data.detail_type === 1) {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/consuming/Consuming_list/exportDetailAllB2C' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/consuming/Consuming_list/getDataByDay' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getDataByDay', data);
    }
}

//周统计
export function getOrderExecutionAgingWeekInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        if(data.detail_type === 2){
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/consuming/Consuming_list/exportDetailAllB2C' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/consuming/Consuming_list/getDataByWeek' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getDataByWeek', data);
    }
}

//月统计
export function getOrderExecutionAgingMonthInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        if(data.detail_type === 3) {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/consuming/Consuming_list/exportDetailAllB2C' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/consuming/Consuming_list/getDataByMonth' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getDataByMonth', data);
    }
}

//获取平台下拉数据
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getPlatform', data);
}

//获取订单状态、物流商、发货大仓下拉数据
export function getComOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getStatus', data);
}

//获取站点下拉数据
export function getSiteList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getCountry', data);
}

//根据平台获取账号
export function getAccountListByPlatform(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getAccount', data);
}

//根据物流商获取物流方式
export function getLogisticsWayByCompany(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getRealShip', data);
}

//根据发货大仓获取发货仓库
export function getShipWarehouseByBigHouse(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getWarehouse', data);
}

//获取明细信息
export function getPreviewDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/consuming/Consuming_list/getOrderDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getOrderDetail', data);
    }
}



