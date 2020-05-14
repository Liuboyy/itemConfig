/**
 * Creator: KarYanLam
 * Creation Date: 2019/7/31 18:51
 */

/**  --->>>>   |^ 海外仓sku统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getOverseaSkuReportInfo,
    getCoreOverseaSkuReportInfo
} from '@/api/product_module/oversea_sku_count';

const config = {
    state: {
        overseaSkuReportInfo: {},
        overseaCoreSkuReportInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_OVERSEA_SKU_REPORT_INFO] (state, saveInfo) {
            state.overseaSkuReportInfo = saveInfo
        },
        [types.SAVE_OVERSEA_CORE_SKU_REPORT_INFO] (state, saveInfo) {
            state.overseaCoreSkuReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetOverseaSkuReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getOverseaSkuReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_OVERSEA_SKU_REPORT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCoreOverseaSkuReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCoreOverseaSkuReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_OVERSEA_CORE_SKU_REPORT_INFO'], response.data)
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