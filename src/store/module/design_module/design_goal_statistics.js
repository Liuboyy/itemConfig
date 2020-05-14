
/**********************************  --->>>>   |^ 设计组目标完成统计 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getDesignGroupGoalStatisticsInfo
} from '../../../api/design_module/design_goal_statistics';

const config = {
    state: {
        designGroupGoalStatisticsInfo: {},
    },
    mutations: {
        [types.SAVE_DESIGN_GOAL_STATISTICS_INFO] (state, saveInfo) {
            state.designGroupGoalStatisticsInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDesignGroupGoalStatisticsInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getDesignGroupGoalStatisticsInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DESIGN_GOAL_STATISTICS_INFO'], response.data)
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
