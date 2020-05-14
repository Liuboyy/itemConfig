
/**********************************  --->>>>   |^ 设计组工作报表 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//小组汇总
export function getDesignGroupSummaryReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Design_work_report/getGroupData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Design_work_report/getGroupData', data);
    }
}

//小组详情
export function getDesignGroupDetailsReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Design_work_report/getGroupDetailData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Design_work_report/getGroupDetailData', data);
    }
}

//超时SPU明细
export function getSpuOvertimeDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/design/Design_work_report/getOverdueDetail', data);
}

//返工SPU明细
export function getSpuRejectWorkDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/design/Design_work_report/getReworkDetail', data);
}

//人员明细
export function getStaffDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/design/Design_work_report/getPersonDetailData', data);
}

//图片张数明细
export function getPictureNumberDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Design_work_report/getPictureDetailData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Design_work_report/getPictureDetailData', data);
    }
}


