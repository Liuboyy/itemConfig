/**
 * Creator: KarYanLam
 * Creation Date: 2020/2/25 9:33
 */

/**  --->>>>   |^ 物流SKU尺寸核对^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getLogisticsSkuCheckInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/warehouse/Sku_diff_list/getSkuDiffList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/warehouse/Sku_diff_list/getSkuDiffList', data);
    }
}

