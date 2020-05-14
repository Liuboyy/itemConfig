import * as types from './mutation-type'
import * as Storage from '@/utils/storage'
import Store from '@/store'
import buttonList from '../authority/button_config'

export default {
    [types.SAVE_LOADING_STATE] (state, data) {
        state.showLoading = data
    },

    // 保存登录信息
    [types.SAVE_LOGIN_INFO] (state, loginInfo) {
        state.loginInfo = loginInfo
        Storage.setSessionStorage('userInfo', loginInfo ? JSON.stringify(loginInfo) : '')
    },

    // 保存按钮配置
    [types.SAVE_BUTTON_CONFIG] (state, saveInfo) {
        state.buttonList = buttonList[saveInfo.replace(/^[\/]/, '')] && buttonList[saveInfo.replace(/^[\/]/, '')].buttonList
    },

    // 保存查询参数
    [types.SAVE_QUERY_PARAMS_INFO] (state, saveInfo) {
        state.queryParamsInfo[saveInfo.key] = saveInfo.value
    },

    // 保存多页签对象
    [types.SAVE_MULTIPLE_OBJ] (state, saveInfo) {
        state.multipleObj = saveInfo
    },

    // 保存权限资源菜单
    [types.SAVE_PERMIT_PATH_INFO] (state, infoList) {
        let arr = []
        for (let i = 0; i < infoList.length; i++) {
            arr.push(infoList[i].resource_path)
        }
        state.permitPath = state.permitPath.concat(arr)
    },

    // 保存权限资源按钮
    [types.SAVE_PERMIT_RESOURCE_INFO] (state, infoList) {
        // 递归函数
        let callBack = function (children, saveObj, isRoot) {
            if (children && children.length) {
                for (let i = 0; i < children.length; i++) {
                    if (children[i].children && children[i].children.length) {
                        saveObj[children[i].resource_name] = {}
                        callBack(children[i].children, saveObj[children[i].resource_name])
                    } else {
                        saveObj[children[i].resource_name] = true
                    }
                }
            } else if (isRoot) {
                return true
            }
        }
        let obj = {}
        for (let i = 0; i < infoList.length; i++) {
            obj[infoList[i].resource_name] = {}
            callBack(infoList[i].children, obj[infoList[i].resource_name], true) === true ? obj[infoList[i].resource_name] = true : false
        }
        state.permitResource = obj
    },

    /**
     * 保存页签:
     *  @saveInfo ->
     *  @isRemove 移除页签 Number 1 移除单个  2移除多个
     *  @main 子页面的主页面路由地址
     *  @path 操作路由地址
     *  @name 显示页签名称
     *  @index 唯一索引
     *  @labelIndex 插入位置
     *
     * **/
    [types.SAVE_TAB_LABELS] (state, saveInfo) {

        let initFn = (obj, child) => {

            // 有子页面清除子页面参数
            if (child) {
                for (let key in obj.childrenPageData[child]) {
                    switch (typeof obj.childrenPageData[child][key]) {
                        case 'number':
                            obj.childrenPageData[key] = 0
                            break
                        case 'string':
                            obj.childrenPageData[key] = ''
                            break
                        case 'boolean':
                            obj.childrenPageData[key] = false
                            break
                        case 'object':
                            obj.childrenPageData[key] = obj.childrenPageData[key] instanceof Array ? [] : {}
                            break
                    }
                }
            } else {
                for (let key in obj) {

                    // 如果有子页面的话，父子模块不关联
                    if (key === 'childrenPageData') continue
                    switch (typeof obj[key]) {
                        case 'number':
                            obj[key] = 0
                            break
                        case 'string':
                            obj[key] = ''
                            break
                        case 'boolean':
                            obj[key] = false
                            break
                        case 'object':
                            obj[key] = obj[key] instanceof Array ? [] : {}
                            break
                    }
                }
            }
        }

        if (saveInfo.isRemove === 1) {

            // 移除单个标签
            state.tabLabel.splice(saveInfo.isRemoveInx, 1)
            let resetObj = state[saveInfo.path.replace('/', '')]
            let isChild = false
            if (!resetObj) {
                if (saveInfo.main) {
                    resetObj = state[saveInfo.main.replace('/', '')]
                } else {
                    let pathKey = saveInfo.path
                    resetObj = state[Store.getters.permitPath[0][pathKey].main]
                }
                isChild = true
            }

            // 重置页面编辑状态
            Store.commit('SAVE_PAGE_EDIT_STATE', {
                key: saveInfo.path,
                value: false
            })

            initFn(resetObj, isChild)
        } else if (saveInfo.isRemove === 2) {
            let leaveArr = []
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    leaveArr.push(state.tabLabel[i])
                    break
                }
            }
            // 关闭全部的缓存
            let pathArr = Array.from(Store.getters.permitPath)
            for (let key in Store.getters.permitPath[0]) {
                pathArr.push(key)
            }
            for (let i = 1; i < pathArr.length; i++) {

                if (pathArr[i] === saveInfo.path) continue

                // 重置页面编辑状态
                Store.commit('SAVE_PAGE_EDIT_STATE', {
                    key: pathArr[i],
                    value: false
                })

                let pathKey = pathArr[i].replace('/', '')
                let resetObj = state[pathKey]

                if (!resetObj) {
                    if (!pathArr[0][pathArr[i]]) {
                        continue
                    }
                    resetObj = state[pathArr[0][pathArr[i]].main]
                    initFn(resetObj, pathArr[i])
                } else {
                    initFn(resetObj)
                }
            }
            state.tabLabel.splice(0)
            state.tabLabel = leaveArr
        } else {
            for (let i = 0; i < state.tabLabel.length; i++) {
                if (state.tabLabel[i].path === saveInfo.path) {
                    return
                }
            }
            if (state.tabLabel.length > 7) {

                // 重置页面编辑状态
                Store.commit('SAVE_PAGE_EDIT_STATE', {
                    key: state.tabLabel[0].path,
                    value: false
                })

                let pathKey = state.tabLabel[0].path
                let resetObj = state[pathKey.replace('/', '')]
                try {
                    if (!resetObj) {
                        resetObj = state[Store.getters.permitPath[0][pathKey].main]
                        initFn(resetObj, pathKey)
                    } else {
                        initFn(resetObj)
                    }
                } catch (e) {
                    console.log(e)
                }
                state.tabLabel.shift()
            }

            if (saveInfo.labelIndex || saveInfo.labelIndex === 0) {
                state.tabLabel.splice(saveInfo.labelIndex, 0, saveInfo)
                // insert
            } else {
                state.tabLabel.push(saveInfo)
            }
        }
    },

    // 导航激活INDEX
    [types.SAVE_NAV_INDEX] (state, saveInfo) {
        state.navIndex = saveInfo
    },

    // 保存页面编辑状态
    [types.SAVE_PAGE_EDIT_STATE] (state, saveInfo) {
        // key   主页面标识
        // value 页面参数
        // path  跳转路由
        if (saveInfo.value !== false) {
            state.pageEditState[saveInfo.key] = {
                ...saveInfo
            }
        } else {
            setTimeout(() => {
                state.pageEditState[saveInfo.key] = false
            }, 10)
        }
    },

    // 保存下拉资源
    // saveInfo => key , value
    [types.SAVE_OPTION_LIST_INFO] (state, saveInfo) {
        state.comOptions[saveInfo.key] = saveInfo.value;
    }
}
