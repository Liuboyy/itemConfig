<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="采购员">
                            <el-select v-model="queryData.buyer" filterable v-filter size="small" clearable>
                                <el-option v-for="item in optionList.buyerList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="在职状态">
                            <el-select size="small" v-model="queryData.workingStatus" clearable>
                                <el-option v-for="item in optionList.workingStatusList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="是否启用">
                            <el-select size="small" v-model="queryData.isEnabled" clearable>
                                <el-option v-for="item in optionList.isEnabledList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
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
            <!--<el-button-->
                    <!--v-if="item.method && item.permit(thisVm) && item.icon"-->
                    <!--v-for="item in buttonList"-->
                    <!--size="small"-->
                    <!--:type="item.type"-->
                    <!--:key="item.value"-->
                    <!--:icon="item.icon"-->
                    <!--@click="item.action(thisVm, item.method)">{{item.name}}</el-button>-->
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
                <ComPermitButton permit="modify" label="编辑" @click="handleModifyInfo(scope.row)"></ComPermitButton>
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
                    title="编辑"
                    class="ui-layout_edit-dialog"
                    :visible.sync="isModifyShow"
                    :close-on-click-modal="false"
                    :close-on-press-escape="false"
                    @close="handleCloseModifyInfo">
            <el-form :model="userModifyObj" ref="userModifyObj" :rules="userRules" size="small" labelWidth="100px">
                <el-form-item label="采购员">
                    <el-input placeholder="请输入" v-model="userModifyObj.userName" disabled></el-input>
                </el-form-item>
                <el-form-item label="员工工号">
                    <el-input placeholder="请输入" v-model="userModifyObj.userNum" disabled></el-input>
                </el-form-item>
                <el-form-item label="所属组别" prop="group">
                    <el-select v-model="userModifyObj.group" filterable v-filter>
                        <el-option v-for="item in optionList.groupList"
                                   :label="item.label"
                                   :value="item.value"
                                   :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseModifyInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmModifyInfo">确定</el-button>
            </div>
        </el-dialog>
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
        getBuyerOptionList,
        getUserChangeStatusInfo,
        getUserGroupOptionList,
        getUserConfirmModifyInfo,
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
                    workingStatus: '0',
                    isEnabled: '',
                    buyer: ''
                },

                optionList: {
                    workingStatusList: [],
                    isEnabledList: [],
                    groupList: [],
                    buyerList: [],
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

                //用户编辑
                isModifyShow: false,
                userModifyObj: {
                    userName: '',
                    userNum: '',
                    group: '',
                },
                userRules: {
                    group: [
                        {
                            required: true,
                            trigger: 'change',
                            message: '带*号为必选项'
                        }
                    ]
                },
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

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['purchasing_user']);
                }

                let obj = {
                    in_job_status: this.queryData.workingStatus,
                    status: this.queryData.isEnabled,
                    user_id: this.queryData.buyer
                };

                obj = Object.assign(params || {}, obj);

                this.getUserConfigListInfo(obj).then(({ data }) => {
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
                    workingStatus: '0',
                    isEnabled: '',
                    buyer: ''
                };
            },


            //编辑用户
            handleModifyInfo(row) {
                getUserGroupOptionList({ type: '' }).then(({ data }) => {
                    if(data.status) {
                        this.optionList.groupList = data.data
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                });
                this.userModifyObj.userName = row.login_name;
                this.userModifyObj.userNum = row.user_number;
                this.userModifyObj.group = row.group_id;
                this.isModifyShow = true;
            },
            //取消
            handleCloseModifyInfo() {
                this.userModifyObj.group = '';
                this.isModifyShow = false;
                this.$refs['userModifyObj'].resetFields();
            },
            //确定
            handleConfirmModifyInfo() {
                this.$refs['userModifyObj'].validate((res) => {
                    if (res) {
                        getUserConfirmModifyInfo({
                            user_number: this.userModifyObj.userNum,
                            group_id: this.userModifyObj.group
                        }).then(({ data }) => {
                            this.handleOperationCallBack(data);
                        })
                    }
                });
            },

            // 修改状态
            handleChangeState(row) {
                this.$confirm(`确认${row.status == 1 ? '禁用' : '启用'}吗？`, '提示', {
                    type: 'warning'
                }).then(() => {
                    getUserChangeStatusInfo({
                        group_id: row.group_id,
                        user_number: row.user_number,
                        status: row.status == 1 ? '0' : '1',
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    if(this.isModifyShow) this.isModifyShow = false;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败');
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
                    key: 'purchasing_user',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.data.key, '操作'];
                this.tableProps = ['index', 'login_name', 'dept_name', 'is_del_cn', 'group_name', 'update_name', 'update_date', 'status_cn', 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.value;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'dept_name') return '400';
                    return '150';
                }) ;

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;

                this.optionList.workingStatusList = data.data.drop_down_list.in_job_status;
                this.optionList.isEnabledList = data.data.drop_down_list.status;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getBuyerOptionList().then(({ data }) => {
                    this.optionList.buyerList = data.data;
                });
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

</style>
