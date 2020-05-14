
/**********************************  --->>>>   |^ 摄影平均耗时统计 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getPhotoGroupTimeCountInfo,
    getPhotoTaskTypeTimeCountInfo,
    getPhotoProductLineTimeCountInfo
} from '../../../api/design_module/photograph_time_statistics';

const config = {
    state: {
        photographGroupTimeCountInfo: {},
        photographTaskTypeTimeCountInfo: {},
        photographProductLineTimeCountInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_PHOTO_GROUP_TIME_COUNT_INFO] (state, saveInfo) {
            state.photographGroupTimeCountInfo = saveInfo
        },
        [types.SAVE_PHOTO_TASK_TYPE_COUNT_INFO] (state, saveInfo) {
            state.photographTaskTypeTimeCountInfo = saveInfo
        },
        [types.SAVE_PHOTO_PRODUCT_LINE_COUNT_INFO] (state, saveInfo) {
            state.photographProductLineTimeCountInfo = saveInfo
        }
    },
    actions: {
        // name
        GetPhotoGroupTimeCountInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getPhotoGroupTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PHOTO_GROUP_TIME_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetPhotoTaskTypeTimeCountInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getPhotoTaskTypeTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PHOTO_TASK_TYPE_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetPhotoProductLineTimeCountInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getPhotoProductLineTimeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_PHOTO_PRODUCT_LINE_COUNT_INFO'], response.data)
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