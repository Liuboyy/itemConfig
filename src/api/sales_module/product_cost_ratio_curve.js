/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/17 17:52
 */

/**  --->>>>   |^ 产品成本CNY及占比曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getProductCostRatioCurveInfo(params = {}) {
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
        window.open('/platform/Ali_product_cost/getProductCurveData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/platform/Ali_product_cost/getProductCurveData', data);
    }
}

//获取树形数据
export function getTreeDataList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/platform/Ali_product_cost/getTreeData', data);
}
