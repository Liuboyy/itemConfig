/**
 * Creator: KarYanLam
 * Creation Date: 2019/11/21 18:01
 */

/**  --->>>>   |^ 审核数量统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getInfringeGroupSummaryInfo,
    getInfringeGroupDetailsInfo
} from '../../../api/infringement_module/infringe_num_count';

const config = {
    state: {
        infringeGroupSummaryInfo: {},
        infringeGroupDetailsInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_INFRINGE_GROUP_SUMMARY_INFO] (state, saveInfo) {
            state.infringeGroupSummaryInfo = saveInfo
        },
        [types.SAVE_INFRINGE_GROUP_DETAILS_INFO] (state, saveInfo) {
            state.infringeGroupDetailsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetInfringeGroupSummaryInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getInfringeGroupSummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_INFRINGE_GROUP_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetInfringeGroupDetailsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getInfringeGroupDetailsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_INFRINGE_GROUP_DETAILS_INFO'], response.data)
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
