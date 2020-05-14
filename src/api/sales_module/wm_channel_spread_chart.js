/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/27 20:21
 */

/**  --->>>>   |^ Walmart渠道发货分布图^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getWalmartChannelSpreadChart(params = {}) {
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
        window.open('/platform/Walt_product_cost/getCdChannelCurveData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Walt_product_cost/getCdChannelCurveData', data);
    }
}

//获取树形数据
export function getTreeDataList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/platform/Walt_product_cost/getTreeData', data);
}
