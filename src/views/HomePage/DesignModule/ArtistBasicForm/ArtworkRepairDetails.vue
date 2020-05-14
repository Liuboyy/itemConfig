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
                    <li>
                        <SearchRequirement
                                width="0"
                                template="splitDate"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select filterable v-filter size="small" v-model="queryData.productLine">
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="美工人员">
                            <el-select filterable v-filter size="small" v-model="queryData.artistStaff">
                                <el-option
                                        v-for="item in optionList.artistStaffList"
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
    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'artwork_repair_details';

    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    productLine: '',
                    artistStaff: '',
                    spu: '',
                    timeType: '1'
                },
                optionList: {
                    productLineList: [],
                    artistStaffList: [],
                    timeTypeList: {
                        1: '美工开始时间',
                        2: '美工结束时间'
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
                'queryParamsInfo',
                'artworkRepairDetailsInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'GetArtworkRepairDetailsInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.productLine = '';
                this.queryData.artistStaff = '';
                this.queryData.spu = '';
                this.queryData.timeType = '1';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['artwork_repair']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    date_type: this.queryData.timeType,
                    art_user_id: this.queryData.artistStaff,
                    product_line: this.queryData.productLine,
                    spu: this.queryData.spu,
                };

                obj = Object.assign(obj || {}, params);

                this.GetArtworkRepairDetailsInfo(obj).then(({ data}) => {
                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1
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
                    key: 'artwork_repair',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.productLineList = data.list.product_line;
                this.optionList.artistStaffList = data.list.art_user;
                this.tableData = data.list.value;
                this.tableKey = data.list.key;
                this.tableProps = ['index','spu','image_cnt','type_name','is_logo','product_onelevel_name','create_user_name','start_time','end_time','use_time','overdue_time','remark'];
                    this.tableWidth = ['80','150','90','100','100','140','140','150','150','100','100','remark'];

                //分页
                this.pageData.currentList = data.list.page_data.limit * 1;
                this.pageData.currentPage = data.list.page_data.offset * 1;
                this.pageData.currentTotal = data.list.page_data.total * 1;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.artworkRepairDetailsInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['artwork_repair']);
                        this.handleQueryInfoCallBack(this.artworkRepairDetailsInfo);
                    };
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
