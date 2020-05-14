/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/17 11:56
 */

/**  --->>>>   |^ 各国FBA库存分析^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getNationalFbaInventoryAnalysis(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getFbaAnalysisData', data);
}