/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/23 11:01
 */

/**  --->>>>   |^ Ebaylisting链接统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getEbayListingLinkCountInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };

    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/ebaylisting/ebay_listing/getEbayListingData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/ebaylisting/ebay_listing/getEbayListingData', data);
    }
}


//获取大仓和仓库
export function getWarehouseOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/ebaylisting/ebay_listing/getStoreData', data);
}


//获取组织树下拉
export function getOrganizationList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/ebaylisting/ebay_listing/getOrganizeTree', data);
}

//获取明细数据
export function getDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    // 查询参数带isExcel为导出
    if (data.is_excel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/ebaylisting/ebay_listing/getEbayListingDetailData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/ebaylisting/ebay_listing/getEbayListingDetailData', data);
    }
}
