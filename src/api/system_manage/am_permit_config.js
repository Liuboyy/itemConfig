/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/5/20
 * Time: 15:03
 *
 */

import CONFIG from '@/assets/js/config';
import http from '@/http';

/************************************************* 用户配置 **************************************************/

// 获取亚马逊权限配置信息
export function getAmPermitUserConfigListInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getAccountList', data);
}

// 获取分配团队下拉
export function getAllotTeamOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getTeam', data);
}

// 获取小组下拉
export function getGroupOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getGroup', data);
}

// 获取账号下拉
export function getAccountOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getAccount', data);
}

// 获取用户下拉
export function getUserOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/addAuthority', data);
}

// 保存编辑信息
export function saveEditorInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Authority_list/saveEditData', data);
}

// 获取编辑信息
export function getEditorInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getEditData', data);
}

// 根据部门获取用户下拉数据
export function getUserBlToDevInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getUser', data);
}

// 获取部门下拉
export function getDepartmentOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getDepartment', data);
}

// 修改状态
export function changeState(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Authority_list/startUsing', data);
}

// 查看详情
export function getPreviewAmUserConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/viewData', data);
}

/************************************************* 角色配置 **************************************************/

export function getAmPermitRoleConfigListInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/roleList', data);
}

// 获取角色用户下拉
export function getAmRoleUserList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getAllUser', data);
}

// 获取角色名称下拉
export function getAmRoleNameList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/getRule', data);
}

// 查看详情
export function getPreviewAmRoleConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/roleView', data);
}

// 启用禁用
export function getAmChangeStatusInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/setRoleEnable', data);
}

// 新增角色
export function getAmAddRoleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Authority_list/addRole', data);
}

// 获取编辑数据
export function getAmRoleEditData(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/roleEditData', data);
}

// 保存编辑数据
export function getAmModifyRoleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Authority_list/updateRoleEdit', data);
}


//添加角色用户下拉数据
export function getAmAddRoleNameTreeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/rolePersonTree', data);
}

//获取当前角色的角色用户
export function getAmRoleUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/roleUser', data);
}

//保存添加/删除角色用户
export function getAmConfirmRoleUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Authority_list/addUser', data);
}

