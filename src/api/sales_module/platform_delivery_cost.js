/**
 * Creator: KarYanLam
 * Creation Date: 2019/9/25 20:11
 */

/**  --->>>>   |^ 各平台成交费^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';

export function getPlatformDeliveryCostInfo(params = {}) {

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
        window.open('/financereport/Finance_report/getList' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/financereport/Finance_report/getList', data);
    }
}

//获取平台下拉数据
export function getPlatformList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/getPlatform', data);
}

//保存编辑
export function getCostConfirmInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/editList', data);
}

//批量删除
export function getBatchDeleteInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/delList', data);
}

//下载模板
export function getDownLoadList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/getAddress', data);
}

//获取导入进度
export function getImportProgressInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/financereport/Finance_report/getProgressBar', data);
}