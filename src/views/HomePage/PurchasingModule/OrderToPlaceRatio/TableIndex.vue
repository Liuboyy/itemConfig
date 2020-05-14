<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe @sort-change="handleSortChange" highlight-current-row>
            <el-table-column label="序号" prop="index" width="60">
                <template slot-scope="scope">
                    <span>{{autoAddTableInx(scope.$index)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="统计日期" prop="statis_date" minWidth="100"></el-table-column>
            <el-table-column label="需求创建日期" prop="create_date" minWidth="100" v-if="queryType === '1'"></el-table-column>
            <el-table-column label="采购员" prop="user_name" minWidth="110" v-if="queryType === '2'"></el-table-column>
            <el-table-column label="组别" prop="group_name" minWidth="110"></el-table-column>
            <el-table-column label="业务线" prop="pr_type" minWidth="70" v-if="queryType === '1'"></el-table-column>
            <el-table-column label="采购仓库" prop="warehouse_code" minWidth="150" v-if="queryType === '1'"></el-table-column>
            <el-table-column label="需求单供应商数量" prop="supplier_sl" minWidth="140" sortable></el-table-column>
            <el-table-column label="需求单SKU种类" prop="pr_sku_zl" minWidth="130" sortable></el-table-column>
            <el-table-column label="需求单SKU件数" prop="pr_sku_sl" minWidth="130" sortable></el-table-column>
            <el-table-column label="已下单PO数" prop="po_xds" width="120" sortable></el-table-column>
            <el-table-column label="已下单SKU种类" prop="po_sku_zl" minWidth="130" sortable></el-table-column>
            <el-table-column label="已下单SKU件数" prop="po_sku_sl" minWidth="130" sortable></el-table-column>
            <el-table-column label="已下单总金额" prop="po_price" minWidth="120" sortable></el-table-column>
            <el-table-column label="下单率(sku种类)" prop="po_xdl" minWidth="140" sortable></el-table-column>
            <el-table-column label="下单率(sku件数)" prop="skusl_xdl" minWidth="140" sortable></el-table-column>
            <el-table-column label="有效PO数" prop="po_yxs" minWidth="100" sortable></el-table-column>
            <el-table-column label="有效PO比例" prop="po_yxl" minWidth="110" sortable></el-table-column>
            <el-table-column label="总作废比例" prop="pr_skuzf_rate" minWidth="110" sortable></el-table-column>
            <el-table-column label="作废SKU种类" prop="pr_zfsku_zl" minWidth="120" sortable></el-table-column>
            <el-table-column label="作废SKU件数" prop="pr_zfsku_sl" minWidth="120" sortable></el-table-column>
            <el-table-column label="缺货">
                <el-table-column label="种类" prop="przf1_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf1_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf1_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="起订量">
                <el-table-column label="种类" prop="przf2_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf2_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf2_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="断货">
                <el-table-column label="种类" prop="przf3_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf3_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf3_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="质量异常">
                <el-table-column label="种类" prop="przf4_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf4_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf4_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="供应商变更店铺名称">
                <el-table-column label="种类" prop="przf5_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf5_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf5_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="计划确认不下单">
                <el-table-column label="种类" prop="przf6_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf6_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf6_rate" minWidth="80"></el-table-column>
            </el-table-column>
            <el-table-column label="账期额度不足">
                <el-table-column label="种类" prop="przf7_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf7_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf7_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="其他作废原因">
                <el-table-column label="种类" prop="przf8_sku" minWidth="60"></el-table-column>
                <el-table-column label="件数" prop="przf8_skusl" minWidth="60"></el-table-column>
                <el-table-column label="种类占比" prop="przf8_rate" minWidth="70"></el-table-column>
            </el-table-column>
            <el-table-column label="未处理SKU种类" prop="wcl_sku_zl" minWidth="110"></el-table-column>
            <el-table-column label="未处理SKU件数" prop="wcl_sku_sl" minWidth="110"></el-table-column>
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
            // 排序
            handleSortChange(column){
                this.$emit('handleSort', column);
            },
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