
/**********************************  --->>>>   |^ 样品审核报表 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//日明细
export function getSampleDayDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Sample_audit_report/dailyReport', data);
}

//日汇总、月汇总
export function getSampleDayAndMonthSummaryInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Sample_audit_report/getDataByType', data);
}

//年度报表
export function getSampleAnnualReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Sample_audit_report/getDataByYears', data);
}