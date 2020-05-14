
/**********************************  --->>>>   |^ 设计部任务汇总统计 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getDesignTaskCountInfo
} from '../../../api/design_module/design_task_count';

const config = {
    state: {
        designTaskCountInfo: {},
    },
    mutations: {
        [types.SAVE_DESIGN_TASK_COUNT_INFO] (state, saveInfo) {
            state.designTaskCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDesignTaskCountInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getDesignTaskCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DESIGN_TASK_COUNT_INFO'], response.data)
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