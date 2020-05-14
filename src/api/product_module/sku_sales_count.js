/**
 * Creator: KarYanLam
 * Creation Date: 2019/8/9 21:17
 */

/**  --->>>>   |^ SKU销量统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSkuSalesCountInfo(params = {}) {
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
        window.open('/product/Sku_sale_summary/getSkuSaleSummary' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax('/product/Sku_sale_summary/getSkuSaleSummary', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/product/Sku_sale_summary/getDropDownList', data);
}