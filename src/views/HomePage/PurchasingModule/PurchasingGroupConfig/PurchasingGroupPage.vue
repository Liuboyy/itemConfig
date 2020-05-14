<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="小组名称">
                            <el-select v-model="queryData.group" filterable v-filter size="small" clearable>
                                <el-option v-for="item in optionList.groupList"
                                           :label="item.label"
                                           :value="item.value"
                                           :key="item.value"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
                            :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="operation" slot-scope="scope">
                <ComPermitButton permit="preview" label="查看" @click="handlePreviewInfo(scope.row)"></ComPermitButton>
                <ComPermitButton permit="modify" label="编辑" @click="handleModifyInfo(scope.row)"></ComPermitButton>
                <ComPermitButton permit="add" label="添加用户" @click="handleUserConfigInfo(scope.row, 'add')"></ComPermitButton>
                <ComPermitButton permit="delete" label="删除用户" @click="handleUserConfigInfo(scope.row, 'del')"></ComPermitButton>
            </template>
            <template slot="status_cn" slot-scope="scope">
                <el-button type="text" size="small" @click.stop="handleChangeState(scope.row)"
                           :class="scope.row.status == 1 ? 'icon-kaiqi icon-wx' : 'icon-tingyong icon-danger'">
                    <span class="ui-status">{{scope.row.status == 1 ? '启用' : '禁用'}}</span></el-button>
            </template>
            <template slot="is_del_cn" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.is_del == '0'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.is_del == '1'"></i>
                <span>{{scope.row.is_del_cn}}</span>
            </template>
        </ComTableInfo>

        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    size="small"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>

        <el-dialog  width="440px"
                    class="ui-layout_edit-dialog"
                    :visible.sync="isAddGroupShow"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :title="isModifyGroupShow ? '编辑小组' : '新增小组'"
                    @close="handleCloseModifyInfo">
            <el-form :model="groupObj" ref="groupObj" :rules="groupRules" size="small" labelWidth="100px">
                <el-form-item label="小组名称" prop="groupName">
                    <el-input placeholder="请输入" v-model="groupObj.groupName"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseModifyInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmModifyInfo">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog  width="500px"
                    class="ui-layout_edit-dialog ui-multiple"
                    :visible.sync="isUserConfigShow"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    :title="saveType === 'add' ? '添加用户' : '删除用户'"
                    @close="handleCloseUserConfigInfo">
            <el-form :model="userConfigObj" ref="userConfigObj" :rules="userRules" size="small" labelWidth="80px">
                <el-form-item label="用户名" prop="userId">
                    <el-select v-model="userConfigObj.userId" filterable v-filter multiple>
                        <el-option v-for="item in optionList.userList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseUserConfigInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmUserConfigInfo">确定</el-button>
            </div>
        </el-dialog>

        <ComDialogPreview :visible.sync="isPreviewShow" :title="dialogTitle" :tableWidth="dialogTableWidth"
                          :tableProps="dialogTableProps" :tableData="dialogTableData" :tableKey="dialogTableKey"
                          isPage :dialogPageData="dialogPageData" @dialogPageChange="handleDialogPageChange">
            <template slot="is_del_cn" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.is_del == '0'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.is_del == '1'"></i>
                <span>{{scope.row.is_del_cn}}</span>
            </template>
        </ComDialogPreview>

    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";

    import {
        getUserConfigListInfo,
        getUserChangeStatusInfo,
        getUserGroupOptionList,
        getUserConfirmModifyInfo,
        getGroupConfigListInfo,
        getGroupChangeStatusInfo,
        getGroupAddInfo,
        getGroupModifyInfo,
        getUserOptionList,
        getAddUserConfigList,
        getDeleteUserConfigList,
        getPreviewUserInfo
    } from '@/api/purchasing_module/purchasing_group_config'

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'purchasing_group_config';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    group: '',
                },

                optionList: {
                    workingStatusList: [],
                    isEnabledList: [],
                    groupList: [],
                    userList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: [],

                //新增、编辑小组
                isAddGroupShow: false,
                isModifyGroupShow: false,
                saveRowData: {},
                groupObj: {
                    groupName: '',
                },
                groupRules: {
                    groupName: [
                        {
                            required: true,
                            trigger: 'blur',
                            message: '带*号为必选项'
                        }
                    ]
                },

                //添加、删除用户
                isUserConfigShow: false,
                saveType: '',
                userConfigObj: {
                    userId: []
                },
                userRules: {
                    userId: [
                        {
                            required: true,
                            trigger: 'change',
                            message: '带*号为必选项'
                        }
                    ]
                },

                //查看
                isPreviewShow: false,
                dialogTitle: '',
                dialogTableKey: [],
                dialogTableWidth: [],
                dialogTableProps: [],
                dialogTableData: [],
                dialogPageData: [],
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getUserConfigListInfo,
            getGroupConfigListInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['purchasing_group']);
                }

                let obj = {
                    group_id: this.queryData.group
                };

                obj = Object.assign(params || {}, obj);

                this.getGroupConfigListInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    group: '',
                };
            },

            //新增小组
            handleAddGroupInfo() {
                this.isAddGroupShow = true;

            },
            //编辑小组
            handleModifyInfo(row) {
                this.isAddGroupShow = true;
                this.isModifyGroupShow = true;
                this.groupObj.groupName = row.group_name;
                this.saveRowData = row;
            },
            //取消
            handleCloseModifyInfo() {
                this.isAddGroupShow = false;
                this.isModifyGroupShow = false;
                this.groupObj.groupName = '';
                this.$refs['groupObj'].resetFields();
            },
            //确定
            handleConfirmModifyInfo() {
                this.$refs['groupObj'].validate((res) => {
                    if (res) {
                        if (this.isModifyGroupShow) {
                            getGroupModifyInfo({
                                group_name: this.groupObj.groupName,
                                group_id: this.saveRowData.group_id,
                            }).then(({ data }) => {
                                this.handleOperationCallBack(data);
                                this.handleGroupList();
                            })
                        }else {
                            getGroupAddInfo({
                                group_name: this.groupObj.groupName,
                            }).then(({ data }) => {
                                this.handleOperationCallBack(data);
                                this.handleGroupList();
                            })
                        }
                    }
                });
            },

            //添加/删除用户
            handleUserConfigInfo(row, type) {
                getUserOptionList({
                    type: type,
                    group_id: row.group_id
                }).then(({ data }) => {
                    if (data.status) {
                        this.optionList.userList = data.data;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                });
                this.saveType = type;
                this.saveRowData = row;
                this.isUserConfigShow = true;
            },
            //取消
            handleCloseUserConfigInfo() {
                this.userConfigObj.userId = [];
                this.isUserConfigShow = false;
                this.$refs['userConfigObj'].resetFields();
            },
            //确定
            handleConfirmUserConfigInfo() {
                this.$refs['userConfigObj'].validate((res) => {
                    if (res) {
                        let obj = {
                            group_id: this.saveRowData.group_id,
                            user_info: JSON.stringify(this.userConfigObj.userId),
                        };
                        let fnName = this.saveType === 'add' ? getAddUserConfigList : getDeleteUserConfigList;
                        fnName(obj).then(({ data }) => {
                            if(data.status) {
                                this.$message.success('操作成功');
                                this.isUserConfigShow = false;
                                this.handleQueryInfo({limit: this.pageData.currentList});
                            }else {
                                if (data.errorMess_data) {
                                    let str = '';
                                    for (let i = 0; i < data.errorMess_data.length; i++) {
                                        str += `<div>${data.errorMess_data[i]}</div>`;
                                        let title = `<div style="color: #333">${data.errorMess}：</div>`;
                                        this.$alert(title + str, '错误原因', {
                                            customClass: 'ui-error-list',
                                            dangerouslyUseHTMLString: true
                                        });
                                    }
                                }else {
                                    this.$message.error(data.errorMess || '操作失败');
                                }
                            }
                        })
                    }
                })
            },

            //查看
            handlePreviewInfo(row, params) {
                this.isPreviewShow = true;
                this.saveRowData = row;
                this.dialogTitle = row.group_name + '_查看成员';
                getPreviewUserInfo({
                    ...params,
                    group_id: row.group_id,
                }).then(({ data }) => {
                    if (data.status) {
                        this.dialogTableKey = ['序号', ...data.data.key];
                        this.dialogTableProps = ['index', 'user_name', 'user_number', 'dept_name', 'is_del_cn'];
                        this.dialogTableWidth = ['60', '120', '120', '', ''];
                        this.dialogTableData = data.data.value;
                        this.dialogPageData.limit = data.page_data.limit * 1;
                        this.dialogPageData.offset = data.page_data.offset * 1;
                        this.dialogPageData.total = data.page_data.total * 1;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },
            //弹框分页
            handleDialogPageChange({offset,limit}) {
                this.handlePreviewInfo(this.saveRowData, {offset, limit})
            },

            // 修改状态
            handleChangeState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    getGroupChangeStatusInfo({
                        group_id: row.group_id,
                        status: row.status == 1 ? '0' : '1',
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            //小组下拉
            handleGroupList() {
                getUserGroupOptionList({ type: 'all' }).then(({ data }) => {
                    if(data.status) {
                        this.optionList.groupList = data.data
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                });
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    if(this.isAddGroupShow) this.isAddGroupShow = false;
                    if(this.isModifyGroupShow) this.isModifyGroupShow = false;
                    if(this.isUserConfigShow) this.isUserConfigShow = false;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || data.errorMess_data || '操作失败');
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'purchasing_group',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.data.key, '操作'];
                this.tableProps = ['index', 'group_name', 'update_name', 'update_date', 'status_cn', 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.value;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'operation'|| item === 'dept_name') return '250';
                    return '150';
                }) ;

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                this.handleGroupList();
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0;
    }

    .icon-wx, .icon-danger {
        font-size: 12px;
    }
    .ui-status {
        padding-left: 5px;
        color: #3388ff
    }

    /deep/ .ui-multiple .el-select{
        width: 100%!important;

    }
    /deep/.ui-multiple .el-input {
        width: 100%!important;
    }

</style>
