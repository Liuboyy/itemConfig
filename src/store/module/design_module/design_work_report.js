
/**********************************  --->>>>   |^ 设计组工作报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getDesignGroupSummaryReportInfo,
    getDesignGroupDetailsReportInfo
} from '../../../api/design_module/design_work_report';

const config = {
    state: {
        designGroupSummaryReportInfo: {},
        designGroupDetailsReportInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_DESIGN_GROUP_SUMMARY_INFO] (state, saveInfo) {
            state.designGroupSummaryReportInfo = saveInfo
        },
        [types.SAVE_DESIGN_GROUP_DETAILS_INFO] (state, saveInfo) {
            state.designGroupDetailsReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetDesignGroupSummaryReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getDesignGroupSummaryReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DESIGN_GROUP_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetDesignGroupDetailsReportInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getDesignGroupDetailsReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DESIGN_GROUP_DETAILS_INFO'], response.data)
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
