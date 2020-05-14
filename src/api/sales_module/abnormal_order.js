/**  --->>>>   |^ 销售统计数据报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getAbnormalorder(params = {}) {

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
        window.open('/orderlack/Unusual_order/getUnusualOrder' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/orderlack/Unusual_order/getUnusualOrder', data);
    }
}

//获取平台下拉数据
export function getdropdownList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/orderlack/Unusual_order/getSelectData', data);
}

//获取明细数据
export function getAbnormalDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/orderlack/Unusual_order/getUnusualOrderDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/orderlack/Unusual_order/getUnusualOrderDetail', data);
    }
}