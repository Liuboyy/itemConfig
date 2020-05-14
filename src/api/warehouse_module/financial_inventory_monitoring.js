/**
 * Creator: KarYanLam
 * Creation Date: 2020/3/11 16:05
 */

/**  --->>>>   |^ 财务FBA库存监控^|   <<<<---**/

import CONFIG from '@/assets/js/config';
import http from '@/http';
import qs from 'qs';
import { postExcelFile } from '@/services';

// 获取之前的系数配置
export function getRatioConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Modulus_deploy/getDeploy', data)
}

// 保存系数配置
export function upDateRatioConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Modulus_deploy/editDeploy', data)
}

// 获取历史金额配置
export function getAdjustMoneyConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Modulus_deploy/getAdjustMoney', data)
}

// 保存历史金额配置
export function upDateAdjustMoneyConfigInfo(params = {}) {
    const data = {
        ...CONFIG.ajaxData,
        ...params
    };
    return http.getAjax('/monitor/Modulus_deploy/editAdjustMoney', data)
}

