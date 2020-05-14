<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="直属部门">
                            <el-popover
                                    ref="popover"
                                    placement="bottom-start"
                                    width="500"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.query">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input
                                                size="small"
                                                placeholder="输入关键字进行搜索"
                                                v-model="depNameFilter">
                                        </el-input>
                                        <el-tree
                                                ref="treeEditor1"
                                                node-key="id"
                                                :data="optionList.qdepList"
                                                :expand-on-click-node="false"
                                                :props="defaultProps"
                                                :filter-node-method="depNameFilterNode"
                                                @node-click="handleCheckTree">
                                        </el-tree>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.dep" @focus="popover.query = true"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="角色名称">
                            <el-select v-model="queryData.roleName" size="small" filterable v-filter clearable>
                                <el-option v-for="item in optionList.roleNameList"
                                           :key="item.id" :value="item.id" :label="item.role_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="用户名">
                            <el-select v-model="queryData.user" size="small" filterable v-filter clearable>
                                <el-option v-for="item in optionList.userList"
                                           :key="item.user_number" :value="item.user_number" :label="item.user_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="分配团队">
                            <el-select v-model="queryData.team" size="small" filterable v-filter clearable
                                       @change="handleEditChangeIn('team', 'queryData')" @clear="handleClear('team')">
                                <el-option v-for="item of optionList.teamList"
                                           :label="item.team_name"
                                           :value="item.team_id"
                                           :key="item.team_id"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="分配小组">
                            <el-select :disabled="!queryData.team" v-model="queryData.group" size="small" filterable v-filter clearable
                                       @change="handleEditChangeIn('group', 'queryData')" @clear="handleClear('group')">
                                <el-option v-for="item of optionList.qgroupList"
                                           :label="item.group_name"
                                           :value="item.group_id"
                                           :key="item.group_id"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="分配账号">
                            <el-select :disabled="!queryData.group" v-model="queryData.account" size="small" filterable v-filter clearable>
                                <el-option v-for="item of optionList.qaccountList"
                                           :label="item.account_name"
                                           :value="item.id"
                                           :key="item.id"></el-option>
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
            <el-button type="text" @click="handleBatchApply" icon="icon-piliangshouquan icon-warn">批量授权</el-button>
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
                <template slot="user_name" slot-scope="scope">
                    <span>{{scope.row.user_name + '_' + scope.row.user_number}}</span>
                </template>
                <template slot="status" slot-scope="scope">
                    <el-button type="text" size="small" @click.stop="handleChangeState(scope.row)" :class="scope.row.status == 1 ? 'icon-kaiqi icon-wx' : 'icon-tingyong icon-danger'"><span class="ui-status">{{scope.row.status == 1 ? '启用' : '禁用'}}</span></el-button>
                </template>
                <template slot="operation" slot-scope="scope">
                    <el-button type="text" size="small" @click.stop="handlePreviewInfo(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click.stop="handleClickEdit(scope.row)">编辑</el-button>
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
        <el-dialog custom-class="ui-layout_edit-dialog" :visible.sync="isShowAdd" :title="title" top="4vh"
                   width="1020px" @close="handleCancelEdit" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-form ref="editData" :model="editData" :rules="editRule" size="small">
                <el-form-item label="用户名" :label-width="labelWidth">
                    <el-popover
                            ref="popover"
                            placement="bottom-start"
                            width="800"
                            trigger="manual"
                            :visible-arrow="false"
                            @show="handleInTreeData"
                            v-model="popover.editor">
                        <div class="ui-input__tree">
                            <div class="ui-base--area">
                                <el-input
                                        size="small"
                                        placeholder="输入关键字进行搜索"
                                        v-model="userNameFilter">
                                </el-input>
                                <el-tree
                                        ref="treeEditor"
                                        :data="optionList.treeUserList"
                                        show-checkbox
                                        node-key="id"
                                        :props="defaultProps"
                                        :filter-node-method="userNameFilterNode">
                                </el-tree>
                            </div>
                            <div class="ui-tree__btn">
                                <el-button type="text" @click="popover.editor = false">关闭</el-button>
                                <el-button type="text" @click="handleTreeCheckInfo('editData')">确定</el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input class="ui-popover__input" readonly :disabled="isDisabled" v-popover:popover v-model="editData.userName" @focus="popover.editor = true"></el-input>
                </el-form-item>
                <!--@change="handleEditChangeIn('team')"-->
                <el-form-item label="团队" :label-width="labelWidth">
                    <el-select v-model="editData.team" size="small" filterable
                               @change="handleChangeTeam">
                        <el-option v-for="item of optionList.teamList"
                                   :label="item.team_name"
                                   :value="item.team_id"
                                   :key="item.team_id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="小组" :label-width="labelWidth">
                    <el-transfer
                            ref="grouptransfer"
                            class="ui-group_area"
                            filterable
                            filter-placeholder="可输入小组名称进行搜索"
                            v-model="editData.group"
                            :data="groupListData"
                            :titles="['全选', '清除已选']"
                            @change="handleEditChangeIn('group')">
                    </el-transfer>
                </el-form-item>
                <el-form-item label="账号" :label-width="labelWidth">
                    <el-transfer
                            ref="accounttransfer"
                            filterable
                            filter-placeholder="可输入账号名称进行搜索"
                            v-model="editData.account"
                            :data="accountListData"
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
                        <div class="ui-collapse_content">
                            <ul class="clearFix">
                                <li v-for="item in saveGroupInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
                <el-collapse v-model="activeName3">
                    <el-collapse-item title="分配账号" name="1">
                        <div class="ui-collapse_content ui-line">
                            <ul class="clearFix">
                                <li v-for="item in saveAccountInfo">
                                    <span>{{item}}</span>
                                </li>
                            </ul>
                        </div>
                    </el-collapse-item>
                </el-collapse>
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
        getAllotTeamOptionList,
        getGroupOptionList,
        getAccountOptionList,
        getUserOptionList,
        saveEditorInfo,
        getEditorInfo,
        getUserBlToDevInfo,
        changeState,
        getDepartmentOptionList,
        getPreviewAmUserConfigInfo,
        getAmRoleNameList
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
                    dep: '',
                    depId: '',
                    user: '',
                    team: '',
                    group: '',
                    account: '',
                    roleName: '',
                },
                saveDefaultTime: [],

                optionList: {
                    depList: [],
                    qdepList: [],
                    userList: [],
                    teamList: [],
                    groupList: [],
                    qgroupList: [],
                    accountList: [],
                    qaccountList: [],
                    treeUserList: [],
                    roleNameList: [],
                },

                groupListData: [],
                accountListData: [],

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

                // 新增
                isShowAdd: false,
                isDisabled: false,
                title: '',
                labelWidth: '80px',
                editData: {
                    userName: '',
                    userId: [],
                    team: '',
                    group: [],
                    account: [],
                    userNum: ''
                },
                editRule: {},

                popover: {
                    editor: false,
                    query: false
                },

                defaultProps: {
                    children: 'child',
                    label: 'name'
                },

                //tree搜索关键字
                userNameFilter: '',
                depNameFilter: '',

                //查看
                isPreviewShow: false,
                activeName1: '1',
                activeName2: '1',
                activeName3: '1',
                saveUserName: '',
                saveTeamInfo: [],
                saveGroupInfo: [],
                saveAccountInfo: [],

                //保存勾选数据
                saveCheckInfo: []
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'amUserConfigInfo',
                'comOptions'
            ])
        },
        methods: {
            ...mapActions([
                'GetAmPermitUserConfigListInfo'
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
                    this.queryData = JSON.parse(this.queryParamsInfo['am_user_config']);
                }

                let obj = {
                    apartment_id: this.queryData.depId,
                    user_number: this.queryData.user,
                    role_id: this.queryData.roleName,
                    team_id: this.queryData.team,
                    group_id: this.queryData.group,
                    account_id: this.queryData.account,
                    ...params
                };

                this.GetAmPermitUserConfigListInfo(obj).then(({data}) => {

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
                    dep: '',
                    user: '',
                    team: '',
                    group: '',
                    account: '',
                    roleName: ''
                }
            },

            //高级筛选
            handleClickFilter () {
                this.FilterShow = !this.FilterShow;
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

            // 修改状态
            handleChangeState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    changeState({
                        user_number: row.user_number
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            // 点击部门树形数据
            handleCheckTree(res) {
                getUserBlToDevInfo({
                    apart_id: res.id
                }).then(({ data }) => {
                    this.optionList.userList = data.data.value;
                    this.queryData.dep = res.name;
                    this.queryData.depId = res.id;
                    this.popover.query = false;
                    this.depNameFilter = '';
                    this.handleSaveOptionList();
                })
            },
            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'user_option',
                    value: this.optionList
                })
            },

            // 树形数据保存
            handleTreeCheckInfo(key) {
                const [labels, ids] = [[], []]
                this.$refs.treeEditor.getCheckedNodes().forEach(value => {
                    if (value.id.indexOf('u_') < 0) return;
                    labels.push(value.name);
                    ids.push(value.id);
                });
                this.editData.userName = labels.join(',');
                this.editData.userId = ids;
                this.popover.editor = false;
            },

            // 获取用户树形数据
            handleGetUserTreeData() {
                return new Promise(resolve => {
                    if (!this.optionList.treeUserList.length) {
                        getUserOptionList().then(({ data }) => {
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
            //直属部门搜索
            depNameFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 点击批量授权
            handleBatchApply() {
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选数据！');
                    return;
                }
                this.handleGetUserTreeData().then(res => {
                    this.isShowAdd = true;
                    this.title = '批量授权';
                    let [userId, userName] = [[], []]
                    this.saveCheckInfo.forEach(_v => {
                        userName.push(_v.user_name);
                        userId.push(_v.user_number);
                    });
                    this.editData.userName = userName.join(',');
                    this.editData.userId = userId;
                    this.isDisabled = true;
                })
            },

            // 点击新增
            handleClickAdd() {
                this.isShowAdd = true;
                this.title = '新增';
//                this.handleGetUserTreeData().then(res => {
//
//
//                })
            },

            // 点击编辑
            handleClickEdit({ user_number, user_name }) {
                this.title = '编辑';
                this.editData.userName = user_name;
                this.editData.userNum = user_number;
                getEditorInfo({ user_number }).then(({ data }) => {
                    if(data.status) {
                        this.isShowAdd = true;
                        this.isDisabled = true;
                        this.editData.account = data.data.account_info.map(_v => _v.id);
                        this.editData.group = data.data.group_info.map(_v => _v.group_id);
                        this.editData.team = data.data.team_info.map(_v => _v.team_id)[0] || '';
                        this.editData.userId = Array.isArray(data.data.user_info) ? [data.data.user_info.user_number] : [];
                        this.handleEditChangeIn('team').then(res => {
                            if(res) {
                                this.handleEditChangeIn('group').then(res => {
                                    this.handleGetUserTreeData().then(res => {

                                        // this.$refs.treeEditor.setCurrentKey(this.editData.userId);
                                    })
                                })
                            }
                        }).catch(e => {
                            console.log(e);
                        })
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },

            //切换团队
            handleChangeTeam(val) {
                if(val) {
                    this.editData.group = [];
                    this.accountListData = [];
                    this.editData.account = [];
                    this.getGroupOptionList({
                        team_id: val
                    }).then(({ data }) => {
                        if(data.status) {
                            let arr = [];
                            data.data.value.forEach(item => {
                                arr.push({
                                    label: item.group_name,
                                    key: item.group_id
                                })
                            });
                            this.groupListData = arr;
                        }else {
                            this.$message.error(data.errorMess || '操作失败')
                        }
                    })
                }
            },

            // 带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.editData.userId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                })
            },

            //清空数据
            handleClear(type) {
                if (type === 'team') {
                    this.queryData.group = '';
                    this.queryData.account = '';
                    this.optionList.qgroupList = [];
                    this.optionList.qaccountList = [];
                }else if (type === 'group') {
                    this.queryData.account = '';
                    this.optionList.qaccountList = [];
                }
            },

            // 带出数据
            handleEditChangeIn(type, _oj = 'editData') {

                let [key, fn, options] = ['', '', ''];
                switch (type) {
                    case 'team':
                        key = 'team_id';
                        fn = 'getGroupOptionList';
                        options = _oj === 'editData' ? 'groupList' : 'qgroupList';
                        break;
                    case 'group':
                        key = 'group_id';
                        fn = 'getAccountOptionList';
                        options = _oj === 'editData' ? 'accountList' : 'qaccountList';
                        break;
                }

                let obj = {
                    [key]: Array.isArray(this[_oj][type]) ? this[_oj][type].join(',') : this[_oj][type]
                };

                return new Promise((resolve, reject) => {
                    this[fn](obj).then(({ data }) => {
                        if(data.status) {
                            if (options === 'accountList') {
                                this.optionList[options] = [{
                                    account_name: '全选',
                                    id: ''
                                }, ...data.data.value];

                                let arr = [];
                                data.data.value.forEach(item => {
                                    arr.push({
                                        label: item.account_name,
                                        key: item.id
                                    })
                                });
                                this.accountListData = arr;
                                this.handleSaveOptionList();
                            } else {
                                let arr = [];
                                data.data.value.forEach(item => {
                                    arr.push({
                                        label: item.group_name,
                                        key: item.group_id
                                    })
                                });
                                this.groupListData = arr;
                                this.optionList[options] = data.data.value;
                                this.handleSaveOptionList();
                            }
                            resolve(type);
                        }else {
//                            reject(type)
                        }
                    });
                })
            },

            // 取消编辑
            handleCancelEdit() {
                this.editData = {
                    userName: '',
                    userId: [],
                    team: '',
                    group: [],
                    account: [],
                };
//                this.$refs.editData.resetFields();
                this.groupListData = [];
                this.accountListData = [];
                this.userNameFilter = '';
                this.isShowAdd = false;
                this.popover.editor = false;
                this.isDisabled = false;
                this.$refs.grouptransfer.clearQuery('left');
                this.$refs.grouptransfer.clearQuery('right');
                this.$refs.accounttransfer.clearQuery('left');
                this.$refs.accounttransfer.clearQuery('right');
            },

            // 保存
            handleSaveEditInfo() {
                let user_info = this.editData.userId.reduce((_c, _i) => {
                    // 去掉空选项并去掉用来做标识的部门ID
                    let _append = _i && _i.replace(/^[0-9]+u_/, '');
                    if (_append) return [..._c, _append];
                    else return _c;
                }, []);

                let obj = {
                    user_info: JSON.stringify(user_info),
                    account_info: JSON.stringify(this.editData.account),
                    update_user: JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name])
                };
                if(this.title === '编辑') {
                    obj.user_info = JSON.stringify([this.editData.userNum])
                }
                saveEditorInfo(obj).then(({ data }) => {
                    this.handleOperationCallBack(data, () => {
                        this.$refs.treeEditor.setCurrentKey([]);
                        this.handleCancelEdit();
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
                this.popover.query = false;
                this.popover.editor = false;
                this.depNameFilter = '';
            },

            //查看
            handlePreviewInfo(row) {
                getPreviewAmUserConfigInfo({
                    user_number: row.user_number
                }).then(({ data }) => {
                    if(data.status) {
                        this.isPreviewShow = true;
                        this.saveUserName = data.data.user_info.user_name;
                        this.saveTeamInfo = data.data.team_info.map(item => item.team_name);
                        this.saveGroupInfo = data.data.group_info.map(item => item.group_name);
                        this.saveAccountInfo = data.data.account_info.map(item => item.account_name);
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
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
                    key: 'am_user_config',
                    value: JSON.stringify(this.queryData)
                });
                this.tableKey = ['序号', '用户名', '直属部门','所属角色', '最后修改人', '最后修改时间', '是否启用', '操作'];
                this.tableData = data.data.value;
                this.tableProps = ['index', 'user_name', 'apartment_name', 'role_name','update_name', 'update_date', 'status', 'operation'];
                this.tableWidth = ['60', '150', '', '250', '150', '150', '150', '200'];

                this.pageData.currentList = data.page_data.limit;
                this.pageData.currentPage = data.page_data.offset;
                this.pageData.currentTotal = data.page_data.total;

                getAmRoleNameList().then(({ data }) => {
                    this.optionList.roleNameList = data.data.value;
                });
            }
        },
        created () {
            this.thisVm = this;
            getAllotTeamOptionList().then(({ data }) => {
                this.optionList.teamList = data.data.value;
            });
            getDepartmentOptionList().then(({ data }) => {
                this.optionList.qdepList = data.data.value;
            });
            getAmRoleNameList().then(({ data }) => {
                this.optionList.roleNameList = data.data.value;
            });
            this.handleGetUserTreeData();
            try {
                if (JSON.stringify(this.amUserConfigInfo) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['am_user_config']);
                    this.handleQueryInfoCallBack(this.amUserConfigInfo);
                    if (this.comOptions['user_option']) this.optionList = this.comOptions['user_option'];
                }
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "editData.account"(newVal, oldVal) {
                const [newEm, oldEm] = [newVal.some(_v => !_v), oldVal.some(_v => !_v)];
                if (newEm && !oldEm && newVal.length === this.optionList.accountList.length) {
                    this.editData.account = [];
                } else if (newEm && !oldEm) {
                    this.editData.account = this.optionList.accountList.map(_v => _v.id);
                } else if (newEm && oldEm) {
                    this.editData.account.splice(this.editData.account.indexOf(''), 1);
                }
            },
            "editData.group"(val) {
                if (!val.length) {
                    this.editData.account = [];
                    this.accountListData = [];
                }
            },
            "userNameFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
            "depNameFilter"(val) {
                this.$refs.treeEditor1.filter(val);
            }

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
            width: 850px;
            color: #333333;
        }
    }

    /deep/.ui-group_area {
        .el-transfer-panel__item.el-checkbox {
            width: 105px!important;
        }

    }


</style>
