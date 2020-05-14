<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                :clearable="false"
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线">
                            <el-select filterable v-filter collapseTags multiple size="small" v-model="queryData.productLine">
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun">查询</el-button>
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
        <div class="ui-main-module-table">
            <el-table :height="tableHeight" :data="tableData" border stripe highlight-current-row ref="myTable">
                <el-table-column label="">
                    <el-table-column prop="product_onelevel_name" label="产品线"></el-table-column>
                </el-table-column>
                <el-table-column label="流入总任务">
                    <el-table-column prop="normal_logo_cnt_allin" label="有logo"></el-table-column>
                    <el-table-column prop="normal_nologo_cnt_all_in" label="无logo"></el-table-column>
                </el-table-column>
                <el-table-column label="摄影完成(SPU)">
                    <el-table-column prop="normal_logo_cnt_photo" label="有logo"></el-table-column>
                    <el-table-column prop="normal_nologo_cnt_photo" label="无logo"></el-table-column>
                </el-table-column>
                <el-table-column label="美工1完成(SPU)">
                    <el-table-column prop="normal_logo_cnt_design1" label="有logo"></el-table-column>
                    <el-table-column prop="normal_nologo_cnt_design1" label="无logo"></el-table-column>
                </el-table-column>
                <el-table-column label="美工2完成(SPU)">
                    <el-table-column prop="normal_nologo_cnt_design2" label="无logo"></el-table-column>
                </el-table-column>
                <el-table-column label="最终流出(SPU)">
                    <el-table-column prop="normal_logo_cnt_allout" label="有logo"></el-table-column>
                    <el-table-column prop="normal_nologo_cnt_allout" label="无logo"></el-table-column>
                </el-table-column>
                <template slot="empty">
                    <div><NotData v-show="!tableData.length"></NotData></div>
                </template>
            </el-table>
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
    } from '@/api/common/date_format'

    import {
        getProductLineCountInfo
    } from '../../../api/design_module/design_product_line_count'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'design_product_line_count';


    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    productLine: []
                },

                optionList: {
                    productLineList: []
                },

                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                tableHeight: '100px',

                //保存日期
                saveDefaultDate: []
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'designTaskCountInfo'
            ]),
        },
        methods: {
            ...mapActions([]),
            getProductLineCountInfo,

            // 重置
            handleResetQueryInfo(){
                this.handleGetDateRange();
                this.queryData.productLine = [];
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['design_product_line_count']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    product_line: this.queryData.productLine.join(',')
                };

                obj = Object.assign(obj || {}, params);

                this.getProductLineCountInfo(obj).then(({ data}) => {
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
                    isExcel: 1,
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
                    key: 'design_product_line_count',
                    value: JSON.stringify(this.queryData)
                });
                //数据渲染
                this.tableData = data.data.value;
                this.optionList.productLineList = data.data.product_line
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
<style lang="less" scoped>

</style>
