
/**********************************  --->>>>   |^ TQE工作报表 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//日明细
export function getTqeDayDetailInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Work_report/dailyReport', data);
}

//日汇总
export function getTqeDaySummaryInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Work_report/getDataByType', data);
}

//月汇总
export function getTqeMonthSummaryInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Work_report/getDataByType', data);
}

//年度汇总
export function getTqeAnnualReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/tqe/Work_report/getDataByYears', data);
}
