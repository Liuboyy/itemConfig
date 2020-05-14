
/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/20 16:21
 */

/**  --->>>>   |^ 目标完成情况^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

/******************************************* 团队报表 ************************************************/

export function getTeamReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/Achievement_list/getTeamData', data);
}

/******************************************* 小组报表 ************************************************/

export function getPerformanceReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/Achievement_list/reportData', data);
}

/******************************************* 目标录入 ************************************************/

//获取小组名称下拉
export function getTargetGroupList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/Achievement_list/getGroup', data);
}

//获取往期目标
export function getTargetEntryInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/Achievement_list/getHistory', data);
}

//提交目标
export function getConfirmTargetInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/achievement/Achievement_list/addTarget', data);
}
