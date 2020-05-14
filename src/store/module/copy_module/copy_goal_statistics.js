
/**********************************  --->>>>   |^ 文案目标达成统计 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getCopyGoalCountInfo,
} from '../../../api/copy_module/copy_goal_statistics';

const config = {
    state: {
        copyGoalStatistics: {},
    },
    mutations: {
        [types.SAVE_COPY_GOAL_STATISTICS_INFO] (state, saveInfo) {
            state.copyGoalStatistics = saveInfo
        }
    },
    actions: {
        // name
        GetCopyGoalCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCopyGoalCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COPY_GOAL_STATISTICS_INFO'], response.data)
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