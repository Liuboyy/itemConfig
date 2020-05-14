/**
 * Creator: KarYanLam
 * Creation Date: 2019/8/12 15:25
 */

/**  --->>>>   |^ 刊登目标完成统计^|   <<<<---**/
import CONFIG from '@/assets/js/config';
import http from '@/http';


//目标录入
export function getPublishTargetEnterInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getListingTarget', data);
}

//获取小组下拉数据
export function getGroupList(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/getGroupsByPermissions', data);
}

//设置目标值
export function getSetTargetNumInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/amazon/Sale_summary/setListingTarget', data);
}


//目标完成统计
export function getPublishTargetCountInfo(params = {}) {
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
        window.open('/amazon/Sale_summary/getListingTargetFinish' + str, '_self');
        return new Promise((resolve => {
            resolve({
                data: {
                    status: 2
                }
            });
        }));
    } else {
        return http.getAjax('/amazon/Sale_summary/getListingTargetFinish', data);
    }
}