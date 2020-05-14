<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="序号" prop="index" width="60">
                <template slot-scope="scope">
                    <span>{{autoAddTableInx(scope.$index)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="统计日期" prop="statis_date" width="100"></el-table-column>
            <el-table-column label="采购单创建日期" prop="pr_create_time" width="110"></el-table-column>
            <el-table-column label="产品线" prop="linelist_cn_name" width="110"></el-table-column>
            <el-table-column label="合计">
                <el-table-column label="数量" prop="cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="缺货">
                <el-table-column label="数量" prop="stockout_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="stockout_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="停产">
                <el-table-column label="数量" prop="stop_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="stop_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="起订量">
                <el-table-column label="数量" prop="moq_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="moq_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="质量异常">
                <el-table-column label="数量" prop="quality_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="quality_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="供应商变更店铺名称">
                <el-table-column label="数量" prop="change_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="change_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="计划确认不下单">
                <el-table-column label="数量" prop="confirm_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="confirm_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="账期额度不足">
                <el-table-column label="数量" prop="lines_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="lines_cancel_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="供应商不接单">
                <el-table-column label="数量" prop="dont_order_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="dont_order_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="海外仓SKU">
                <el-table-column label="数量" prop="overseas_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="overseas_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="无法确认货源">
                <el-table-column label="数量" prop="confirm_goods_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="confirm_goods_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="涨价待确认">
                <el-table-column label="数量" prop="up_price_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="up_price_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="换图">
                <el-table-column label="数量" prop="figure_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="figure_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="供应商未改价">
                <el-table-column label="数量" prop="chang_price_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="chang_price_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="采购仓库错误重新导入">
                <el-table-column label="数量" prop="error_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="error_rate" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="其他">
                <el-table-column label="数量" prop="ther_cancel_qty" width="60"></el-table-column>
                <el-table-column label="比例" prop="ther_cancel_rate" width="100"></el-table-column>
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
    import { autoAddTableInx } from '@/services';
    import config from '@/assets/js/config';
    export default{
        name: 'TableIndex',
        props: {
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            queryType: {
                type: String,
                default: ''
            },
            isSetHeight: {
                type: Boolean,
                default: true
            },
            // 设置表格高度
            height: {
                type: String,
                default: ''
            },
            otherHeight: {
                type: Array,
                default () {
                    return [];
                }
            },
            extraView: {
                type: String,
                default: ''
            },
        },
        data(){
            return {
                tableHeight: '100px',
            }
        },
        computed: {},
        methods: {
            autoAddTableInx,
        },
        created() {

        },
        mounted () {
            this.$nextTick().then(() => {
                if (this.height && this.isSetHeight) {
                    this.tableHeight = this.height;
                } else {
                    this.tableHeight = this.isSetHeight ? config.setTableHeight('ui-main', this.otherHeight) : '';
                }
                this.$refs['myTable'].doLayout();
            });
            const vm = this;
            window.onresize = function(){
                document.querySelector('body').style.overflow = 'hidden';
                vm.tableHeight = config.setTableHeight('s-main', vm.otherHeight, null, vm.extraView);
                vm.$refs['myTable'] && vm.$refs['myTable'].doLayout();
                document.querySelector('body').style.overflow = '';
            }
        },
        watch: {
            showSearch (val, old) {
                let vm = this;
                document.querySelector('body').style.overflow = 'hidden';
                setTimeout(() => {
                    if (vm.height && vm.isSetHeight) {
                        vm.tableHeight = vm.height;
                    } else {
                        vm.tableHeight = vm.isSetHeight ? config.setTableHeight('ui-main', vm.otherHeight) : '';
                    }
                    vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400);
            },
        }
    }
</script>
<style scope lang="less">
</style>