/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/18 22:19
 */

/**  --->>>>   |^ IT费用清单^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';

//服务器费用
export function getServerCostsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/zentao/Cost_list/getExcelList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/zentao/Cost_list/getExcelList', data);
    }
}

//其他费用
export function getOtherCostsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/zentao/Cost_list/getOtherFeeList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/zentao/Cost_list/getOtherFeeList', data);
    }
}

//获取下拉数据
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/zentao/Cost_list/getOtherFeeSelect', data);
}

//批量新增其他费用
export function addOtherCostsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/zentao/Cost_list/addOtherFee', data);
}

//单条编辑其他费用
export function editOtherCostsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/zentao/Cost_list/editOtherFee', data);
}

//批量删除
export function deleteOtherCostsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.postAjax('/zentao/Cost_list/delOtherFee', data);
}

//获取下拉数据
export function getServerOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/zentao/Cost_list/getExcelSelect', data);
}