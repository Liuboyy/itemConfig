
/**********************************  --->>>>   |^ 开发平均时效统计 ^|   <<<<---*****************************/

import {
    getDeveloperGroupNumberCountInfo,
    getDeveloperLineNumberCountInfo
} from '../../../api/development_module/developer_number_statistics';
import * as types from "../../mutation-type";

const config = {
    state: {
        developerGroupNumberCountInfo: {},
        developerLineNumberCountInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_DEVELOPER_NUMBER_COUNT_INFO] (state, saveInfo) {
            state.developerGroupNumberCountInfo = saveInfo
        },
        [types.SAVE_DEVELOPER_LINE_NUMBER_COUNT_INFO] (state, saveInfo) {
            state.developerLineNumberCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDeveloperGroupNumberCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDeveloperGroupNumberCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPER_NUMBER_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetDeveloperLineNumberCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDeveloperLineNumberCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPER_LINE_NUMBER_COUNT_INFO'], response.data)
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