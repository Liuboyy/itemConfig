/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/28 9:31
 */

/**  --->>>>   |^ 二次以上驳回统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getMoreRejectNumSummaryInfo,
    getMoreRejectNumDetailsInfo
} from '../../../api/infringement_module/more_reject_num_count';

const config = {
    state: {
        moreRejectSummaryInfo: {},
        moreRejectDetailsInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_MORE_REJECT_SUMMARY_INFO] (state, saveInfo) {
            state.moreRejectSummaryInfo = saveInfo
        },
        [types.SAVE_MORE_REJECT_DETAILS_INFO] (state, saveInfo) {
            state.moreRejectDetailsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetMoreRejectNumSummaryInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getMoreRejectNumSummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_MORE_REJECT_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetMoreRejectNumDetailsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getMoreRejectNumDetailsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_MORE_REJECT_DETAILS_INFO'], response.data)
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