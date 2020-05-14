
/**********************************  --->>>>   |^ 文案工作报表 ^|   <<<<---*****************************/

import * as types from '../../mutation-type'

import {
    getCopyGroupTeamInfo,
    getCopyGroupMemberInfo,
    getCopyGroupProductLineInfo,
    getCopyGroupDeveTypeInfo,
} from '../../../api/copy_module/copy_editing_report';

const config = {
    state: {
        copyGroupTeamInfo: {
            tables:{},
            echart1:{},
            echart2:{},
        },
        copyGroupMemberInfo: {
            tables:{},
            echart1:{},
        },
        copyGroupProductLineInfo: {
            tables:{},
            echart1:{},
        },
        copyGroupDeveTypeInfo: {
            tables:{},
            echart1:{},
        },
        activeShow: ''
    },
    mutations: {
        [types.SAVE_COPY_GROUP_TEAM_INFO] (state, saveInfo) {
            state.copyGroupTeamInfo.tables = saveInfo
        },
        [types.SAVE_COPY_GROUP_TEAM_ECHART_INFO] (state, saveInfo) {
            state.copyGroupTeamInfo.echart1 = saveInfo
        },
        [types.SAVE_COPY_GROUP_MEMBER_INFO] (state, saveInfo) {
            state.copyGroupMemberInfo.tables = saveInfo
        },
        [types.SAVE_COPY_GROUP_MEMBER_ECHART_INFO] (state, saveInfo) {
            state.copyGroupMemberInfo.echart1 = saveInfo
        },
        [types.SAVE_COPY_GROUP_PRODUCTLNE_INFO] (state, saveInfo) {
            state.copyGroupProductLineInfo.tables = saveInfo
        },
        [types.SAVE_COPY_GROUP_PRODUCTLNE_ECHART_INFO] (state, saveInfo) {
            state.copyGroupProductLineInfo.echart1 = saveInfo
        },
        [types.SAVE_COPY_GROUP_DEVETYPE_INFO] (state, saveInfo) {
            state.copyGroupDeveTypeInfo.tables = saveInfo
        },
        [types.SAVE_COPY_GROUP_DEVETYPE_ECHART_INFO] (state, saveInfo) {
            state.copyGroupDeveTypeInfo.echart1 = saveInfo
        },
    },
    actions: {
        // name
        GetCopyGroupTeamInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getCopyGroupTeamInfo(queryData).then(response => {
                    if(queryData.type==1){
                        if (response.data.status === 1) {
                            commit(types['SAVE_COPY_GROUP_TEAM_INFO'], response.data)
                        }
                    }else if(queryData.type==2){
                        if (response.data.status === 1) {
                            commit(types['SAVE_COPY_GROUP_TEAM_ECHART_INFO'], response.data)
                        }
                    }else if(queryData.type==3){

                    }
                    
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCopyGroupMemberInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getCopyGroupMemberInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        if(queryData.type==1){
                            commit(types['SAVE_COPY_GROUP_MEMBER_INFO'], response.data)
                        }else if(queryData.type==2){
                            commit(types['SAVE_COPY_GROUP_MEMBER_ECHART_INFO'], response.data)
                        }else{

                        }
                        
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCopyGroupProductLineInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getCopyGroupProductLineInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        if(queryData.type==1){
                            commit(types['SAVE_COPY_GROUP_PRODUCTLNE_INFO'], response.data)
                        }else if(queryData.type==2){
                            commit(types['SAVE_COPY_GROUP_PRODUCTLNE_ECHART_INFO'], response.data)
                        }else{

                        }
                        
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetCopyGroupDeveTypeInfo ({commit}, queryData = {}) {
            return new Promise((resolve, reject) => {
                getCopyGroupDeveTypeInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        if(queryData.type==1){
                            commit(types['SAVE_COPY_GROUP_DEVETYPE_INFO'], response.data)
                        }else if(queryData.type==2){
                            commit(types['SAVE_COPY_GROUP_DEVETYPE_ECHART_INFO'], response.data)
                        }else{

                        }
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