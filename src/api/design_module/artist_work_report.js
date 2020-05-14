
/**********************************  --->>>>   |^ 美工工作报表 ^|   <<<<---*****************************/

import CONFIG from '@/assets/js/config';
import http from '@/http';

//小组汇总
export function getArtistGroupSummaryReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Art_workreport/getArtSummary' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Art_workreport/getArtSummary', data);
    }
}

//小组详情
export function getArtistGroupDetailsReportInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    if (data.isExcel) {
        let str = '?';
        for (let key in data) {
            str = `${str}&${key}=${data[key] || ''}`;
        }
        window.open('/design/Art_workreport/getArtGroupDetail' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/design/Art_workreport/getArtGroupDetail', data);
    }
}

//SPU明细
export function getArtistSpuDetailsInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/design/Art_workreport/getArtUserDetail', data);
}




