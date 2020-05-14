/**
 * Creator: KarYanLam
 * Creation Date: 2019/10/17 17:01
 */

/**  --->>>>   |^ 国内仓sku统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getDomesticSkuReportInfo,
    getCoreDomesticSkuReportInfo
} from '@/api/product_module/domestic_sku_count';

const config = {
    state: {
        domesticSkuReportInfo: {},
        domesticCoreSkuReportInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_DOMESTIC_SKU_REPORT_INFO] (state, saveInfo) {
            state.domesticSkuReportInfo = saveInfo
        },
        [types.SAVE_DOMESTIC_CORE_SKU_REPORT_INFO] (state, saveInfo) {
            state.domesticCoreSkuReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDomesticSkuReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDomesticSkuReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DOMESTIC_SKU_REPORT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCoreDomesticSkuReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCoreDomesticSkuReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DOMESTIC_CORE_SKU_REPORT_INFO'], response.data)
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