/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/22 9:25
 */

/**  --->>>>   |^ 驳回次数统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//驳回汇总
export function getRejectSummaryInfo(params = {}) {
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
        window.open('/tort/Examine_number/getTortCountList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getTortCountList', data);
    }
}

//驳回详情
export function getRejectDetailsInfo(params = {}) {
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
        window.open('/tort/Examine_number/getTortDetailList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getTortDetailList', data);
    }
}


//产品线驳回详情
export function getRejectDetailsProductLineInfo(params = {}) {
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
        window.open('/tort/Examine_number/getDevelopTortDetailList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getDevelopTortDetailList', data);
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
