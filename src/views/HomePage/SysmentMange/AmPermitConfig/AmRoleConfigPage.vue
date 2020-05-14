<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="角色名称">
                            <el-select v-model="queryData.roleName" size="small" filterable v-filter clearable>
                                <el-option v-for="item in optionList.roleNameList"
                                           :key="item.id" :value="item.id" :label="item.role_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="角色用户">
                            <el-select v-model="queryData.roleUser" size="small" filterable v-filter clearable>
                                <el-option v-for="item in optionList.roleUserList"
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
            <el-button type="text" @click="handleClickAdd" icon="icon-xinzeng1 icon-main">新增</el-button>
        </div>
        <div class="ui-main-module-table">
            <ComTableInfo
                    isCheck
                    @checked="handleSaveCheckInfo"
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
                    <el-button type="text" size="small" @click.stop="handleClickEdit(scope.row)">编辑</el-button>
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
        <el-dialog  top="5vh"
                    width="1040px"
                    custom-class="ui-layout_edit-dialog"
                    :visible.sync="isShowAdd"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :title="isShowModify ? '编辑' : '新增'"
                    @close="handleCancelEdit">
            <el-form ref="editData" :model="editData" size="small" label-width="100px">
                <el-form-item label="角色名">
                    <el-input placeholder="请输入" v-model="editData.roleName"></el-input>
                </el-form-item>
                <el-form-item label="团队">
                    <el-transfer
                            ref="teamtransfer"
                            filterable
                            filter-placeholder="可输入团队名称进行搜索"
                            v-model="editData.team"
                            :data="teamListData"
                            :titles="['全选', '清除已选']"
                            @change="handleEditChangeIn('team')">
                    </el-transfer>
                </el-form-item>
                <el-form-item label="小组">
                    <el-transfer
                            ref="grouptransfer"
                            filterable
                            filter-placeholder="可输入小组名称进行搜索"
                            v-model="editData.group"
                            :data="groupListData"
                            :titles="['全选', '清除已选']">
                    </el-transfer>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCancelEdit">取消</el-button>
                <el-button size="small" type="primary" @click="handleSaveEditInfo">保存</el-button>
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
                <table border="1" cellpadding="0" cellspacing="0" class="table">
                    <tr>
                        <td>用户名</td><td>{{saveUserName}}</td>
                    </tr>
                </table>
                <el-collapse v-model="activeName1">
                    <el-collapse-item title="分配团队" name="1">
                        <div class="ui-collapse_content">
                            <ul class="clearFix">
                                <li v-for="item in saveTeamInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-model="activeName2">
                    <el-collapse-item title="分配小组" name="1">
                        <div class="ui-collapse_content ui-line">
                            <ul class="clearFix">
                                <li v-for="item in saveGroupInfo">
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
                width="1000px"
                class="ui-layout_edit-dialog"
                :title="isDeleteUserShow ? '删除用户' : '添加用户'"
                :visible.sync="isAddUserShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
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
                            ref="popover"
                            placement="bottom-start"
                            width="800"
                            trigger="manual"
                            :visible-arrow="false"
                            v-model="popover.user"
                            @show="handleInTreeData()">
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
                                <el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input class="ui-popover__input" readonly v-popover:popover v-model="userConfigObj.addUserName"
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
        getGroupOptionList,
        getAccountOptionList,
        getPreviewAmRoleConfigInfo,
        getAllotTeamOptionList,
        getAmChangeStatusInfo,
        getAmRoleUserList,
        getAmRoleNameList,
        getAmAddRoleInfo,
        getAmRoleEditData,
        getAmModifyRoleInfo,
        getAmAddRoleNameTreeList,
        getAmRoleUserInfo,
        getAmConfirmRoleUserInfo,
    } from '@/api/system_manage/am_permit_config';

    export default {
        data () {
            return {

                // 时间搜索框宽度设置
                searchDateWidth: config.SEARCH_DATE_WIDTH,

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {
                    roleName: '',
                    roleUser: '',
                },
                saveDefaultTime: [],

                optionList: {
                    roleNameList: [],
                    roleUserList: [],
                    teamList: [],
                    groupList: [],
                    qgroupList: [],
                    accountList: [],
                    qaccountList: [],
                    treeUserList: []
                },

                groupListData: [],
                teamListData: [],

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                // 新增、编辑
                isShowAdd: false,
                isShowModify: false,
                isDisabled: false,
                saveRoleId: '',
                editData: {
                    roleName: '',
                    team: [],
                    group: [],
                },

                defaultProps: {
                    children: 'child',
                    label: 'name'
                },

                //tree搜索关键字
                userNameFilter: '',

                //查看
                isPreviewShow: false,
                activeName1: '1',
                activeName2: '1',
                saveUserName: '',
                saveTeamInfo: [],
                saveGroupInfo: [],

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
                defaultCheckedUserKeys: [],
                popover: {
                    user: false
                },

                //保存勾选数据
                saveCheckInfo: []
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'amRoleConfigInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetAmPermitRoleConfigListInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getGroupOptionList,
            getAccountOptionList,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['am_role_config']);
                }

                let obj = {
                    role_id: this.queryData.roleName,
                    user_number: this.queryData.roleUser,
                    ...params
                };

                this.GetAmPermitRoleConfigListInfo(obj).then(({data}) => {

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
                    roleUser: '',
                }
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

            //获取查询条件下拉
            handleGetOptionList() {
                getAmRoleUserList().then(({ data }) => {
                    this.optionList.roleUserList = data.data.value;
                });
                getAmRoleNameList().then(({ data }) => {
                    this.optionList.roleNameList = data.data.value;
                })
            },

            // 修改状态
            handleChangeState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    getAmChangeStatusInfo({
                        role_id: row.role_id
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            // 树形数据保存
            handleTreeCheckInfo(key) {
                const [labels, ids] = [[], []]
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    if (item.id.indexOf('u_') < 0) return;
                    labels.push(item.name);
                    ids.push(item.id);
                });
                this.userConfigObj.addUserName = Array.from(new Set(labels));
                this.userConfigObj.addUserId = ids;
                this.popover.user = false;
            },

            // 获取用户树形数据
            handleGetUserTreeData() {
                return new Promise(resolve => {
                    if (!this.optionList.treeUserList.length) {
                        getAmAddRoleNameTreeList().then(({ data }) => {
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
                                })
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

            // 保存勾选数据
            handleSaveCheckInfo(val) {
                this.saveCheckInfo = [...val];
            },

            //用户名搜索
            userNameFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 点击新增
            handleClickAdd() {
                this.isShowAdd = true;
                this.handleTeamList();
            },

            // 点击编辑
            handleClickEdit(row) {
                this.isShowAdd = true;
                this.isShowModify = true;
                this.editData.roleName = row.role_name;
                this.saveRoleId = row.role_id;
                getAmRoleEditData({
                    role_id: row.role_id
                }).then(({ data }) => {
                    if(data.status) {
                        this.editData.group = data.data.group_info.map(_v => _v.group_id);
                        this.editData.team = data.data.team_info.map(_v => _v.team_id);

                        this.handleEditChangeIn('team').then(res => {
                            this.isShowModify = true;
                            this.isShowAdd = true;
                            this.isDisabled = true;
                        })
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }

                });
                this.handleTeamList();
            },

            handleTeamList() {
                if(!this.optionList.teamList.length) {
                    getAllotTeamOptionList().then(({ data }) => {
                        this.optionList.teamList = data.data.value;
                        let list = [];
                        data.data.value.forEach(item => {
                            list.push({
                                label: item.team_name,
                                key: item.team_id
                            })
                        });
                        this.teamListData = list;
                    });
                }
            },

            // 带入tree数据
            handleInTreeData() {
                this.$nextTick().then(() => {
                    const checkIds = this.userConfigObj.addUserId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            // 带出数据
            handleEditChangeIn(type, _oj = 'editData') {
                let [key, fn, options] = ['', '', '']
                switch (type) {
                    case 'team':
                        key = 'team_id';
                        fn = 'getGroupOptionList';
                        options = 'groupList';
                        break;
//                    case 'group':
//                        key = 'group_id';
//                        fn = 'getAccountOptionList';
//                        options = _oj === 'editData' ? 'accountList' : 'qaccountList';
//                        break;
                }
                let obj = {
                    [key]: Array.isArray(this[_oj][type]) ? this[_oj][type].join(',') : this[_oj][type]
                };

                return new Promise(resolve => {
                    this[fn](obj).then(({ data }) => {
                        if(data.status) {
                            this.optionList[options] = data.data.value;
                            let arr = [];
                            data.data.value.forEach(item => {
                                arr.push({
                                    label: item.group_name,
                                    key: item.group_id
                                })
                            });
                            this.groupListData = arr;
                            resolve(type);
                        }else {
                            this.editData.group = [];
                            this.groupListData = [];
                        }
                    });
                })
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.user = false;
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    roleName: '',
                    team: [],
                    group: [],
                };
                this.groupListData = [];
                this.isShowAdd = false;
                this.isShowModify = false;
                this.isDisabled = false;
                this.$refs.teamtransfer.clearQuery('left');
                this.$refs.teamtransfer.clearQuery('right');
                this.$refs.grouptransfer.clearQuery('left');
                this.$refs.grouptransfer.clearQuery('right');
            },



            // 保存
            handleSaveEditInfo() {

                let obj = {
                    role_name: JSON.stringify([this.editData.roleName]),
                    group_id: JSON.stringify(this.editData.group),
                    update_user: JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name])
                };

                if(!this.isShowModify) {
                    getAmAddRoleInfo(obj).then(({ data }) => {
                        this.handleOperationCallBack(data, () => {
                            this.handleCancelEdit();
                        });
                    })
                }else {
                    obj.role_id = JSON.stringify([this.saveRoleId]);
                    obj.update_info = JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name]);
                    getAmModifyRoleInfo(obj).then(({ data }) => {
                        this.handleOperationCallBack(data, () => {
                            this.handleCancelEdit();
                        });
                    })
                }
            },

            //添加、删除用户
            handleEmendationUserInfo(row, type) {
                this.handleGetUserTreeData().then(res => {
                    getAmRoleUserInfo({
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
                this.userNameFilter = '';
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
                        getAmConfirmRoleUserInfo(obj).then(({ data }) => {
                            this.handleOperationCallBack(data);
                            this.handleCancelRoleInfo();
                        })
                    }
                })

            },

            //查看
            handlePreviewInfo(row) {
                this.saveUserName = row.role_name;
                getPreviewAmRoleConfigInfo({
                    role_id: row.role_id
                }).then(({ data }) => {
                    if(data.status) {
                        this.isPreviewShow = true;
                        this.saveTeamInfo = data.data.value.team_info.map(item => item.team_name);
                        this.saveGroupInfo = data.data.value.group_info.map(item => item.group_name);
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },


            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
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
                    key: 'am_role_config',
                    value: JSON.stringify(this.queryData)
                });
                this.tableData = data.data.value;
                this.tableKey = ['序号', '角色名','最后修改人', '最后修改时间', '是否启用', '操作'];
                this.tableProps = ['index', 'role_name','update_name', 'update_date', 'status', 'operation'];
                this.tableWidth = ['100'];

                this.pageData.currentList = data.page_data.limit;
                this.pageData.currentPage = data.page_data.offset;
                this.pageData.currentTotal = data.page_data.total;

                getAmRoleNameList().then(({ data }) => {
                    this.optionList.roleNameList = data.data.value;
                })
            }
        },
        created () {
            this.thisVm = this;
            this.handleGetUserTreeData();
            this.handleGetOptionList();
            try {
                if (JSON.stringify(this.amRoleConfigInfo) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['am_role_config']);
                    this.handleQueryInfoCallBack(this.amRoleConfigInfo);
                }
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "userNameFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
        }
    }
</script>

<style lang="less" scoped>
    .ui-money {
        color: #fd7818;
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
        .el-form-item__content {

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
            li {
                float: left;
                text-align: left;
                margin: 0 10px 5px 10px;
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
                width: 130px;
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
            width: 880px;
            color: #333333;
        }
    }

    /deep/.el-transfer {
        .el-transfer-panel__item.el-checkbox {
            width: 105px!important;
        }
    }
</style>
