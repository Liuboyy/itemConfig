/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/4 17:02
 */

/**  --->>>>   |^ 平台账号销售曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getPlatformAccountSalesCurveInfo(params = {}) {
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
        window.open('/platform/Platform_account/getCurveData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Platform_account/getCurveData', data);
    }
}

//获取树形数据
export function getTreeDataList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/platform/Platform_account/getTreeData', data);
}
