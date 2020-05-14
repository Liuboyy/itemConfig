/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/23 15:43
 */

/**  --->>>>   |^ B2B订单时效^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//日统计
export function getB2BOrderAgingDayInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        if(data.detail_type === 1) {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${data[key] || ''}`;
            }
            window.open('/consuming/Consuming_list/exportDetailAll' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${data[key] || ''}`;
            }
            window.open('/consuming/Consuming_list/getB2BDataByDay' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getB2BDataByDay', data);
    }
}

//周统计
export function getB2BOrderAgingWeekInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        if(data.detail_type === 2){
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${data[key] || ''}`;
            }
            window.open('/consuming/Consuming_list/exportDetailAll' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${data[key] || ''}`;
            }
            window.open('/consuming/Consuming_list/getB2BDataByWeek' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getB2BDataByWeek', data);
    }
}

//月统计
export function getB2BOrderAgingMonthInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        if(data.detail_type === 3) {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${data[key] || ''}`;
            }
            window.open('/consuming/Consuming_list/exportDetailAll' + str, '_self');
        }else {
            let str = '?';
            for (let key in data) {
                str = `${str}&${key}=${data[key] || ''}`;
            }
            window.open('/consuming/Consuming_list/getB2BDataByMonth' + str, '_self');
        }
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getB2BDataByMonth', data);
    }
}

//获取平台类型下拉数据
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/consuming/Consuming_list/getPlatformType', data);
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
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/consuming/Consuming_list/getB2BOrderDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/consuming/Consuming_list/getB2BOrderDetail', data);
    }
}