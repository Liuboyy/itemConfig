
/**********************************  --->>>>   |^ 各成本区间商品开发数 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getCostDevelopmentGroupInfo,
    getCostDeveloperInfo,
    getCostDevelopmentTypeInfo,
    getCostProductLineInfoInfo
} from '../../../api/development_module/cost_development_number';

const config = {
    state: {
        costDevelopmentGroupInfo: {},
        costDeveloperInfo: {},
        costDevelopmentTypeInfo: {},
        costProductLineInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_COST_DEVELOPMENT_GROUP_INFO] (state, saveInfo) {
            state.costDevelopmentGroupInfo = saveInfo
        },
        [types.SAVE_COST_DEVELOPER_INFO] (state, saveInfo) {
            state.costDeveloperInfo = saveInfo
        },
        [types.SAVE_COST_DEVELOPMENT_TYPE_INFO] (state, saveInfo) {
            state.costDevelopmentTypeInfo = saveInfo
        },
        [types.SAVE_COST_PRODUCT_LINE_INFO] (state, saveInfo) {
            state.costProductLineInfo = saveInfo
        }

    },
    actions: {
        //开发小组
        GetCostDevelopmentGroupInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostDevelopmentGroupInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_DEVELOPMENT_GROUP_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //开发人员
        GetCostDeveloperInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostDeveloperInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_DEVELOPER_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //开发类型
        GetCostDevelopmentTypeInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostDevelopmentTypeInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_DEVELOPMENT_TYPE_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        //产品线
        GetCostProductLineInfoInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getCostProductLineInfoInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_COST_PRODUCT_LINE_INFO'], response.data)
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
