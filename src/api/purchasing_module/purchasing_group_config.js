/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/15 13:58
 */

/**  --->>>>   |^ 采购组别配置^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

/*****************************************             用户配置           **********************************/
export function getUserConfigListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/purchase/Buyer/getRelationData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/purchase/Buyer/getRelationData', data);
    }
}

//启用禁用
export function getUserChangeStatusInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/updateRelationStatus', data);
}

//小组下拉
export function getUserGroupOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/getGroupDropDownList', data);
}

//采购员下拉
export function getBuyerOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/getUserSelectList', data);
}

//编辑提交
export function getUserConfirmModifyInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/updateGroupRelation', data);
}



/*****************************************             小组配置           **********************************/
export function getGroupConfigListInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带isExcel为导出
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/purchase/Buyer/getGroupData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/purchase/Buyer/getGroupData', data);
    }
}

//启用禁用
export function getGroupChangeStatusInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/updateGroupStatus', data);
}

//新增小组
export function getGroupAddInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/addGroup', data);
}

//编辑小组
export function getGroupModifyInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/editGroup', data);
}

//获取所有用户
export function getUserOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/getUserDropDownList', data);
}

//添加用户
export function getAddUserConfigList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/addUserTG', data);
}

//删除用户
export function getDeleteUserConfigList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/delUserFG', data);
}

//查看
export function getPreviewUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/purchase/Buyer/getUserData', data);
}