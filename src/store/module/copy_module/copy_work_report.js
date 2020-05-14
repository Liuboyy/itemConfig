
/**********************************  --->>>>   |^ 文案工作报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getCopyGroupSummaryInfo,
    getCopyGroupDetailsInfo
} from '../../../api/copy_module/copy_work_report';

const config = {
    state: {
        copyGroupSummaryInfo: {},
        copyGroupDetailsInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_COPY_GROUP_SUMMARY_INFO] (state, saveInfo) {
            state.copyGroupSummaryInfo = saveInfo
        },
        [types.SAVE_COPY_GROUP_DETAILS_INFO] (state, saveInfo) {
            state.copyGroupDetailsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetCopyGroupSummaryInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getCopyGroupSummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COPY_GROUP_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCopyGroupDetailsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getCopyGroupDetailsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COPY_GROUP_DETAILS_INFO'], response.data)
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