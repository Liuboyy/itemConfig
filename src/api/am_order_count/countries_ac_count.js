/**
 * Name: 各国业绩统计
 * User: YnmauSu
 * Date: 2019/4/26
 * Time: 20:58
 *
 */
import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getCountriesAcCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getSaleSummaryByCountry', data);
}