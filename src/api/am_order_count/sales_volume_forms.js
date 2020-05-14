/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/4/25
 * Time: 14:51
 *
 */
import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getSalesVolumeFormsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getSaleSummary', data);
}