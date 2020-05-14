/**
 * Name: 全平台listing管理
 * User: YnmauSu
 * Date: 2019/10/31
 * Time: 14:11
 *
 */

import CONFIG from '@/assets/js/config';
import { getJavaToken } from '@/api/common/index';
import http from '@/http';

// 获取列表信息
export function getAllPlamListingListInfo(params = {}) {

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
        window.open('/report/Sales_report/getSalesData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return getJavaToken('POST', `${CONFIG.JAVA_PATH}/log/yibaiListing/search`, data);
    }
}


// 获取平台信息
export function getAllPlamListingPlatformInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    return getJavaToken('POST', `${CONFIG.JAVA_PATH}/erp/platformAccount/getPlatform`, data)
}

// 获取平台信息
export function getAllPlamListingAccountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params,
    };
    return getJavaToken('POST', `${CONFIG.JAVA_PATH}/erp/platformAccount/findAccountNameByPlatformCode`, data)
}