/**
 * Creator: KarYanLam
 * Creation Date: 2020/4/8 15:57
 */

/**  --->>>>   |^ 报表BR曲线^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';
//曲线
export function getBrStatementCurveInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Account_br/getSaleSummary', data);
}

//获取树形菜单
export function getTreeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/report/Account_br/getSelectList', data);
}