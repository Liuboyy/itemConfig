/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/5 22:09
 */

/**  --->>>>   |^ 产品权限配置^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

/*************************************** 用户配置******************************************/
// 列表
export function getProductUserConfigInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/userList', data);
}

//获取下拉数据---角色名称
export function getRoleNameList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/getRule', data);
}

//获取下拉数据---用户名
export function getUserNameList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/getUser', data);
}

//获取下拉数据---产品线
export function getProductLineList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Amazon_authority/getProductLine', data);
}

//获取下拉数据---开发人员
export function getDeveloperList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/getDeveloper', data);
}

//获取下拉数据---平台
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/getPlatform', data);
}

//获取下拉数据---新增用户名（树状）
export function getAddUserNameTreeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/getUserTree', data);
}

//启用禁用
export function getSetStatusInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/setEnable', data);
}

//获取编辑页面数据
export function getEditConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/editData', data);
}

//新增、编辑提交数据
export function getConfirmConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Amazon_authority/addPersonalPower', data);
}

//批量授权提交数据
export function getBatchApplyConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Amazon_authority/batchEdit', data);
}

//查看
export function getPreviewConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Amazon_authority/userView', data);
}

/*************************************** 角色配置 ******************************************/
// 列表
export function getProductRoleConfigInfo(params = {}) {
    const data = {
        offset: 1,
        limit: 20,
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/roleList', data);
}

//启用禁用
export function getSetStatusRoleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/setRoleEnable', data);
}

//获取编辑页面数据
export function getEditConfigRoleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/roleEditData', data);
}

//新增保存
export function getAddConfirmRoleConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Amazon_authority/roleSet', data);
}

//编辑保存
export function getEditConfirmRoleConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/authority/Amazon_authority/roleEditUpload', data);
}

//添加角色用户下拉数据
export function getAddRoleNameTreeList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/rolePersonTree', data);
}

//获取当前角色的角色用户
export function getRoleUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/roleUser', data);
}

//保存添加/删除角色用户
export function getConfirmRoleUserInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/addUser', data);
}

//查看
export function getPreviewConfigRoleInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/authority/Amazon_authority/roleView', data);
}