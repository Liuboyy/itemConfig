/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/24 16:51
 */

/**  --->>>>   |^ 30日销库金额^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//销量
export function getSalesMonthSoldAmountInfo(params = {}) {
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
        window.open('/transitionmap/Sales_stock/getTrendMoney' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/transitionmap/Sales_stock/getTrendMoney', data);
    }
}

//占比
export function getSalesMonthSoldRatioInfo(params = {}) {
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
        window.open('/transitionmap/Sales_stock/getTrendMoneyRatio' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/transitionmap/Sales_stock/getTrendMoneyRatio', data);
    }
}
