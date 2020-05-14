/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 16:22
 */

/**  --->>>>   |^ 海外仓sku周统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getOverseaSkuWeekReportInfo,
    getCoreOverseaSkuWeekReportInfo
} from '@/api/product_module/oversea_sku_week_count';

const config = {
    state: {
        overseaSkuWeekReportInfo: {},
        overseaCoreSkuWeekReportInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_OVERSEA_SKU_WEEK_INFO] (state, saveInfo) {
            state.overseaSkuWeekReportInfo = saveInfo
        },
        [types.SAVE_OVERSEA_CORE_SKU_WEEK_INFO] (state, saveInfo) {
            state.overseaCoreSkuWeekReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetOverseaSkuWeekReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOverseaSkuWeekReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_OVERSEA_SKU_WEEK_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCoreOverseaSkuWeekReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCoreOverseaSkuWeekReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_OVERSEA_CORE_SKU_WEEK_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
}

export default config