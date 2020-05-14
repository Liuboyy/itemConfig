
/**********************************  --->>>>   |^ 样品审核报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getSampleDayDetailsInfo,
    getSampleDayAndMonthSummaryInfo,
    getSampleAnnualReportInfo
} from '../../../api/quality_control_module/sample_audit_report';

const config = {
    state: {
        sampleDevelopmentGroupInfo: {
            'dev': {},
            'line': {},
            'tqe': {}
        },
        // sampleProductLineInfo: {},
        // sampleTqeReportInfo: {},
        activeShow: ''
    },
    mutations: {
        [types.SAVE_SAMPLE_DEVELOPMENT_GROUP_INFO] (state, saveInfo) {
            state.sampleDevelopmentGroupInfo[saveInfo.module_type] = saveInfo;
        },
        // [types.SAVE_SAMPLE_PRODUCT_LINE_INFO] (state, saveInfo) {
        //     state.sampleProductLineInfo = saveInfo
        // },
        // [types.SAVE_SAMPLE_TQE_REPORT_INFO] (state, saveInfo) {
        //     state.sampleTqeReportInfo = saveInfo
        // }
    },
    actions: {
        // name
        GetSampleAuditReportInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                if(queryData.tab_type == '1') {
                    getSampleDayDetailsInfo(queryData).then(response => {
                        if (response.data.status === 1) {
                            commit(types['SAVE_SAMPLE_DEVELOPMENT_GROUP_INFO'], {
                                ...response.data,
                                module_type: queryData.module_type
                            })
                        }
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
                }
                if(queryData.tab_type == '2'|| queryData.tab_type == '3') {
                    getSampleDayAndMonthSummaryInfo(queryData).then(response => {
                        if (response.data.status === 1) {
                            commit(types['SAVE_SAMPLE_DEVELOPMENT_GROUP_INFO'], {
                                ...response.data,
                                module_type: queryData.module_type
                            })
                        }
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
                }
                if(queryData.tab_type == '4') {
                    getSampleAnnualReportInfo(queryData).then(response => {
                        if (response.data.status === 1) {
                            commit(types['SAVE_SAMPLE_DEVELOPMENT_GROUP_INFO'], {
                                ...response.data,
                                module_type: queryData.module_type
                            })
                        }
                        resolve(response)
                    }).catch(error => {
                        reject(error)
                    })
                }
            })
        },
    }
}

export default config