/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/24 11:23
 */

/**  --->>>>   |^ CD渠道发货分布曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getCdChannelSpreadCurveInfo(params = {}) {
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
        window.open('/platform/Cd_product_cost/getCdChannelCurveData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Cd_product_cost/getCdChannelCurveData', data);
    }
}

//获取树形数据
export function getTreeDataList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/platform/Cd_product_cost/getTreeData', data);
}
