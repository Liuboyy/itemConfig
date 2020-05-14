
/**********************************  --->>>>   |^ 开发目标完成统计 ^|   <<<<---*****************************/

import {
    getDevelopmentGroupCountInfo,
    getDeveloperCountInfo,
    getDevelopmentTypeCountInfo,
    getProductLineCountInfo
} from '../../../api/development_module/development_goal_statistics';

import * as types from "../../mutation-type";

const config = {
    state: {
        developmentGroupCountInfo: {},
        developerCountInfo: {},
        developmentTypeCountInfo: {},
        developmentProductLineInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_DEVELOPMENT_GROUP_COUNT_INFO] (state, saveInfo) {
            state.developmentGroupCountInfo = saveInfo
        },
        [types.SAVE_DEVELOPER_COUNT_INFO] (state, saveInfo) {
            state.developerCountInfo = saveInfo
        },
        [types.SAVE_DEVELOPMENT_TYPE_COUNT_INFO] (state, saveInfo) {
            state.developmentTypeCountInfo = saveInfo
        },
        [types.SAVE_DEVELOPMENT_PRODUCT_LINE_INFO] (state, saveInfo) {
            state.developmentProductLineInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDevelopmentGroupCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDevelopmentGroupCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPMENT_GROUP_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetDeveloperCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDeveloperCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPER_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetDevelopmentTypeCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getDevelopmentTypeCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPMENT_TYPE_COUNT_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetProductLineCountInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getProductLineCountInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DEVELOPMENT_PRODUCT_LINE_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        }
    }
};

export default config