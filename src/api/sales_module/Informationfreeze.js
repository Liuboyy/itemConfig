/**  --->>>>   |^ 销售统计数据报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getInformationfreeze(params = {}) {

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
        window.open('/monitor/Plan_purchase/getDataList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getDataList', data);
    }
}

//获取平台下拉数据
export function getInformationList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Plan_purchase/getSelectData', data);
}

// 查看seller_sku
export function getinformsellersku(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/monitor/Plan_purchase/getSellerSku' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/monitor/Plan_purchase/getSellerSku', data);
    }
}