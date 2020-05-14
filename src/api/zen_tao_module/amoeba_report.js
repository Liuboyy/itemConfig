/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/28 11:30
 */

/**  --->>>>   |^ 阿米巴报表^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//工时统计
export function getAmoebaReportSummaryInfo(params = {}) {
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
        window.open('/zentao/Zentao_detail/getCountList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/zentao/Zentao_detail/getCountList', data);
    }
}

//需求明细
export function getAmoebaReportDetailInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    // 查询参数带is_excel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${(!data[key] && data[key] !== 0) ?  '' : data[key]}`;
        }
        window.open('/zentao/Zentao_detail/getDetailList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/zentao/Zentao_detail/getDetailList', data);
    }
}

//配置
export function getAmoebaReportConfigInfo(params = {}) {
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
        window.open('/zentao/Zentao_detail/getConfigDataList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/zentao/Zentao_detail/getConfigDataList', data);
    }
}

//更新明细
export function getUpDateDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/zentao/Zentao_detail/editDetailList', data);
}

//获取部门下拉
export function getDepartmentList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/zentao/Zentao_detail/getDept', data);
}

//获取项目需求下拉
export function getOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/zentao/Zentao_detail/getRequirement', data);
}

//配置提交
export function getConfirmConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/zentao/Zentao_detail/editConfigList', data);
}
