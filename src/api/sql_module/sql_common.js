/**
 * Creator: KarYanLam
 * Creation Date: 2019/12/12 11:41
 */

/**  --->>>>   |^ SQL模块^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
import store from '@/store';


//页面查询
export function getSQLListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/sqlnote/title/list`, data, true, true)
}

//SQL查询
export function getSQLDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/sqlnote/detail/list`, data, true, true)
}

//新增
export function getAddSQLInfo(params = {}) {
    params.user_name = store.getters.loginInfo.user_name;
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax(`${CONFIG.BI_PATH}/yibai/zhiku/sqlnote/detail/add`, data, true, true)
}

//修改
export function getModifySQLInfo(params = {}) {
    params.user_name = store.getters.loginInfo.user_name;
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax(`${CONFIG.BI_PATH}/yibai/zhiku/sqlnote/detail/modify`, data, true, true)
}

//删除
export function getDeleteSQLInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax_BI(`${CONFIG.BI_PATH}/yibai/zhiku/sqlnote/detail/delete`, data, true, true)
}