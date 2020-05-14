
/**********************************  --->>>>   |^ 文案平均耗时统计 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getCopyGroupCountInfo,
    getCopyProductLineInfo
} from '../../../api/copy_module/copy_time_statistics';

const config = {
    state: {
        copyGroupCountInfo: {},
        copyProductLineCountInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_COPY_GROUP_COUNT_INFO] (state, saveInfo) {
            state.copyGroupCountInfo = saveInfo
        },
        [types.SAVE_COPY_PRODUCT_LINE_COUNT_INFO] (state, saveInfo) {
            state.copyProductLineCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetCopyGroupCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCopyGroupCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COPY_GROUP_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCopyProductLineInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCopyProductLineInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COPY_PRODUCT_LINE_COUNT_INFO'], response.data)
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