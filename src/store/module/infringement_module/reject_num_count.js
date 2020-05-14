/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/22 9:28
 */

/**  --->>>>   |^ 驳回次数统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getRejectSummaryInfo,
    getRejectDetailsInfo,
    getRejectDetailsProductLineInfo
} from '../../../api/infringement_module/reject_num_count';

const config = {
    state: {
        rejectSummaryInfo: {},
        rejectDetailsInfo: {},
        productLineRejectDetailsInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_REJECT_SUMMARY_INFO] (state, saveInfo) {
            state.rejectSummaryInfo = saveInfo
        },
        [types.SAVE_REJECT_DETAILS_INFO] (state, saveInfo) {
            state.rejectDetailsInfo = saveInfo
        },
        [types.SAVE_REJECT_LINE_DETAILS_INFO] (state, saveInfo) {
            state.productLineRejectDetailsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetRejectSummaryInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getRejectSummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_REJECT_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetRejectDetailsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getRejectDetailsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_REJECT_DETAILS_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetRejectDetailsProductLineInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getRejectDetailsProductLineInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_REJECT_LINE_DETAILS_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
    }
}

export default config