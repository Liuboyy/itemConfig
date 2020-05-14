/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/18 10:13
 */

/**  --->>>>   |^ listing动销曲线^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//列表数据
export function getListingMoveCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getDynamicData', data);
}

// 获取树形菜单列表
export function getTreeMenuListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getCurveTree', data);
}

// 获取所有信息
export function getAllInfo(params = {}) {
    const data= {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getCurveData', data);
}

// 获取所有团队
export function getAllTeamInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getTeamCurveData', data);
}

// 获取所有小组
export function getAllGroupInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getGroupCurveData', data);
}

// 获取所有账号
export function getAllAccountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getAccountCurveData', data);
}


// 月查询曲线
export function getMonthCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/dynamicsale/Dynamic_sale/getMonthCurveData', data);
}