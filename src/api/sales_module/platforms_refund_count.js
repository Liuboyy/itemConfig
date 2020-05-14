/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/26 19:34
 */

/**  --->>>>   |^ 各平台退款统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//表格
export function getPlatformsRefundFormInfo(params = {}) {
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
        window.open('/report/Platform_chargeback/getSalesExcel' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/report/Platform_chargeback/getSalesExcel', data);
    }
}

//曲线
export function getPlatformsRefundCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Platform_chargeback/getSalesStatistics', data);
}

//饼图
export function getPlatformsRefundPieInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Platform_chargeback/getSalesCake', data);
}


//获取平台下拉
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Platform_chargeback/getAllPlatform', data);
}

