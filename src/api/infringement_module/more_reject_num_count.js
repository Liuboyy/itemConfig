/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/22 20:28
 */

/**  --->>>>   |^ 二次以上驳回统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//汇总
export function getMoreRejectNumSummaryInfo(params = {}) {
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
        window.open('/tort/Examine_number/getTimesTortCountList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getTimesTortCountList', data);
    }
}

//详情
export function getMoreRejectNumDetailsInfo(params = {}) {
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
        window.open('/tort/Examine_number/getTimesTortDetailList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getTimesTortDetailList', data);
    }
}

//产品线下拉数据
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tort/Examine_number/getProductLine', data);
}
