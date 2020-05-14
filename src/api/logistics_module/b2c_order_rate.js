/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/26 17:31
 */

/**  --->>>>   |^ B2C订单执行率^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//日统计
export function getOrderRateDayCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        if(data.detail_type === 1) {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/logistics/Order_efficiency/exportB2cDetailAll' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/logistics/Order_efficiency/getB2cDataByDay' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/logistics/Order_efficiency/getB2cDataByDay', data);
    }
}

//周统计
export function getOrderRateWeekCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        if(data.detail_type === 2){
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/logistics/Order_efficiency/exportB2cDetailAll' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/logistics/Order_efficiency/getB2cDataByWeek' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/logistics/Order_efficiency/getB2cDataByWeek', data);
    }
}

//月统计
export function getOrderRateMonthCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        if(data.detail_type === 3) {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/logistics/Order_efficiency/exportB2cDetailAll' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
            }
            window.open('/logistics/Order_efficiency/getB2cDataByMonth' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/logistics/Order_efficiency/getB2cDataByMonth', data);
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
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/logistics/Order_efficiency/getB2cOrderDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/logistics/Order_efficiency/getB2cOrderDetail', data);
    }
}

//获取是否缺货、站点下拉数据
export function getOtherOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/logistics/Order_efficiency/getDropDownData', data);
}