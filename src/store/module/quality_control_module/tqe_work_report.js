
/**********************************  --->>>>   |^ TQE工作报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getTqeDayDetailInfo,
    getTqeDaySummaryInfo,
    getTqeMonthSummaryInfo,
    getTqeAnnualReportInfo
} from '../../../api/quality_control_module/tqe_work_report';

const config = {
    state: {
        dayDetailsInfo: {},
        daySummaryInfo: {},
        monthSummaryInfo: {},
        annualReportInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_DAY_DETAILS_INFO] (state, saveInfo) {
            state.dayDetailsInfo = saveInfo
        },
        [types.SAVE_DAY_SUMMARY_INFO] (state, saveInfo) {
            state.daySummaryInfo = saveInfo
        },
        [types.SAVE_MONTH_SUMMARY_INFO] (state, saveInfo) {
            state.monthSummaryInfo = saveInfo
        },
        [types.SAVE_ANNUAL_REPORT_INFO] (state, saveInfo) {
            state.annualReportInfo = saveInfo
        }
    },
    actions: {
        // name
        GetTqeDayDetailInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getTqeDayDetailInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DAY_DETAILS_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetTqeDaySummaryInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getTqeDaySummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_DAY_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetTqeMonthSummaryInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getTqeMonthSummaryInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_MONTH_SUMMARY_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
       GetTqeAnnualReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getTqeAnnualReportInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_ANNUAL_REPORT_INFO'], response.data)
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