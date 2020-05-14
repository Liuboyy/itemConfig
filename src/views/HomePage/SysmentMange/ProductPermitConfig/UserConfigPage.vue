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
                        <SearchRequirement label="用户名">
                            <el-select v-model="queryData.userName" size="small" filterable v-filter>
                                <el-option v-for="item in optionList.userNameList"
                                           :key="item.user_number" :value="item.user_number" :label="item.user_name + '_'+ item.user_number"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线">
                            <el-popover
                                    ref="popover2"
                                    width="400"
                                    placement="bottom-start"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.line_query"
                                    @show="handleInTreeData('line_query')">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input
                                                size="small"
                                                placeholder="输入关键字进行搜索"
                                                v-model="queryProductLineFilter">
                                        </el-input>
                                        <el-tree
                                                ref="treeEditor1"
                                                node-key="id"
                                                show-checkbox
                                                :data="optionList.productLineList"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :props="defaultProps"
                                                :filter-node-method="queryProductLineFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.line_query = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo('line_query')">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover2 v-model="queryData.productLineName"
                                      @focus="popover.line_query = true"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发人员">
                            <el-select v-model="queryData.developer" size="small" filterable multiple collapseTags v-filter>
                                <el-option v-for="item in optionList.developerList"
                                           :key="item.user_id" :value="item.user_id" :label="item.user_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select v-model="queryData.platform" size="small" filterable multiple collapseTags v-filter>
                                <el-option v-for="item in optionList.queryPlatformList"
                                           :key="item.id" :value="item.id" :label="item.platform_name"></el-option>
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
                <template slot="status" slot-scope="scope">
                    <el-button type="text" size="small" @click.stop="handleChangeState(scope.row)" :class="scope.row.status == 1 ? 'icon-kaiqi icon-wx' : 'icon-tingyong icon-danger'"><span class="ui-status">{{scope.row.status == 1 ? '启用' : '禁用'}}</span></el-button>
                </template>
                <template slot="user_name" slot-scope="scope">
                    <span>{{scope.row.user_name + '_' + scope.row.user_number}}</span>
                </template>
                <template slot="operation" slot-scope="scope">
                    <el-button type="text" size="small" @click.stop="handlePreviewInfo(scope.row)">查看</el-button>
                    <el-button type="text" size="small" @click.stop="handleEditConfigInfo(scope.row)">编辑</el-button>
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
                top="5vh"
                :title="title"
                width="1000px"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleCancelConfigInfo">
            <el-form ref="configObj" :model="configObj" size="small" label-width="80px">
                <el-form-item label="用户名">
                    <el-popover
                            ref="popover"
                            placement="bottom-start"
                            width="800"
                            trigger="manual"
                            :visible-arrow="false"
                            v-model="popover.user_edit">
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
                                        :data="optionList.treeUserList"
                                        :props="defaultProps"
                                        :filter-node-method="userNameFilterNode">
                                </el-tree>
                            </div>
                            <div class="ui-tree__btn">
                                <el-button type="text" @click="popover.user_edit = false">关闭</el-button>
                                <el-button type="text" @click="handleTreeCheckInfo('user_edit')">确定</el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input class="ui-popover__input" readonly v-popover:popover v-model="configObj.userName"
                              @focus="popover.user_edit = true" :disabled="isModifyShow"></el-input>
                </el-form-item>
                <el-form-item label="产品线">
                    <el-popover
                            ref="popover2"
                            width="800"
                            placement="bottom-start"
                            trigger="manual"
                            :visible-arrow="false"
                            @show="handleInTreeData('line_edit')"
                            v-model="popover.line_edit">
                        <div class="ui-input__tree">
                            <div class="ui-base--area">
                                <el-input
                                        size="small"
                                        placeholder="输入关键字进行搜索"
                                        v-model="editProductLineFilter">
                                </el-input>
                                <el-tree
                                        ref="treeEditor2"
                                        node-key="id"
                                        show-checkbox
                                        :default-expanded-keys="defaultCheckedKeys"
                                        :data="optionList.productLineList"
                                        :props="defaultProps"
                                        :filter-node-method="editProductLineFilterNode">
                                </el-tree>
                            </div>
                            <div class="ui-tree__btn">
                                <el-button type="text" @click="popover.line_edit = false">关闭</el-button>
                                <el-button type="text" @click="handleTreeCheckInfo('line_edit')">确定</el-button>
                            </div>
                        </div>
                    </el-popover>
                    <el-input class="ui-popover__input" readonly size="small" v-popover:popover2 v-model="configObj.productLineName"
                              @focus="popover.line_edit = true" :disabled="isBatch && !isLineEdit"></el-input>
                    <el-button icon="icon-bianjihexiugai icon-plain" type="text" v-if="isBatch" @click="handleClickEdit('line')"></el-button>
                </el-form-item>
                <el-form-item label="开发人员">
                    <!--<el-transfer-->
                            <!--class="ui-dev_area"-->
                            <!--ref="devtransfer"-->
                            <!--filterable-->
                            <!--filter-placeholder="可输入人员名称进行搜索"-->
                            <!--v-model="configObj.developer"-->
                            <!--:data="developerListData"-->
                            <!--:titles="['全选', '清除已选']">-->
                    <!--</el-transfer>-->
                    <el-select v-model="configObj.developer" size="small" filterable multiple :disabled="isBatch && !isDevEdit">
                        <el-option v-for="item in optionList.developerList"
                                   :label="item.user_name"
                                   :value="item.user_id"
                                   :key="item.user_id"></el-option>
                    </el-select>
                    <el-button icon="icon-bianjihexiugai icon-plain" type="text" v-if="isBatch" @click="handleClickEdit('developer')"></el-button>
                </el-form-item>
                <el-form-item label="平台">
                    <el-select v-model="configObj.platform" size="small" multiple filterable @focus="handleChangePlatform">
                        <el-option v-for="item in optionList.platformList"
                                   :label="item.platform_name"
                                   :value="item.id"
                                   :key="item.id"></el-option>
                    </el-select>
                    <!--<el-transfer-->
                            <!--ref="platformtransfer"-->
                            <!--filterable-->
                            <!--filter-placeholder="可输入平台名称进行搜索"-->
                            <!--v-model="configObj.platform"-->
                            <!--:data="platformListData"-->
                            <!--:titles="['全选', '清除已选']">-->
                    <!--</el-transfer>-->
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
                <table border="1" cellpadding="0" cellspacing="0" class="table">
                    <tr>
                        <td>用户名</td><td>{{saveUserName}}</td>
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
        getProductLineList,
        getDeveloperList,
        getPlatformList,
        getAddUserNameTreeList,
        getSetStatusInfo,
        getConfirmConfigInfo,
        getEditConfigInfo,
        getBatchApplyConfigInfo,
        getPreviewConfigInfo
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
                    productLineName: '',
                    productLineId: [],
                    developer: [],
                    platform: [],
                },

                optionList: {
                    roleNameList: [],
                    userNameList: [],
                    productLineList: [],
                    developerList: [],
                    platformList: [],
                    queryPlatformList: [],
                    treeUserList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth: [],

                developerListData: [],
                platformListData: [],

                popover: {
                    line_query: false,
                    line_edit: false,
                    user_edit: false,
                },

                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                defaultCheckedKeys: [],
                defaultQueryKeys: [],

                //tree搜索关键字
                queryProductLineFilter: '',
                editProductLineFilter: '',
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
                isDisabled: false,
                isBatch: false,     //是否点击批量授权
                isLineEdit: false,  //是否点击产品线编辑
                isDevEdit: false,   //是否点击开发人员编辑
                lineStatus: '0',
                devStatus: '0',
                title: '',
                configObj: {
                    userName: '',
                    userId: [],
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

                saveCheckInfo: []
            };
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'productUserConfigInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetProductUserConfigInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['user_config']);
                }

                let obj = {
                    role_id: this.queryData.roleName,
                    user_number: this.queryData.userName,
                    linelist_id: this.queryData.productLineId.join(','),
                    producter_id: this.queryData.developer.join(','),
                    platform_id: this.queryData.platform.join(','),
                    ...params
                };

                this.GetProductUserConfigInfo(obj).then(({data}) => {

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
                    productLineName: '',
                    productLineId: [],
                    developer: [],
                    platform: [],
                }
            },

            //获取所有下拉数据
            handleGetOptionList() {
                getRoleNameList().then(({ data }) => {
                    this.optionList.roleNameList = data.data.value;
                });
                getUserNameList().then(({ data }) => {
                    this.optionList.userNameList = data.data.value;
                });
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                getDeveloperList().then(({ data }) => {
                    this.optionList.developerList = data.data.value;

                    let arr = [];
                    data.data.value.forEach(item => {
                        arr.push({
                            label: item.user_name,
                            key: item.user_id
                        })
                    });
                    this.developerListData = arr;

                });
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data.value;
                    this.optionList.queryPlatformList = data.data.value;

                    let arr = [];
                    data.data.value.forEach(item => {
                        arr.push({
                            label: item.platform_name,
                            key: item.id
                        })
                    });
                    this.platformListData = arr;
                });
            },

            //点击查看
            handlePreviewInfo(row) {
                this.saveUserName = row.user_name;
                getPreviewConfigInfo({
                    user_number: row.user_number
                }).then(({ data }) => {
                    if(data.status) {
                        this.isPreviewShow = true;
                        this.saveDevInfo = data.data.value.producter_info.map(item => item.user_name);
                        this.savePlatformInfo = data.data.value.platform_info.map(item => item.platform_name);
                        this.saveOneLineInfo = data.data.value.line_info.level_one_name.split(',');
                        this.saveTwoLineInfo = data.data.value.line_info.level_two_name.split(',');
                        this.saveThreeLineInfo = data.data.value.line_info.level_three_name.split(',');
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
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

            //产品线关键字搜索
            queryProductLineFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            editProductLineFilterNode(value, data) {
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
                    case 'line_query':
                        this.$nextTick(() => {
                            const checkIds = this.queryData.productLineId;
                            this.$refs.treeEditor1.setCheckedKeys(checkIds);
                        });
                        break;
                    case 'line_edit':
                        this.$nextTick(() => {
                            const checkIds = this.configObj.productLineId;
                            this.$refs.treeEditor2.setCheckedKeys(checkIds);
                        });
                        break;
                }
            },

            //点击新增
            handleAddConfigInfo() {
                this.handleGetUserTreeData().then(() => {
                    this.isAddShow = true;
                    this.title = '新增';
                });
            },

            //点击编辑
            handleEditConfigInfo(row) {
                getEditConfigInfo({
                    user_number: row.user_number
                }).then(({ data }) => {
                    if(data.status) {
                        this.configObj.userName = row.user_name;
                        this.configObj.userId = row.user_number;
                        this.configObj.productLineName = data.data.value.line_info.map(item => item.power_name).join(',');
                        this.configObj.productLineId = data.data.value.line_info.map(item => item.power_id);
                        this.configObj.developer = data.data.value.producter_info.map(item => item.power_id);
                        this.configObj.platform = data.data.value.platform_info.map(item => item.power_id);
                        this.defaultCheckedKeys = this.configObj.productLineId;
                        this.isAddShow = true;
                        this.isModifyShow = true;
                        this.title = '编辑';
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },

            //批量授权
            handleBatchApply() {
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选数据！');
                    return;
                }

                this.isAddShow = true;
                this.isBatch = true;
                this.title = '批量授权';
                let [userId, userName] = [[], []];
                this.saveCheckInfo.forEach(_v => {
                    userName.push(_v.user_name);
                    userId.push(_v.user_number);
                });
                this.configObj.userName = userName.join(',');
                this.configObj.userId = userId;
            },

            //点击编辑按钮
            handleClickEdit(val) {
                if(val && val === 'line') {
                    this.isLineEdit = true;
                    this.lineStatus = '1'
                }
                if(val && val === 'developer') {
                    this.isDevEdit = true;
                    this.devStatus = '1'
                }
            },

            //取消
            handleCancelConfigInfo() {
                this.isAddShow = false;
                this.isModifyShow = false;
                this.isBatch = false;
                this.isLineEdit = false;
                this.isDevEdit = false;
                this.lineStatus = '0';
                this.devStatus = '0';
                this.configObj.userName = '';
                this.configObj.userId = [];
                this.configObj.productLineName = '';
                this.configObj.productLineId = [];
                this.configObj.developer = [];
                this.configObj.platform = [];
                this.defaultCheckedKeys = [];
                this.popover.line_edit = false;
                this.popover.user_edit = false;
            },

            //保存提交
            handleConfirmConfigInfo() {
                this.$refs['configObj'].validate((res) => {
                    if(res) {

                        let obj = {
                            user_number: JSON.stringify([this.configObj.userId]),
                            product_id: JSON.stringify(this.configObj.productLineId),
                            producter_id: JSON.stringify(this.configObj.developer),
                            platform_id: JSON.stringify(this.configObj.platform),
                            update_user_info: JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name])
                        };

                        if(this.isAddShow && !this.isModifyShow) {
                            let user_info = this.configObj.userId.reduce((_c, _i) => {
                                // 去掉空选项并去掉用来做标识的部门ID
                                let _append = _i && _i.replace(/^[0-9]+u_/, '');
                                if (_append) return [..._c, _append]
                                else return _c;
                            }, []);
                            obj.user_number = JSON.stringify(user_info);
                        }

                        if(this.isBatch) {
                            let lineArr = {
                                status: this.lineStatus,
                                value: this.configObj.productLineId || []
                            };

                            let devArr = {
                                status: this.devStatus,
                                value: this.configObj.developer || []
                            };

                            obj.user_number = JSON.stringify(this.configObj.userId);
                            obj.product_id = JSON.stringify(lineArr);
                            obj.producter_id = JSON.stringify(devArr);
                            getBatchApplyConfigInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data);
                            })
                        }else {
                            getConfirmConfigInfo(obj).then(({ data }) => {
                                this.handleOperationCallBack(data);
                            })
                        }
                    }
                });
            },

            // 获取用户树形数据
            handleGetUserTreeData() {
                return new Promise(resolve => {
                    getAddUserNameTreeList().then(({ data }) => {
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
                })
            },

            // 启用禁用
            handleChangeState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    getSetStatusInfo({
                        user_number: row.user_number
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            // 树形数据保存
            handleTreeCheckInfo(type) {
                const [labels, ids] = [[], []];
                switch (type) {
                    case 'user_edit':
                        this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                            if (item.id.indexOf('u_') < 0) return;
                            labels.push(item.name);
                            ids.push(item.id);
                        });
                        this.configObj.userName = labels.join(',');
                        this.configObj.userId = ids;
                        this.popover.user_edit = false;
                        break;
                    case 'line_query':
                        this.$refs.treeEditor1.getCheckedNodes().forEach(item => {
                            labels.push(item.name);
                            ids.push(item.id);
                        });

                        this.queryData.productLineName = labels.join(',');
                        this.queryData.productLineId = ids;
                        this.defaultQueryKeys = ids;
                        this.popover.line_query = false;
                        break;
                    case 'line_edit':
                        this.$refs.treeEditor2.getCheckedNodes().forEach(item => {
                            labels.push(item.name);
                            ids.push(item.id);
                        });
                        this.configObj.productLineName = labels.join(',');
                        this.configObj.productLineId = ids;
                        this.popover.line_edit = false;
                        break;
                }
            },

            // 保存勾选数据
            handleSaveCheckInfo(val) {
                this.saveCheckInfo = [...val];
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.line_query = false;
                this.popover.line_edit = false;
                this.popover.user_edit = false;
                this.queryProductLineFilter = '';
                this.editProductLineFilter = '';
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
                    key: 'user_config',
                    value: JSON.stringify(this.queryData)
                });

                this.tableData = data.data.value;
                this.tableKey = ['序号', '用户名', '直属部门', '所属角色', '最后修改人', '最后修改时间',  '是否启用', '操作'];
                this.tableProps = ['index', 'user_name', 'department', 'role_name', 'update_name','update_date', 'status', 'operation'];
                this.tableWidth = ['60', '150', 'department', '300', '120', '200', '120', '200'];

                this.pageData.currentList = data.page_data.limit;
                this.pageData.currentPage = data.page_data.offset;
                this.pageData.currentTotal = data.page_data.total;
            }
        },
        created () {
            this.thisVm = this;
            this.handleGetOptionList();
//            this.handleGetUserTreeData();
            try {
                if (JSON.stringify(this.productUserConfigInfo) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['user_config']);
                    this.handleQueryInfoCallBack(this.productUserConfigInfo);
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
            "queryProductLineFilter"(val) {
                this.$refs.treeEditor1.filter(val);
            },
            "editProductLineFilter"(val) {
                this.$refs.treeEditor2.filter(val);
            },
            "userNameFilter"(val) {
                this.$refs.treeEditor.filter(val);
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
            width: 850px!important;
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


    /deep/.ui-dev_area {
        .el-transfer-panel__item.el-checkbox {
            width: 90px!important;
        }

        .el-transfer-panel__item.el-checkbox .el-checkbox__label {
            overflow: visible!important;
        }
    }

    /deep/.el-transfer {
        .el-select, .el-input {
            width: 100%!important;
        }
    }

</style>
