/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/2 11:42
 */

/**  --->>>>   |^ 物流时效统计^|   <<<<---**/


import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getLogisticsAgingCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/logistics/Timeliness/getOrderReport' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/logistics/Timeliness/getOrderReport', data);
    }
}

//一级下拉框数据
export function getOneLevelList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/logistics/Timeliness/getStore', data);
}

//二级下拉框数据
export function getSecondLevelList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/logistics/Timeliness/getSecondStore', data);
}
