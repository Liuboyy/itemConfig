/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/11/27
 * Time: 16:42
 *
 */

import CONFIG from '@/assets/js/config';
import http from '@/http';
import qs from 'qs';
import { postExcelFile } from '@/services';

export function getSoutheastAsiaList(params = {}) {
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
        window.open(`${CONFIG.BI_PATH}/yibai/zhiku/listing/southeast_asia_4listing/list1/` + str, '_self');
        // postExcelFile(data, `${CONFIG.BI_PATH}/yibai/zhiku/order/timeout/count_statistics/down/`);
        return new Promise((resolve => {
            resolve({

                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax(`${CONFIG.BI_PATH}/yibai/zhiku/listing/southeast_asia_4listing/list1/`, data, true, true);
    }
}

// 获取下拉
export function getOptionInfo(params = {}) {
    const data = {
        ...params
    };
    return http.getAjax(`${CONFIG.BI_PATH}/yibai/zhiku/listing/southeast_asia_4listing/query/`, data, true, true)
}

// 获取详情信息
export function getDetailInfo(params = {}) {
    const data = {
        ...params
    };
    return http.getAjax(`${CONFIG.BI_PATH}/yibai/zhiku/listing/southeast_asia_4listing/list2/`, data, true, true)
}

// 获取提示弹框信息
export function getTipDialogInfo(params = {}) {
    const data = {
        ...params
    };
    return http.getAjax(`${CONFIG.BI_PATH}/yibai/zhiku/listing/southeast_asia_4listing/list2/`, data, true, true)
}