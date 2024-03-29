/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/21 16:14
 */

/**  --->>>>   |^ 费用统计报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getCostStatisticsReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/report/Cost_census/getListData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/report/Cost_census/getListData', data);
    }
}
