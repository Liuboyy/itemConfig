/**
 * Creator: KarYanLam
 * Creation Date: 2020/4/10 16:31
 */

/**  --->>>>   |^ 东南亚目标完成统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

/******************************************* 小组报表 ************************************************/

export function getSouthGroupReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/South_achievement/getGroupData', data);
}

/******************************************* 账号报表 ************************************************/

export function getSouthAccountReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/South_achievement/accountReportData', data);
}

/******************************************* 目标录入 ************************************************/

//获取平台下拉
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/South_achievement/getPlatform', data);
}

//根据平台获取账号和小组
export function getAccountAndGroupList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/South_achievement/getAccountGroup', data);
}

//获取往期目标
export function getTargetEntryInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/achievement/South_achievement/getHistory', data);
}

//提交目标
export function getConfirmTargetInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/achievement/South_achievement/addTarget', data);
}
