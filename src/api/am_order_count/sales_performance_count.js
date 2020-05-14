/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/4/27
 * Time: 16:26
 *
 */
import CONFIG from '@/assets/js/config';
import http from '@/http';
export function getSalesPerformanceCountInfo(params = {}) {
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
        window.open('/amazon/Sale_summary/getSalesPerformance' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Sale_summary/getSalesPerformance', data);
    }
}

//业绩排名统计
export function getSalesPerformanceRankingInfo(params = {}) {
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
        window.open('/ranking/Rank_report/getRankReport' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/ranking/Rank_report/getRankReport', data);
    }
}

//业绩明细

export function getSalesPerformanceDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/ranking/Rank_report/getRankDetail', data);
}