import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getStatiscalReportInfo(params = {}) {
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
        window.open('/warehouse/Ware_statistics_report/getWareReport' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/warehouse/Ware_statistics_report/getWareReport', data);
    }
}
