/**
 * Created by Administrator on 2019/5/28.
 */
/**
 * 刊登销售统计
 */
import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getPublishSalesCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };

    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/amazon/Sale_summary/getPublishPerformance' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Sale_summary/getPublishPerformance', data);
    }
}