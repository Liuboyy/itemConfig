
/**********************************  --->>>>   |^ 设计部任务汇总统计 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getDesignTaskCountInfo(params = {}) {
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
        window.open('/design/Task_summary/summaryStatistics' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Task_summary/summaryStatistics', data);
    }
}
