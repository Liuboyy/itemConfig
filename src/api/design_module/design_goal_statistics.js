
/**********************************  --->>>>   |^ 设计组目标完成统计 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getDesignGroupGoalStatisticsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Design_work_report/getTargetStatistics' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Design_work_report/getTargetStatistics', data);
    }
}

