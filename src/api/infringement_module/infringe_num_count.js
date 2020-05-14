/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 17:59
 */

/**  --->>>>   |^ 审核数量统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//小组汇总
export function getInfringeGroupSummaryInfo(params = {}) {
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
        window.open('/tort/Examine_number/getGroupCountList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getGroupCountList', data);
    }
}

//小组详情
export function getInfringeGroupDetailsInfo(params = {}) {
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
        window.open('/tort/Examine_number/getGroupDetailList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/tort/Examine_number/getGroupDetailList', data);
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
