/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/29 15:26
 */

/**  --->>>>   |^ listing链接统计^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getListingLinkCountInfo(params = {}) {
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
        window.open('/amazon/Sale_summary/getListingLinkData' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Sale_summary/getListingLinkData', data);
    }
}


//获取树下拉
export function getGroupOptionList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getTeamTree', data);
}
