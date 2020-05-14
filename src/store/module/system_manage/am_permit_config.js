/**
 * Name: ***
 * User: YnmauSu
 * Date: 2019/5/20
 * Time: 15:03
 *
 */

import * as types from '../../mutation-type'

import {
    getAmPermitUserConfigListInfo,
    getAmPermitRoleConfigListInfo
} from '@/api/system_manage/am_permit_config';

const config = {
    state: {
        amUserConfigInfo: {},
        amRoleConfigInfo: {},
        activeShow: '',
    },
    mutations: {
        [types.SAVE_AM_USER_CONFIG_INFO] (state, saveInfo) {
            state.amUserConfigInfo = saveInfo
        },
        [types.SAVE_AM_ROLE_CONFIG_INFO] (state, saveInfo) {
            state.amRoleConfigInfo = saveInfo
        }
    },
    actions: {
        // name
        GetAmPermitUserConfigListInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmPermitUserConfigListInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AM_USER_CONFIG_INFO'], response.data)
                    }
                    resolve(response)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        GetAmPermitRoleConfigListInfo ({commit}, queryData) {
            if (!queryData) {
                queryData = {}
            }
            return new Promise((resolve, reject) => {
                getAmPermitRoleConfigListInfo(queryData).then(response => {
                    if (response.data.status === 1) {
                        commit(types['SAVE_AM_ROLE_CONFIG_INFO'], response.data)
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