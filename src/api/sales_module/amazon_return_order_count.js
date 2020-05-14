/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/28 16:51
 */

/**  --->>>>   |^ 亚马逊退单统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//账号
export function getAmazonReturnOrderAccountInfo(params = {}) {
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
        window.open('/amazon/Back_charge/getSaleSummaryList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Back_charge/getSaleSummaryList', data);
    }
}

//站点
export function getAmazonReturnOrderSiteInfo(params = {}) {
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
        window.open('/amazon/Back_charge/getSiteSummaryExcel' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Back_charge/getSiteSummaryExcel', data);
    }
}


//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Back_charge/getSelectList', data);
}
