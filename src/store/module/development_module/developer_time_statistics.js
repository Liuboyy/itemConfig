
/**********************************  --->>>>   |^ 开发平均时效统计 ^|   <<<<---*****************************/

import {
    getDeveloperGroupTimeCountInfo,
    getDeveloperProductLineCountInfo
} from '../../../api/development_module/developer_time_statistics';
import * as types from "../../mutation-type";

const config = {
    state: {
        developerGroupTimeCountInfo: {},
        developerProductLineCountInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_DEVELOPER_TIME_COUNT_INFO] (state, saveInfo) {
            state.developerGroupTimeCountInfo = saveInfo
        },
        [types.SAVE_DEVELOPER_PRODUCT_LINE_COUNT_INFO] (state, saveInfo) {
            state.developerProductLineCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDeveloperGroupTimeCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDeveloperGroupTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPER_TIME_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetDeveloperProductLineCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDeveloperProductLineCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPER_PRODUCT_LINE_COUNT_INFO'], response.data)
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