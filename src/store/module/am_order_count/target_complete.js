/**
 * Creator: KarYanLam
 * Creation Date: 2019/6/20 16:24
 */

/**  --->>>>   |^ 目标完成情况^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getPerformanceReportInfo,
    getTargetEntryInfo
} from '@/api/am_order_count/target_complete';

const config = {
    state: {
        targetPerformanceInfo: {},
        targetEntryInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_TARGET_PERFORMANCE_INFO] (state, saveInfo) {
            state.targetPerformanceInfo = saveInfo
        },
        [types.SAVE_TARGET_ENTRY_INFO] (state, saveInfo) {
            state.targetEntryInfo = saveInfo
        }
    },
    actions: {
        // name
        GetPerformanceReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getPerformanceReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_TARGET_PERFORMANCE_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetTargetEntryInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getTargetEntryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_TARGET_ENTRY_INFO'], response.data)
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