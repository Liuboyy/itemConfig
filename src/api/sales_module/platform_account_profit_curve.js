/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/4 17:03
 */

/**  --->>>>   |^ 平台账号利润曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getPlatformAccountProfitCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/platform/Platform_account/getProfitCurveData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Platform_account/getProfitCurveData', data);
    }
}
