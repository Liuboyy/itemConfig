<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement>
                            <el-select size="small" v-model="queryData.timeType">
                                <el-option
                                        v-for="(label, value) in optionList.timeTypeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>

                    </li>
                    <li class="date">
                        <SearchRequirement
                                width="0"
                                template="splitDate"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="任务类型">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.taskType">
                                <el-option
                                        v-for="item in optionList.taskTypeList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.productLine">
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="摄影人员">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.photoStaff">
                                <el-option
                                        v-for="item in optionList.photoStaffList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SPU">
                            <el-input size="small" v-model="queryData.spu" placeholder="请输入"></el-input>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo({limit: pageData.currentList})" icon="icon-chaxun">查询</el-button>
                </div>
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
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch">
        </ComTableInfo>
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
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getPreDateRange,
        validTime
    } from '../../../../api/common/date_format'

    import {
        getComDeveloperBySecondGroup
    } from '../../../../api/common/index'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'photograph_details';


    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    taskType: '',
                    productLine: '',
                    photoStaff: '',
                    spu: '',
                    timeType: 'start',
                },
                optionList: {
                    taskTypeList: [],
                    productLineList: [],
                    photoStaffList: [],
                    timeTypeList: {
                        'start': '摄影开始时间',
                        'end': '摄影结束时间'
                    }
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //保存日期
                saveDefaultDate: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'getPhotographDetailsInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetPhotographDetailsInfo',
            ]),
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                this.queryData.taskType = '';
                this.queryData.productLine = '';
                this.queryData.photoStaff = '';
                this.queryData.spu = '';
                this.queryData.timeType = 'start';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['photography_details']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    query_type: this.queryData.timeType,
                    task_type: this.queryData.taskType,
                    p_line_id: this.queryData.productLine,
                    user_id: this.queryData.photoStaff,
                    spu: this.queryData.spu
                };

                obj = Object.assign(obj || {}, params);

                this.GetPhotographDetailsInfo(obj).then(({ data}) => {
                    // 导出
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            },

            // 分页
            handleSizeChange(size) {
                this.handleQueryInfo({
                    limit: size,
                    offset: 1
                }, true);
            },
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'photography_details',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.productLineList = data.data.p_line_list;
                this.optionList.photoStaffList = data.data.user_list;
                this.optionList.taskTypeList = data.data.task_type_list;
                this.tableData = data.data.value;
                this.tableKey = data.data.key;
                if(this.tableKey.indexOf('序号') == -1) this.tableKey.unshift('序号');
                this.tableProps = ['index','spu','p_line_name','type_name','user_name','start_photo_time','end_photo_time','photo_time','overdue_time','remark'];
                this.tableWidth = ['80','150','120','100','120','140','140','100','100','remark'];

                //分页
                this.pageData.currentList = data.page_data.limit;
                this.pageData.currentPage = data.page_data.offset;
                this.pageData.currentTotal = data.page_data.total;

            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>
    .ui-main-module .ui-main-module-search li .ui-search_require{
        width: 265px!important;
    }

</style>
