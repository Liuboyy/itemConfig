/**
 * Creator: KarYanLam
 * Creation Date: 2019/12/3 9:25
 */

/**  --->>>>   |^ 阿米巴报表统计^|   <<<<---**/

import * as types from '../../mutation-type'

import {
    getAmoebaReportSummaryInfo,
    getAmoebaReportDetailInfo,
    getAmoebaReportConfigInfo
} from '../../../api/zen_tao_module/amoeba_report';

const config = {
    state: {
        amoebaSummaryInfo: {},
        amoebaDetailInfo: {},
        amoebaConfigInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_AMOEBA_SUMMARY_INFO] (state, saveInfo) {
            state.amoebaSummaryInfo = saveInfo
        },
        [types.SAVE_AMOEBA_DETAIL_INFO] (state, saveInfo) {
            state.amoebaDetailInfo = saveInfo
        },
        [types.SAVE_AMOEBA_CONFIG_INFO] (state, saveInfo) {
            state.amoebaConfigInfo = saveInfo
        }
    },
    actions: {
        // name
        GetAmoebaReportSummaryInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmoebaReportSummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AMOEBA_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetAmoebaReportDetailInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmoebaReportDetailInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AMOEBA_DETAIL_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetAmoebaReportConfigInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmoebaReportConfigInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AMOEBA_CONFIG_INFO'], response.data)
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