<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="角色名称">
                            <el-select v-model="queryData.roleName" size="small" filterable v-filter>
                                <el-option v-for="item in optionList.roleNameList"
                                           :key="item.id" :value="item.id" :label="item.role_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="角色用户">
                            <el-select v-model="queryData.userName" size="small" filterable v-filter>
                                <el-option v-for="item in optionList.userNameList"
                                           :key="item.user_number" :value="item.user_number" :label="item.user_name + '_'+ item.user_number"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon
                    :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button type="text" @click="handleAddConfigInfo" icon="icon-xinzeng1 icon-main">新增</el-button>
        </div>
        <div class="ui-main-module-table">
            <ComTableInfo
                    :tableWidth="tableWidth"
                    :showSearch="showSearch"
                    :tableKey="tableKey"
                    :tableProps="tableProps"
                    :tableData="tableData"
                    :otherHeight="['el-tabs__header']">
                <template slot="status" slot-scope="scope">
                    <el-button type="text" size="small" @click.stop="handleChangeState(scope.row)" :class="scope.row.status == 1 ? 'icon-kaiqi icon-wx' : 'icon-tingyong icon-danger'"><span class="ui-status">{{scope.row.status == 1 ? '启用' : '禁用'}}</span></el-button>
                </template>
                <template slot="operation" slot-scope="scope">
                    <el-button type="text" size="small" @click.stop="handlePreviewInfo(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click.stop="handleEditConfigInfo(scope.row)">编辑</el-button>
                    <el-button type="text" size="small" @click.stop="handleEmendationUserInfo(scope.row, 'add')">添加用户</el-button>
                    <el-button type="text" size="small" @click.stop="handleEmendationUserInfo(scope.row, 'delete')">删除用户</el-button>
                </template>
            </ComTableInfo>
        </div>
        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>

        <el-dialog
                top="10vh"
                :title="isModifyShow ? '编辑' : '新增'"
                width="1000px"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleCancelConfigInfo">
            <el-form ref="configObj" :model="configObj" size="small" label-width="80px">
                <el-form-item label="角色名">
                    <el-input size="small" v-model="configObj.roleName" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="产品线">
                    <el-popover
                            ref="popover"
                            width="800"
                            placement="bottom-start"
                            trigger="manual"
                            :visible-arrow="false"
                            @show="handleInTreeData('line')"
                            v-model="popover.line">
                        <div class="ui-input__tree">
                            <div class="ui-base--area">
                                <el-input
                                        size="small"
                                        placeholder="输入关键字进行搜索"
                                        v-model="productLineFilter">
                                </el-input>
                                <el-tree
                                        ref="lineEditor"
                                        node-key="id"
                                        show-checkbox
                                        :props="defaultProps"
                                        :default-expanded-keys="defaultCheckedLineKeys"
                                        :data="optionList.productLineList"
                                        :filter-node-method="productLineFilterNode">
                                </el-tree>
                            </div>
                            <div class="ui-tree__btn">
                                <el-button type="text" @click="popover.line = false">关闭</el-button>
                                <el-button type="text" @click="handleTreeCheckInfo('line')">确定</el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="configObj.productLineName"
                              @focus="popover.line = true"></el-input>
                </el-form-item>
                <el-form-item label="开发人员">
                    <el-select v-model="configObj.developer" size="small" filterable multiple>
                        <el-option v-for="item in optionList.developerList"
                                   :label="item.user_name"
                                   :value="item.user_id"
                                   :key="item.user_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="平台">
                    <el-select v-model="configObj.platform" size="small" multiple filterable @focus="handleChangePlatform">
                        <el-option v-for="item in optionList.platformList"
                                   :label="item.platform_name"
                                   :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCancelConfigInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmConfigInfo">保存</el-button>
            </div>
        </el-dialog>

        <el-dialog
                top="5vh"
                class="ui-layout_edit-dialog"
                title="查看"
                width="1000px"
                :visible.sync="isPreviewShow"
                @close="isPreviewShow = false">
            <div>
                <table border="1" cellpadding="0" cellspacing="0" class="table ui-singleRow">
                    <tr>
                        <td>角色名称</td><td>{{saveUserName}}</td>
                    </tr>
                </table>
                <el-collapse v-model="activeName1">
                    <el-collapse-item title="开发人员" name="1">
                        <div class="ui-collapse_content">
                            <ul class="clearFix">
                                <li v-for="item in saveDevInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-model="activeName2">
                    <el-collapse-item title="平台" name="1">
                        <div class="ui-collapse_content">
                            <ul class="clearFix">
                                <li v-for="item in savePlatformInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-model="activeName3">
                    <el-collapse-item title="产品线" name="1">
                        <div class="ui-collapse_content ui-line">
                            <ul class="clearFix">
                                <p><span class="ui-leftLine"></span>一级产品线：</p>
                                <li v-for="item in saveOneLineInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                            <ul class="clearFix">
                                <p><span class="ui-leftLine"></span>二级产品线：</p>
                                <li v-for="item in saveTwoLineInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                            <ul class="clearFix">
                                <p><span class="ui-leftLine"></span>三级产品线：</p>
                                <li v-for="item in saveThreeLineInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
        </el-dialog>

        <el-dialog
                top="10vh"
                :title="isDeleteUserShow ? '删除用户' : '添加用户'"
                width="1000px"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddUserShow"
                @close="handleCancelRoleInfo">
            <el-form ref="userConfigObj" :model="userConfigObj" size="small" label-width="80px">
                <el-form-item label="角色名称">
                    <el-input v-model="userConfigObj.roleName" disabled></el-input>
                </el-form-item>
                <el-form-item label="角色用户" v-if="userConfigObj.userName.length">
                    <ul class="clearFix ui-name_area">
                        <li v-for="(item, index) in userConfigObj.userName">
                            <span>{{index == (userConfigObj.userName.length - 1) ? item : item + '，'}}</span>
                        </li>
                    </ul>
                </el-form-item>
                <el-form-item label="添加用户" v-if="!this.isDeleteUserShow">
                    <el-popover
                            ref="popover1"
                            placement="bottom-start"
                            width="800"
                            trigger="manual"
                            :visible-arrow="false"
                            v-model="popover.user"
                            @show="handleInTreeData('user')">
                        <div class="ui-input__tree">
                            <div class="ui-base--area">
                                <el-input
                                        size="small"
                                        placeholder="输入关键字进行搜索"
                                        v-model="userNameFilter">
                                </el-input>
                                <el-tree
                                        ref="treeEditor"
                                        show-checkbox
                                        node-key="id"
                                        :default-expanded-keys="defaultCheckedUserKeys"
                                        :props="defaultProps"
                                        :data="optionList.treeUserList"
                                        :filter-node-method="userNameFilterNode">
                                </el-tree>
                            </div>
                            <div class="ui-tree__btn">
                                <el-button type="text" @click="popover.user = false">关闭</el-button>
                                <el-button type="text" @click="handleTreeCheckInfo('user')">确定</el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input class="ui-popover__input" readonly v-popover:popover1 v-model="userConfigObj.addUserName"
                              @focus="popover.user = true"></el-input>
                </el-form-item>
                <el-form-item label="删除用户" v-if="isDeleteUserShow">
                    <el-select v-model="userConfigObj.deleteUserName" size="small" filterable multiple>
                        <el-option v-for="item in optionList.deleteUserNameList"
                                   :label="item.user_name"
                                   :value="item.user_number"
                                   :key="item.user_number"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCancelRoleInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmRoleInfo">保存</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        goToNewPage,
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getRoleNameList,
        getUserNameList,

        getAddUserNameTreeList,
        getSetStatusInfo,
        getConfirmConfigInfo,
        getEditConfigInfo,
        getBatchApplyConfigInfo,
        getPreviewConfigInfo,


        getProductLineList,
        getDeveloperList,
        getPlatformList,
        getSetStatusRoleInfo,
        getEditConfigRoleInfo,
        getAddConfirmRoleConfigInfo,
        getEditConfirmRoleConfigInfo,
        getAddRoleNameTreeList,
        getRoleUserInfo,
        getConfirmRoleUserInfo,
        getPreviewConfigRoleInfo,
    } from '@/api/system_manage/product_permit_config'

    export default {
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    roleName: '',
                    userName: '',
                },

                optionList: {
                    roleNameList: [],
                    userNameList: [],
                    productLineList: [],
                    developerList: [],
                    platformList: [],
                    treeUserList: [],
                    deleteUserNameList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth: [],

                popover: {
                    line: false,
                    user: false,
                },

                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                defaultCheckedLineKeys: [],
                defaultCheckedUserKeys: [],

                //tree搜索关键字
                productLineFilter: '',
                userNameFilter: '',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                // 新增、编辑
                isAddShow: false,
                isModifyShow: false,
                configObj: {
                    roleName: '',
                    roleId: '',
                    productLineName: '',
                    productLineId: [],
                    developer: [],
                    platform: [],
                },

                //查看
                isPreviewShow: false,
                activeName1: '1',
                activeName2: '1',
                activeName3: '1',
                saveUserName: '',
                saveDevInfo: [],
                saveOneLineInfo: [],
                saveTwoLineInfo: [],
                saveThreeLineInfo: [],
                savePlatformInfo: [],

                //添加、删除用户
                isAddUserShow: false,
                isDeleteUserShow: false,
                userConfigObj: {
                    roleName: '',
                    roleId: '',
                    userName: '',
                    addUserName: '',
                    addUserId: [],
                    deleteUserName: '',
                },

                saveCheckInfo: []
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'productRoleConfigInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetProductRoleConfigInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['role_config']);
                }

                let obj = {
                    role_id: this.queryData.roleName,
                    user_number: this.queryData.userName,
                    ...params
                };

                this.GetProductRoleConfigInfo(obj).then(({data}) => {

                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    roleName: '',
                    userName: '',
                }
            },

            //获取所有下拉数据
            handleGetOptionList() {
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                getDeveloperList().then(({ data }) => {
                    this.optionList.developerList = data.data.value;
                });
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data.value;
                });
            },

            //点击查看
            handlePreviewInfo(row) {
                this.isPreviewShow = true;
                this.saveUserName = row.role_name;
                getPreviewConfigRoleInfo({
                    role_id: row.role_id
                }).then(({ data }) => {
                    this.saveDevInfo = data.data.value.producter_info.map(item => item.user_name);
                    this.savePlatformInfo = data.data.value.platform_info.map(item => item.platform_name);
                    this.saveOneLineInfo = data.data.value.line_info.level_one_name.split(',');
                    this.saveTwoLineInfo = data.data.value.line_info.level_two_name.split(',');
                    this.saveThreeLineInfo = data.data.value.line_info.level_three_name.split(',');
                })
            },

            //平台
            handleChangePlatform() {
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = [{
                        platform_name: '全选',
                        id: ''
                    }, ...data.data.value];
                });
            },

            //关键字搜索
            productLineFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            userNameFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 带入tree数据
            handleInTreeData(type) {
                switch (type) {
                    case 'line':
                        this.$nextTick(() => {
                            const checkIds = this.configObj.productLineId;
                            this.$refs.lineEditor.setCheckedKeys(checkIds);
                        });
                        break;
                    case 'user':
                        this.$nextTick().then(() => {
                            const checkIds = this.userConfigObj.addUserId;
                            this.$refs.treeEditor.setCheckedKeys(checkIds);
                        });
                        break;
                }

            },

            // 树形数据保存
            handleTreeCheckInfo(val) {
                const [labels, ids] = [[], []];
                switch (val) {
                    case 'line':
                        this.$refs.lineEditor.getCheckedNodes().forEach(item => {
                            labels.push(item.name);
                            ids.push(item.id);
                        });
                        this.configObj.productLineName = labels.join(',');
                        this.configObj.productLineId = ids;
                        this.popover.line = false;
                        break;
                    case 'user':
                        this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                            if (item.id.indexOf('u_') < 0) return;
                            labels.push(item.name);
                            ids.push(item.id);
                        });
                        this.userConfigObj.addUserName = Array.from(new Set(labels));
                        this.userConfigObj.addUserId = ids;
                        this.popover.user = false;
                        break;
                }
            },

            //点击新增
            handleAddConfigInfo() {
                this.handleGetOptionList();
                this.isAddShow = true;
            },

            //点击编辑
            handleEditConfigInfo(row) {
                this.handleGetOptionList();
                getEditConfigRoleInfo({
                    id: row.role_id
                }).then(({ data }) => {
                    if(data.status) {
                        this.configObj.roleName = row.role_name;
                        this.configObj.roleId = row.role_id;
                        this.configObj.productLineName = data.data.value.line_info.map(item => item.power_name).join(',');
                        this.configObj.productLineId = data.data.value.line_info.map(item => item.power_id);
                        this.configObj.developer = data.data.value.producter_info.map(item => item.power_id);
                        this.configObj.platform = data.data.value.platform_info.map(item => item.power_id);
                        this.defaultCheckedLineKeys = this.configObj.productLineId;
                        this.isAddShow = true;
                        this.isModifyShow = true;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },

            //取消
            handleCancelConfigInfo() {
                this.isAddShow = false;
                this.isModifyShow = false;
                this.configObj.roleName = '';
                this.configObj.roleId = '';
                this.configObj.productLineName = '';
                this.configObj.productLineId = [];
                this.configObj.developer = [];
                this.configObj.platform = [];
                this.defaultCheckedLineKeys = [];
                this.popover.line = false;
                this.popover.user = false;
            },

            //保存提交
            handleConfirmConfigInfo() {
                this.$refs['configObj'].validate((res) => {
                    if(res) {

                        let obj = {
                            role_name: JSON.stringify([this.configObj.roleName]),
                            product_id: JSON.stringify(this.configObj.productLineId),
                            producter_id: JSON.stringify(this.configObj.developer),
                            platform_id: JSON.stringify(this.configObj.platform),
                            update_user_info: JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name])
                        };

                        if(!this.isModifyShow) {
                            getAddConfirmRoleConfigInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data);
                            })
                        }else {
                            obj.role_id = JSON.stringify([this.configObj.roleId]);
                            getEditConfirmRoleConfigInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data);
                            })
                        }
                    }
                });
            },

            //添加、删除用户
            handleEmendationUserInfo(row, type) {
                this.handleGetUserTreeData().then(res => {
                    getRoleUserInfo({
                        role_id: row.role_id
                    }).then(({ data }) => {
                        if(data.status) {
                            this.userConfigObj.roleId = row.role_id;
                            this.userConfigObj.roleName = row.role_name;
                            let userName = data.data.value.map(item => item.user_name);
                            this.userConfigObj.userName = Array.from(new Set(userName));
                            this.userConfigObj.addUserId = data.data.value.map(item => item.department_id + 'u_'+ item.user_number);
                            this.defaultCheckedUserKeys = this.userConfigObj.addUserId;

                            this.isAddUserShow = true;
                            if(type === 'delete') {
                                this.isDeleteUserShow = true;
                                this.userConfigObj.deleteUserName = data.data.value.map(item => item.user_number);
                                this.optionList.deleteUserNameList = data.data.value;
                            }else {
                                this.isDeleteUserShow = false;
                            }
                        }else {
                            this.$message.error(data.errorMess || '操作失败')
                        }
                    })
                });
            },
            //取消
            handleCancelRoleInfo() {
                this.isAddUserShow = false;
                this.isDeleteUserShow = false;
                this.userConfigObj.roleName = '';
                this.userConfigObj.roleId = '';
                this.userConfigObj.userName = '';
                this.userConfigObj.addUserName = '';
                this.userConfigObj.addUserId = [];
                this.userConfigObj.deleteUserName = '';
                this.defaultCheckedUserKeys = [];
            },
            //保存
            handleConfirmRoleInfo() {
                this.$refs.userConfigObj.validate((res) => {
                    if(res) {

                        let user_info = this.userConfigObj.addUserId.reduce((_c, _i) => {
                            // 去掉空选项并去掉用来做标识的部门ID
                            let _append = _i && _i.replace(/^[0-9]+u_/, '');
                            if (_append) return [..._c, _append];
                            else return _c;
                        }, []);

                        let obj = {
                            role_id: JSON.stringify([this.userConfigObj.roleId]),
                            user_number: JSON.stringify(user_info),
                            update_user_info: JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name]),
                        };
                        if(this.isDeleteUserShow) obj.user_number = JSON.stringify(this.userConfigObj.deleteUserName);
                        getConfirmRoleUserInfo(obj).then(({ data }) => {
                            this.handleOperationCallBack(data);
                        })
                    }
                })

            },

            // 启用禁用
            handleChangeState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    getSetStatusRoleInfo({
                        role_id: row.role_id
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            // 获取用户树形数据
            handleGetUserTreeData() {
                return new Promise(resolve => {
                    if (!this.optionList.treeUserList.length) {
                        getAddRoleNameTreeList().then(({ data }) => {
                            const treeCallBack = function (item) {
                                let isBack = true;
                                item.forEach(value => {
                                    if (value.child) {
                                        isBack = treeCallBack(value.child);
                                    }
                                    if (isBack && value.user_info) {
                                        if (value.child) {
                                            value.child.push(...value.user_info.split(',').map(_v => {
                                                return {
                                                    id: `${value.id}u_${_v.split('_')[0]}`,
                                                    name: _v.split('_')[1]
                                                }
                                            }))
                                        } else {
                                            value.child = value.user_info.split(',').map(_v => {
                                                return {
                                                    id: `${value.id}u_${_v.split('_')[0]}`,
                                                    name: _v.split('_')[1]
                                                }
                                            })
                                        }
                                    }
                                });
                                return isBack;
                            };

                            treeCallBack(data.data.value);
                            this.optionList.treeUserList = data.data.value;
                            resolve('computed')
                        })
                    } else {
                        resolve('computed');
                    }
                })
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.line = false;
                this.popover.user = false;
                this.productLineFilter = '';
                this.userNameFilter = '';
            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleCancelConfigInfo();
                    this.handleCancelRoleInfo();
                    this.handleQueryInfo({limit: this.pageData.currentList});
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'role_config',
                    value: JSON.stringify(this.queryData)
                });

                this.tableData = data.data.value;
                this.tableKey = ['序号', '角色名', '最后修改人','最后修改时间', '是否启用', '操作'];
                this.tableProps = ['index', 'role_name','update_name', 'update_date', 'status', 'operation'];
                this.tableWidth[0] = ['100'];

                this.pageData.currentList = data.page_data.limit;
                this.pageData.currentPage = data.page_data.offset;
                this.pageData.currentTotal = data.page_data.total;

                getRoleNameList().then(({ data }) => {
                    this.optionList.roleNameList = data.data.value;
                });
            }
        },
        created () {
            this.thisVm = this;
            getRoleNameList().then(({ data }) => {
                this.optionList.roleNameList = data.data.value;
            });
            getUserNameList().then(({ data }) => {
                this.optionList.userNameList = data.data.value;
            });
            try {
                if (JSON.stringify(this.productRoleConfigInfo) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['role_config']);
                    this.handleQueryInfoCallBack(this.productRoleConfigInfo);
                }
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "configObj.platform"(newVal, oldVal) {
                const [newEm, oldEm] = [newVal.some(_v => !_v), oldVal.some(_v => !_v)];
                if (newEm && !oldEm && newVal.length === this.optionList.platformList.length) {
                    this.configObj.platform = [];
                } else if (newEm && !oldEm) {
                    this.configObj.platform = this.optionList.platformList.map(_v => _v.id);
                } else if (newEm && oldEm) {
                    this.configObj.platform.splice(this.configObj.platform.indexOf(''), 1);
                }
            },
            "productLineFilter"(val) {
                this.$refs.lineEditor.filter(val);
            },
            "userNameFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        }
    }
</script>

<style lang="less" scoped>
    .ui-money {
        color: #fd7818;;
    }
    .icon-wx, .icon-danger {
        font-size: 12px;
    }
    .ui-status {
        padding-left: 5px;
        color: #3388ff
    }

    /deep/ .ui-layout_edit-dialog {
        .el-select, .el-input {
            width: 100% !important;
        }
        .el-dialog__body {
            max-height: 740px;
            overflow: auto;
        }
    }

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    //折叠条样式
    /deep/.el-collapse {
        border: 1px #e6e6e6 solid;
        margin-bottom: 10px;
        .el-collapse-item__header {
            text-align: left;
            height: 32px;
            line-height: 32px;
            font-size: 12px;
            background: #fafafa;
            padding-left: 20px;
            color: #333333;
            font-weight: bold;
            border-bottom: 1px #e6e6e6 solid;
            .el-collapse-item__arrow {
                line-height: 30px;
                color: #333333;
            }
        }
        .el-collapse-item__content {
            padding-bottom: 5px;
        }
        .ui-collapse_content {
            padding: 5px 0 0 10px;
            overflow: auto;
            box-sizing: border-box;
            min-height: 30px;
            p {
                padding: 0 0 5px 20px;
                position: relative;
                /*font-weight: 700;*/
                font-size: 12px;

                .ui-leftLine {
                    position: absolute;
                    left: 10px;
                    top: 4px;
                    height: 12px;
                    width: 2px;
                    background: #333333;
                }
            }
            li {
                float: left;
                text-align: left;
                margin: 0 0 5px 10px;
                width: 100px;
                border: 1px #c6e1fb solid;
                background: #f3faff;
                padding: 0 10px;
                height: 30px;
                display: table;
                span {
                    font-size: 12px;
                    display: table-cell;
                    vertical-align: middle;
                }
            }
        }
        .ui-line {
            li {
                height: 44px;
            }
        }
    }

    .ui-name_area {
        border: 1px #e6e6e6 solid;
        border-radius: 4px;
        padding: 0 0 5px 15px;
        li {
            float: left;
            height: 24px;
            span {
                font-size: 12px;
                margin-right: 10px
            }
        }
    }

    //表格
    table {
        border: 1px #e6e6e6 solid;
        margin-bottom: 10px;
        td {
            font-size: 12px;
            height: 36px;
            line-height: 36px;
            padding: 0 20px;
            border-right: 1px #e6e6e6 solid;
            border-bottom: 1px #e6e6e6 solid;
        }
        tr:last-child td{
            border-bottom: 0;
        }
        td:last-child {
            border-right: 0;
        }

        td:nth-child(2n-1) {
            width: 120px;
            background: #fafafa;
        }
        td:nth-child(2n) {
            width: 850px;
            color: #333333;
        }
    }

</style>
