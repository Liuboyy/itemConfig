/**
 * Created by Administrator on 2019/5/28.
 */
/**
 * 销售统计曲线报表
 */
import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getSalesCountReportInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Sales_report/getSalesStatistics', data);
}