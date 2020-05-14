<template>
    <div  class="ui-main-module">
        <!--<transition name="slide-fade">-->
            <!--<div class="ui-search-area" v-show="showSearch">-->
                <!--<ul class="ui-main-module-search clearFix">-->
                    <!--<li>-->
                        <!--<SearchRequirement-->
                                <!--clearable-->
                                <!--label="提出时间"-->
                                <!--template="daterange"-->
                                <!--:isOption="false"-->
                                <!--v-model="queryData.timeFrame">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="需求号">-->
                            <!--<el-input size="small" placeholder="请输入" v-model="queryData.demandNo"></el-input>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <!--<li>-->
                        <!--<SearchRequirement label="需求部门">-->
                            <!--<el-select filterable v-filter collapseTags multiple size="small" v-model="queryData.department">-->
                                <!--<el-option-->
                                        <!--v-for="item in optionList.departmentList"-->
                                        <!--:key="item.id"-->
                                        <!--:value="item.id"-->
                                        <!--:label="item.name"></el-option>-->
                            <!--</el-select>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                <!--</ul>-->
                <!--<FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"-->
                            <!--:params="{limit: pageData.currentList}"></FilterBtn>-->
            <!--</div>-->
        <!--</transition>-->
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon && item.value === 'add'"
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
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="operation" slot-scope="scope">
                <ComPermitButton label="编辑" permit="modify" @click="handleModifyConfigInfo(scope.row)"></ComPermitButton>
                <ComPermitButton label="删除" permit="delete" @click="handleDeleteConfigInfo(scope.row)"></ComPermitButton>
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

        <el-dialog
                width="400px"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddConfigShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @closed="handleCloseConfigInfo"
                :title="isModifyConfigShow ? '编辑配置' : '新增配置'">
            <el-form labelWidth="90px" ref="configObj" :model="configObj" :rules="configRules">
                <el-form-item label="月份" prop="month">
                    <el-date-picker size="small" type="month"  placeholder="选择月" v-model="configObj.month" :clearable="false"
                                    format="yyyy-MM" value-format="yyyy-MM" :disabled="isModifyConfigShow"></el-date-picker>
                </el-form-item>
                <el-form-item label="研发人数" prop="number">
                    <el-input size="small" placeholder="请输入" v-model="configObj.number"></el-input>
                </el-form-item>
                <el-form-item label="研发时薪" prop="salary">
                    <el-input size="small" placeholder="请输入" v-model="configObj.salary"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseConfigInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmConfigInfo">确定</el-button>
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
        getDepartmentList,
        getConfirmConfigInfo
    } from '@/api/zen_tao_module/amoeba_report';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    export default {
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    timeFrame: [],
                    department: [],
                    demandNo: '',
                },

                optionList: {
                    departmentList: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //配置
                isAddConfigShow: false,
                isModifyConfigShow: false,
                configObj: {
                    month: '',
                    number: '',
                    salary: ''
                },
                configRules: {
                    month: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'change'
                        }
                    ],
                    number: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        },
                        {   pattern: /^[0-9]\d*$/,
                            message: '请输入0或正整数',
                            trigger: 'blur'
                        }
                    ],
                    salary: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        },
                        {
                            pattern: /^\d+(\.\d+)?$/,
                            message: '请输入数字',
                            trigger: 'blur'
                        }
                    ]
                },

            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'amoebaConfigInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetAmoebaReportConfigInfo'
            ]),
            autoAddTableInx,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['amoeba_config']);
                }

                let obj = {};

                obj = Object.assign(params || {}, obj);

                this.GetAmoebaReportConfigInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {},

            //删除
            handleDeleteConfigInfo(row) {
                this.$confirm('是否确认删除该条数据？', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getConfirmConfigInfo({
                        delete: 1,
                        month: row.months,
                        user_its: row.user_its,
                        it_money: row.it_money,
                        update_number: this.loginInfo.staff_code,
                        update_name: this.loginInfo.user_name
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }).catch((e) => {
                    console.log(e)
                });
            },

            //新增配置
            handleAddConfigInfo() {
                this.configObj.month = '';
                this.configObj.number = '';
                this.configObj.salary = '';
                this.isAddConfigShow = true;
            },
            //编辑
            handleModifyConfigInfo(row) {
                this.isAddConfigShow = true;
                this.isModifyConfigShow = true;
                this.configObj.month = row.months;
                this.configObj.number = row.user_its;
                this.configObj.salary = row.it_money;
            },
            //取消
            handleCloseConfigInfo() {
                this.isAddConfigShow = false;
                this.isModifyConfigShow = false;
                this.configObj.month = '';
                this.configObj.number = '';
                this.configObj.salary = '';
                this.$refs['configObj'].resetFields();
            },
            //确定
            handleConfirmConfigInfo() {
                this.$refs['configObj'].validate((res) => {
                    if(res) {
                        getConfirmConfigInfo({
                            month: this.configObj.month,
                            user_its: this.configObj.number,
                            it_money: this.configObj.salary,
                            update_number: this.loginInfo.staff_code,
                            update_name: this.loginInfo.user_name
                        }).then(({ data }) => {
                            this.handleOperationCallBack(data);
                        })
                    }
                });
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    if(this.isAddConfigShow) this.isAddConfigShow = false;
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
                    total_count: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'amoeba_config',
                    value: JSON.stringify(this.queryData)
                });


                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title), '操作'];
                this.tableProps = ['index', ...Object.keys(data.title), 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableWidth = ['60'];
                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getDepartmentList().then(({ data }) => {
                    this.optionList.departmentList = data.dept_data
                });
                if (JSON.stringify(this.amoebaConfigInfo) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['amoeba_config']);
                    this.handleQueryInfoCallBack(this.amoebaConfigInfo);
                }
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">
    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
    }

</style>
