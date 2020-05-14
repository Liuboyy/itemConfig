<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.date">
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
                    <el-table-column prop="statistical" label="统计环节"></el-table-column>
                </el-table-column>
                <el-table-column label="">
                    <el-table-column prop="normal_total" label="常规数汇总"></el-table-column>
                </el-table-column>
                <el-table-column label="">
                    <el-table-column prop="normal_total_ratio" label="常规数汇总占比"></el-table-column>
                </el-table-column>
                <el-table-column label="常规有logo(SPU)">
                    <el-table-column prop="normal_logo_cnt" label="数量"></el-table-column>
                    <el-table-column prop="normal_logo_cnt_ratio" label="完成占比"></el-table-column>
                </el-table-column>
                <el-table-column label="常规无logo(SPU)">
                    <el-table-column prop="normal_nologo_cnt" label="数量"></el-table-column>
                    <el-table-column prop="normal_nologo_cnt_ratio" label="完成占比"></el-table-column>
                </el-table-column>
                <!--<el-table-column label="试卖需摄影(SPU)">-->
                    <!--<el-table-column prop="trialsale_photo_cnt" label="数量"></el-table-column>-->
                    <!--<el-table-column prop="trialsale_photo_cnt_ratio" label="完成占比"></el-table-column>-->
                <!--</el-table-column>-->
                <el-table-column label="试卖无摄影(SPU)">
                    <el-table-column prop="trialsale_nophoto_cnt" label="数量"></el-table-column>
                    <el-table-column prop="trialsale_nophoto_cnt_ratio" label="完成占比"></el-table-column>
                </el-table-column>
                <!--<el-table-column label="代销(SPU)">-->
                    <!--<el-table-column prop="agent_sale_cnt" label="数量"></el-table-column>-->
                    <!--<el-table-column prop="agent_sale_cnt_ratio" label="完成占比"></el-table-column>-->
                <!--</el-table-column>-->
                <el-table-column label="亚马逊(SPU)">
                    <el-table-column prop="fba_cnt" label="数量"></el-table-column>
                    <el-table-column prop="fba_cnt_ratio" label="完成占比"></el-table-column>
                </el-table-column>
                <!--<el-table-column label="扫码(SPU)">-->
                    <!--<el-table-column prop="scan_cnt" label="数量"></el-table-column>-->
                    <!--<el-table-column prop="scan_cnt_ratio" label="完成占比"></el-table-column>-->
                <!--</el-table-column>-->
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

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'design_task_count';


    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
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
            ...mapActions([
                'GetDesignTaskCountInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['design_task_count']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                };

                obj = Object.assign(obj || {}, params);

                this.GetDesignTaskCountInfo(obj).then(({ data}) => {
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
                    is_excel: 1,
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
                    key: 'design_task_count',
                    value: JSON.stringify(this.queryData)
                });
                //数据渲染
                this.tableData = data.data.value;
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
