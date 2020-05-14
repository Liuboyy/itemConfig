
/**********************************  --->>>>   |^ 摄影平均耗时统计 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//摄影小组
export function getPhotoGroupTimeCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Photo_avg_time_report/getAvgTimeByGroup' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Photo_avg_time_report/getAvgTimeByGroup', data);
    }
}

//任务类型
export function getPhotoTaskTypeTimeCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Photo_avg_time_report/getAvgTimeByTask' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Photo_avg_time_report/getAvgTimeByTask', data);
    }
}

//产品线
export function getPhotoProductLineTimeCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Photo_avg_time_report/getAvgTimeByLine' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Photo_avg_time_report/getAvgTimeByLine', data);
    }
}
