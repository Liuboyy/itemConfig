/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 17:05
 */

/**  --->>>>   |^ 国内核心SKU周统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getDomesticSkuWeekInfo,
    getCoreDomesticSkuWeekInfo
} from '@/api/product_module/domestic_sku_week_count';

const config = {
    state: {
        domesticSkuWeekReportInfo: {},
        domesticCoreSkuWeekReportInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_DOMESTIC_SKU_WEEK_INFO] (state, saveInfo) {
            state.domesticSkuWeekReportInfo = saveInfo
        },
        [types.SAVE_DOMESTIC_CORE_SKU_WEEK_INFO] (state, saveInfo) {
            state.domesticCoreSkuWeekReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDomesticSkuWeekInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDomesticSkuWeekInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DOMESTIC_SKU_WEEK_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCoreDomesticSkuWeekInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCoreDomesticSkuWeekInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DOMESTIC_CORE_SKU_WEEK_INFO'], response.data)
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