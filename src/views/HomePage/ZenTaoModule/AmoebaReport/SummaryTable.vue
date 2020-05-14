<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" :cell-style="cellStyle" highlight-current-row stripe>
            <el-table-column label="需求部门" prop="demand_dept_name" minWidth="130" fixed></el-table-column>
            <el-table-column label="月份" prop="months" minWidth="80" fixed></el-table-column>
            <el-table-column label="总需求量">
                <el-table-column label="汇总" prop="z_demand" minWidth="70"></el-table-column>
                <el-table-column label="有效需求" prop="yx_demand" minWidth="70"></el-table-column>
                <el-table-column label="无效需求" prop="wx_demand" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="完成需求量">
                <el-table-column label="汇总" prop="ywc_demand" minWidth="75"></el-table-column>
                <el-table-column label="有效需求" prop="ywc_yx_demand" minWidth="70"></el-table-column>
                <el-table-column label="无效需求" prop="ywc_wx_demand" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="研发任务量">
                <el-table-column label="汇总" prop="yf_task" minWidth="70"></el-table-column>
                <el-table-column label="有效需求" prop="yx_task" minWidth="70"></el-table-column>
                <el-table-column label="无效需求" prop="wx_task" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="研发投入总工时">
                <el-table-column label="汇总" prop="yf_gs" minWidth="80"></el-table-column>
                <el-table-column label="有效需求" prop="yx_gs" minWidth="80"></el-table-column>
                <el-table-column label="无效需求" prop="wx_gs" minWidth="80"></el-table-column>
            </el-table-column>
            <el-table-column label="研发投入人数">
                <el-table-column label="汇总" prop="yf_rl" minWidth="70"></el-table-column>
                <el-table-column label="有效需求" prop="yx_rl" minWidth="70"></el-table-column>
                <el-table-column label="无效需求" prop="wx_rl" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="投入人力占比">
                <el-table-column label="汇总" prop="yf_rl_rate" minWidth="80"></el-table-column>
                <el-table-column label="有效需求" prop="yx_rl_rate" minWidth="80"></el-table-column>
                <el-table-column label="无效需求" prop="wx_rl_rate" minWidth="80"></el-table-column>
            </el-table-column>
            <el-table-column label="研发人力成本">
                <el-table-column label="汇总" prop="yf_rl_money" minWidth="80"></el-table-column>
                <el-table-column label="有效需求" prop="yx_rl_money" minWidth="80"></el-table-column>
                <el-table-column label="无效需求" prop="wx_rl_money" minWidth="80"></el-table-column>
            </el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </el-table>
    </div>
</template>
<script>
    import config from '@/assets/js/config';
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    export default{
        name: 'TableIndex',
        props: {
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableKey: {
                type: Array,
                default() {
                    return []
                }
            },
            tableProps: {
                type: Array,
                default() {
                    return []
                }
            },
            tableWidth: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
        },
        data(){
            return {
                tableHeight: '100px',
                thisVm: {},
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
            ]),
        },
        methods: {
            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.category_name_level_1 == '总计'|| row.row.type_name == '总计') {
                    return 'background: #f3f6fa'
                }
            },
            handleClick(row, type) {
                this.$emit('click', row, type)
            }
        },
        created() {
            this.thisVm = this;

        },
        mounted() {
            this.$nextTick().then(() => {
                this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
        },
        watch: {
            showSearch() {
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    this.tableHeight = config.setTableHeight('s-main',['el-tabs__header']);
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400)
            }
        }
    }
</script>
<style scope lang="less">
</style>