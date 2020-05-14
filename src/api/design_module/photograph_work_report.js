
/**********************************  --->>>>   |^ 摄影工作报表 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//小组汇总
export function getPhotoGroupSummaryReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Photo_work_report/getGroupData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Photo_work_report/getGroupData', data);
    }
}

//小组详情
export function getPhotoGroupDetailsReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Photo_work_report/getGroupDetailData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Photo_work_report/getGroupDetailData', data);
    }
}

//SPU超时明细
export function getSpuOvertimeDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/design/Photo_work_report/getSpuOvertimeData', data);
}

//SPU返工明细
export function getSpuRejectWorkDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/design/Photo_work_report/getSpuReworkData', data);
}

