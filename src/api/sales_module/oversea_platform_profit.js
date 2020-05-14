/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/26 11:40
 */

/**  --->>>>   |^ 海外仓各平台订单利润^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getOverseaPlatformProfitInfo(params = {}) {

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
        window.open('/financereport/Finance_report/getOverseasProfit' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/financereport/Finance_report/getOverseasProfit', data);
    }
}

//获取平台下拉数据
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/getPlatform', data);
}

//获取账号下拉数据
export function getAccountList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/getAccountData', data);
}

//修改结算月份和添加备注
export function getConfirmModifyInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/editSettlement', data);
}
