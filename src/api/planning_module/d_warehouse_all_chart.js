/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/25 20:13
 */

/**  --->>>>   |^ 国内仓各项推移图^|   <<<<---**/



import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getDWarehouseAllChartInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/transitionmap/Overseas_four/getDomesticSales', data);
}