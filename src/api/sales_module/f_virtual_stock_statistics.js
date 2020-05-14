/**  --->>>>   |^ FBA断货表格^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getstatisticsIfon(params = {}) {

    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/transitionmap/Overseas_four/getDailyExcel' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/transitionmap/Overseas_four/getDailyExcel', data);
    }
}
