<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="大团队">
                            <el-select clearable size="small" v-model="queryData.team">
                                <el-option v-for="item in optionList.dateTypeList"
                                           :key="item.id"
                                           :value="item.id"
                                           :label="item.org_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="小组">
                            <el-select clearable size="small" v-model="queryData.group" filterable v-filter>
                                <el-option v-for="item in optionList.orderStatusList"
                                           :key="item.id"
                                           :value="item.id"
                                           :label="item.org_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="销售">
                            <el-select clearable size="small" v-model="queryData.sale" filterable v-filter>
                                <el-option v-for="item in optionList.salesPersonList"
                                           :key="item.id"
                                           :value="item.id"
                                           :label="item.user_full_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>    
                        <SearchRequirement label="日期">
                            <el-date-picker size="small" v-model="queryData.day" 
                                            type="date" format="yyyy-MM-dd" value-format="yyyy-MM-dd" placeholder="选择日">
                            </el-date-picker>
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
         <div class="ui-main-module-table">
            <el-table :height="tableHeight" :data="tableData" border stripe highlight-current-row ref="myTable">
                <el-table-column label="">
                    <el-table-column prop="team_org" label="大团队"></el-table-column>
                </el-table-column>
                <el-table-column label="">
                    <el-table-column prop="org_name" label="小组"></el-table-column>
                </el-table-column>
                <el-table-column label="">
                    <el-table-column prop="user_name" label="销售"></el-table-column>
                </el-table-column>
                <el-table-column label="当天10：00前待处理">
                    <el-table-column prop="one_spwz" label="商品未知">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.one_spwz_code)"
                                  v-if="scope.row.one_spwz != 0">{{scope.row.one_spwz}}</span>
                            <span v-else>{{scope.row.one_spwz}}</span>
                        </span>
                    </el-table-column>
                    <el-table-column prop="one_rgsh" label="人工审核">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.one_rgsh_code)"
                                  v-if="scope.row.one_rgsh != 0">{{scope.row.one_rgsh}}</span>
                            <span v-else>{{scope.row.one_rgsh}}</span>
                        </span>
                    </el-table-column>
                    <el-table-column prop="one_lryc" label="利润率异常">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.one_lryc_code)"
                                  v-if="scope.row.one_lryc != 0">{{scope.row.one_lryc}}</span>
                            <span v-else>{{scope.row.one_lryc}}</span>
                        </span>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="当天16：00前待处理异常单数">
                    <el-table-column prop="two_spwz" label="商品未知">
                         <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.two_spwz_code)"
                                  v-if="scope.row.two_spwz != 0">{{scope.row.two_spwz}}</span>
                            <span v-else>{{scope.row.two_spwz}}</span>
                        </span>
                    </el-table-column>
                    <el-table-column prop="two_rgsh" label="人工审核">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.two_rgsh_code)"
                                  v-if="scope.row.two_rgsh != 0">{{scope.row.two_rgsh}}</span>
                            <span v-else>{{scope.row.two_rgsh}}</span>
                        </span>
                    </el-table-column>
                    <el-table-column prop="two_lryc" label="利润率异常">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.two_lryc_code)"
                                  v-if="scope.row.two_lryc != 0">{{scope.row.two_lryc}}</span>
                            <span v-else>{{scope.row.two_lryc}}</span>
                        </span>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="当天19：30前待处理异常单数">
                    <el-table-column prop="three_spwz" label="商品未知">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.three_spwz_code)"
                                  v-if="scope.row.three_spwz != 0">{{scope.row.three_spwz}}</span>
                            <span v-else>{{scope.row.three_spwz}}</span>
                        </span>
                    </el-table-column>
                    <el-table-column prop="three_rgsh" label="人工审核">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.three_rgsh_code)"
                                  v-if="scope.row.three_rgsh != 0">{{scope.row.three_rgsh}}</span>
                            <span v-else>{{scope.row.three_rgsh}}</span>
                        </span>
                    </el-table-column>
                    <el-table-column prop="three_lryc" label="利润率异常">
                        <span slot slot-scope="scope" >
                            <span class="ui-link" @click="handleDialogDetails(scope.row, scope.row.three_lryc_code)"
                                  v-if="scope.row.three_lryc != 0">{{scope.row.three_lryc}}</span>
                            <span v-else>{{scope.row.three_lryc}}</span>
                        </span>
                    </el-table-column>
                </el-table-column>
                <template slot="empty">
                    <div><NotData v-show="!tableData.length"></NotData></div>
                </template>
            </el-table>
        </div> 

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

        <ComDialogPreview
                isButton
                isPage
                title="明细信息"
                :visible.sync="isShowDetails"
                :tableKey="dialogKey"
                :tableProps="dialogProps"
                :tableWidth="dialogWidth"
                :tableData="dialogData"
                :dialogPageData="dialogPageData"
                @dialogPageChange="handleDetailsPageChange"
                @export="handleExportDetailsInfo"></ComDialogPreview>


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
        getAbnormalorder,
        getdropdownList,
        getAbnormalDetailsInfo
    } from '@/api/sales_module/abnormal_order'

    import {
        getPreDateRange,
        getCurrentDate
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'abnormal_order';

    export default {
        name: component_name,
        data() {
            return {
                pickerOptions: '',
                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                tableHeight:'100px',
                tableData:[],

                queryData: {
                    team:'',
                    group:'',
                    sale:'',
                    day: ''
                },

                optionList: {
                    dateTypeList: [],
                    orderStatusList: [],
                    salesPersonList:[]
                },

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: '',
                saveCheckInfo: [],
                saveData: {
                    row: {},
                    code: '',
                    page: {}
                },

                //弹框明细
                isShowDetails: false,
                dialogKey: [],
                dialogProps: [],
                dialogWidth: [],
                dialogData: [],
                dialogPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                }
            }
        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            uploadUrl() {
                return importApi['IMPORT_PLATFORM_COST_INFO'];
            },
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getAbnormalorder,
        


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['abnormal_order']);
                }
        

                let obj = {
                    team: this.queryData.team,
                    group: this.queryData.group,
                    sale: this.queryData.sale,
                    day: this.queryData.day,
                };

                obj = Object.assign(params || {}, obj);

                this.getAbnormalorder(obj).then(({ data }) => {
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
                    data_type: '1',
                    order_status: '1',
                    sale_user: [],
                    day: this.saveDefaultDate
                };
            },

        
            // //获取勾选数据
            // handleCheckInfo(row) {
            //     this.saveCheckInfo = row;
            // },

            //获取明细弹框
            handleDialogDetails(row, code, page, params) {
                this.saveData.row = row;
                this.saveData.code = code;
                let obj = {
                    user: row.user_id,
                    code: code,
                    day: row.day,
                    ...page,
                    ...params
                };
                getAbnormalDetailsInfo(obj).then(({ data }) => {
                    if (data.status) {
                        this.isShowDetails = true;
                        this.dialogKey = ['序号', ...data.title];
                        this.dialogData = data.data;
                        this.dialogProps = ['index','platform_code', 'order_id', 'paytime', 'reason', 'opration_date'];
                        this.dialogWidth = ['60','100', '180', '140', 'reason', '140'];
                        this.dialogPageData.limit = data.page_data.limit * 1;
                        this.dialogPageData.offset = data.page_data.offset * 1;
                        this.dialogPageData.total = data.page_data.total * 1;
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                })
            },

            //弹框分页
            handleDetailsPageChange({offset,limit}) {
                this.saveData.page = {offset,limit};
                this.handleDialogDetails(this.saveData.row, this.saveData.code, {offset, limit}, {})
            },

            //明细导出
            handleExportDetailsInfo() {
                this.handleDialogDetails(this.saveData.row, this.saveData.code, this.saveData.page, {is_excel: 1});
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
                    is_excel:1
                 }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'abnormal_order',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableData = data.data.map(item => {
                    return {
                        ...item,
                        day: this.queryData.day
                    }
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                 getCurrentDate().then(( data ) => {
                    this.saveDefaultDate = data.date;
                    this.queryData.day = data.date;
                    this.handleQueryInfo();
                });
                getdropdownList().then(({ data }) => {
                    this.optionList.dateTypeList = data.big_team;
                    this.optionList.orderStatusList = data.group;
                    this.optionList.salesPersonList = data.saler
                });
                
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('ui-main-module',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('ui-main-module',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>

<style scoped lang="less">

    @color: #ff9900;

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0;
    }

    .text-color {
        color:  @color;
    }

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 200px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

    /deep/ .ui-fn-module {
        margin: 0 15px 0 0;
        .el-button--small {
            padding-top: 15px;
        }

        .el-progress-bar__outer {
            background: #ffffff;
        }
        .el-progress-bar {
            width: 15%;
            float: right;
            margin-top: 10px;
        }

        .el-alert {
            float: right;
            height: 34px;
            line-height: 34px;
            width: 15%;
            margin-top: 1px;
        }
        .el-alert__title {
            color: #333333;
            font-weight: bold;
            font-size: 12px;
        }
        .el-alert--warning.is-light {
            background-color: #fffdf9;

            box-sizing: border-box;
        }

        .ui-tip_box {
            display: inline-block;
            width: 200px;
            height: 34px;
            line-height: 34px;
            float: right;
            font-size: 12px;
            font-weight: bold;
            background: #fffdf9;
            border: 1px solid #ffdda8;
            border-radius: 4px;
            padding-left: 5px;
            .icon-tishi1 {
                color: #f2ae3e;
                font-size: 16px;
            }
        }
    }


</style>
