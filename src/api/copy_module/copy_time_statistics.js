
/**********************************  --->>>>   |^ 文案平均耗时统计 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//文案小组
export function getCopyGroupCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/copywriter/Basic_report/getAverageTimeBYGroup' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/copywriter/Basic_report/getAverageTimeBYGroup', data);
    }
}

//产品线
export function getCopyProductLineInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/copywriter/Basic_report/getDataByLine' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/copywriter/Basic_report/getDataByLine', data);
    }
}