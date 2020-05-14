<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                clearable
                                label="提出时间"
                                template="daterange"
                                :isOption="false"
                                v-model="queryData.timeFrame">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="需求号">
                            <el-input size="small" placeholder="请输入" v-model="queryData.demandNo"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="需求部门">
                            <el-input size="small" placeholder="请输入" v-model="queryData.department"></el-input>
                            <!--<el-select filterable v-filter collapseTags multiple size="small" v-model="queryData.department">-->
                                <!--<el-option-->
                                        <!--v-for="item in optionList.departmentList"-->
                                        <!--:key="item.id"-->
                                        <!--:value="item.id"-->
                                        <!--:label="item.name"></el-option>-->
                            <!--</el-select>-->
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="需求指派人">
                            <el-input size="small" placeholder="请输入" v-model="queryData.assignMember"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品经理">
                            <el-input size="small" placeholder="请输入" v-model="queryData.manager"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="需求项目">
                            <el-select filterable v-filter collapseTags multiple size="small" v-model="queryData.demandElement">
                                <el-option
                                    v-for="item in optionList.demandElementList"
                                    :key="item.id"
                                    :value="item.id"
                                    :label="item.project_name"></el-option>
                                </el-select>
                        </SearchRequirement>
                    </li>
                    <li class="ui-checkbox">
                        <SearchRequirement label="">
                            <el-checkbox v-model="queryData.isNoUpdate">是否无更新</el-checkbox>
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
                    v-if="item.method && item.permit(thisVm) && item.icon && item.value === 'export'"
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
            <template slot="is_status" slot-scope="scope">
                <i class="ui-state_dot state_blue" v-if="scope.row.is_status === '是'"></i>
                <i class="ui-state_dot state_gray" v-if="scope.row.is_status === '否'"></i>
                <span>{{scope.row.is_status}}</span>
            </template>
            <template slot="operation" slot-scope="scope">
                <ComPermitButton label="操作" permit="demand" @click="handleIsValidInfo(scope.row)"></ComPermitButton>
            </template>
            <!--<template slot="demand_name" slot-scope="scope">-->
                <!--<el-popover-->
                        <!--v-if="scope.row.demand_name && scope.row.demand_name.length > 18"-->
                        <!--placement="top-start"-->
                        <!--width="300"-->
                        <!--trigger="hover">-->
                    <!--<span>{{scope.row.demand_name}}</span>-->
                    <!--<span slot="reference" v-html="scope.row.demand_name.length > 18 ? scope.row.demand_name.substring(0,18) + '...':scope.row.demand_name">{{scope.row.demand_name}}</span>-->
                <!--</el-popover>-->
                <!--<span v-else>{{scope.row.demand_name}}</span>-->
            <!--</template>-->
            <template slot="zt_describe" slot-scope="scope">
                <el-popover
                        v-if="scope.row.zt_describe && scope.row.zt_describe.length > 9"
                        placement="top-start"
                        width="300"
                        trigger="hover">
                    <span>{{scope.row.zt_describe}}</span>
                    <span slot="reference" v-html="scope.row.zt_describe.length > 9 ? scope.row.zt_describe.substring(0,9) + '...':scope.row.zt_describe">{{scope.row.zt_describe}}</span>
                </el-popover>
                <span v-else>{{scope.row.zt_describe}}</span>
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
                width="550px"
                title="操作"
                class="ui-layout_edit-dialog"
                :visible.sync="isUpDateShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="handleCloseUpdateInfo">
            <el-form labelWidth="100px" ref="upDateObj" :model="upDateObj" :rules="upDateRules">
                <!--<el-form-item label="是否有效需求" labelWidth="120px">-->
                    <!--<el-radio v-model="isValid" label="1">是</el-radio>-->
                    <!--<el-radio v-model="isValid" label="0">否</el-radio>-->
                <!--</el-form-item>-->
                <el-form-item label="有效工时占比" prop="rate">
                    <el-input-number v-model="upDateObj.rate" :step="5" :max="100" :min="0" :precision="2" placeholder="请输入"
                                     style="width: 400px"></el-input-number>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input size="small" type="textarea" placeholder="请输入" :rows="8" style="width: 400px"
                              maxlength="2000" show-word-limit v-model="upDateObj.remark"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseUpdateInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmUpdateInfo">确定</el-button>
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
        getUpDateDetailsInfo,
        getOptionList
    } from '@/api/zen_tao_module/amoeba_report';

    import {
        getCurrentDateRange,
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
                    department: '',
                    demandNo: '',
                    manager: '',
                    assignMember: '',
                    demandElement: [],
                    isNoUpdate: false,
                },

                saveDefaultDate: [],

                optionList: {
                    departmentList: [],
                    demandElementList: []
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

                //是否有效需求
                isUpDateShow: false,
                upDateObj: {
                    rate: '',
                    remark: ''
                },
                upDateRules: {
                    rate: [
                        {
                            required: true,
                            message: '带*号为必填项',
                            trigger: 'blur'
                        },
//                        {
//                            pattern: /^[1-9]+(\.[1-9]+)?$/,
//                            message: '请输入1-100之间的数字',
//                            trigger: 'blur'
//                        }
                    ]
                },
                isValid: '',
                saveDemandId: '',

            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'amoebaDetailInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetAmoebaReportDetailInfo'
            ]),
            autoAddTableInx,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['amoeba_detail']);
                }

                let obj = {
                    demand_id: this.queryData.demandNo,
                    demand_dept: this.queryData.department,
                    demand_manager: this.queryData.manager,
                    not_update: this.queryData.isNoUpdate ? 1 : '',
                    assign_member: this.queryData.assignMember,
                    requirement_id: this.queryData.demandElement.join(','),
                    propose_time_start: this.queryData.timeFrame && this.queryData.timeFrame[0],
                    propose_time_end: this.queryData.timeFrame && this.queryData.timeFrame[1],
                };

                obj = Object.assign(params || {}, obj);

                this.GetAmoebaReportDetailInfo(obj).then(({ data }) => {
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
                this.queryData.timeFrame = this.saveDefaultDate;
                this.queryData.department = '';
                this.queryData.demandNo = '';
                this.queryData.manager = '';
                this.queryData.assignMember = '';
                this.queryData.demandElement = [];
                this.queryData.isNoUpdate = false;
            },


            //是否有效需求
            handleIsValidInfo(row) {

                this.isUpDateShow = true;
                this.upDateObj.rate = row.effective_rate.substring(0, row.effective_rate.indexOf('.') + 3);
                this.upDateObj.remark = row.zt_describe;
                this.saveDemandId = row.demand_id;
            },
            //是否有效需求 取消
            handleCloseUpdateInfo() {
                this.isUpDateShow = false;
                this.upDateObj.rate = '';
                this.upDateObj.remark = '';
                this.$refs['upDateObj'].resetFields();
            },
            //是否有效需求 确定
            handleConfirmUpdateInfo() {
                this.$refs['upDateObj'].validate((res) => {
                    if(res) {
                        getUpDateDetailsInfo({
                            demand_id: this.saveDemandId,
                            effective_rate: this.upDateObj.rate,
                            remark: this.upDateObj.remark,
                            user_number: this.loginInfo.staff_code,
                            user_name: this.loginInfo.user_name
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
                    if(this.isUpDateShow) this.isUpDateShow = false;
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
                    key: 'amoeba_detail',
                    value: JSON.stringify(this.queryData)
                });


                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title), '操作'];
                this.tableProps = ['index', ...Object.keys(data.title), 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableWidth = this.tableProps.map(item => {
                    if(item === 'index') return '60';
                    if(item === 'demand_id'||item === 'operation'||item === 'demand_tcr'|| item === 'demand_prod_manager'|| item === 'demand_it_user'|| item === 'update_name') return '80';
                    if(item === 'consume_duration'|| item === 'effective_rate') return '100';
                    if(item === 'demand_dept_name') return '120';
                    if(item === 'demand_tc_date'|| item === 'yj_onlinedate'|| item === 'update_date'|| item === 'zt_describe') return '140';
//                    if(item === 'demand_name') return '220';
                });
                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList().then(({ data }) => {
                    this.optionList.demandElementList = data.requirement_data
                });
                getCurrentDateRange().then(( data ) => {
                    this.saveDefaultDate = [data.start, data.end];
                    if (JSON.stringify(this.amoebaDetailInfo) === '{}') {
                        this.queryData.timeFrame = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['amoeba_detail']);
                        this.handleQueryInfoCallBack(this.amoebaDetailInfo);
                    }
                });
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
    /deep/.ui-checkbox .ui-search_require {
        width: 100px!important;
    }
    /deep/.ui-layout_edit-dialog .el-dialog__body .el-form-item {
        margin-bottom: 18px;
    }
    /deep/.ui-layout_edit-dialog .el-input {
        width: 400px;
    }

</style>
