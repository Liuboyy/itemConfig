/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/8/22
 * Time: 17:27
 *
 */
import CONFIG from '@/assets/js/config';
import http from '@/http';
import qs from 'qs';
import { postExcelFile } from '@/services';

export function getExceptionOrderInfo(params = {}) {
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
        // postExcelFile(data, `${CONFIG.BI_PATH}/yibai/zhiku/order/abnormal/count_statistics/down/`);
        window.open(`${CONFIG.BI_PATH2}/yibai/zhiku/order/abnormal/count_statistics/down/` + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/order/abnormal/count_statistics/`, data, true, true);
    }
}

// 获取明细信息
export function getDetailInfo(params = {}) {
    const data = {
        page: 1,
        count: 20,
        ...CONFIG.ajaxData,
        ...params,
    };
    return http.postAjax(`${CONFIG.BI_PATH2}/yibai/zhiku/order/abnormal/count_statistics_detail/`, data, true, true)
}
