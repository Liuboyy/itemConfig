<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="序号" prop="index" width="60">
                <template slot-scope="scope">
                    <span>{{autoAddTableInx(scope.$index)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="采购单创建日期" prop="po_create_time" width="110"></el-table-column>
            <el-table-column label="采购员" prop="bayer_name" v-if="queryType === '2'" width="110"></el-table-column>
            <el-table-column label="组别" prop="group_name" v-if="queryType === '2'" width="110"></el-table-column>
            <el-table-column label="业务线" prop="purchase_type" width="70"></el-table-column>
            <el-table-column label="PO数量" prop="po_sum" width="70"></el-table-column>
            <el-table-column label="备货单数量" prop="demand_sum" width="90"></el-table-column>
            <el-table-column label="采购数量" prop="pur_qty" width="70"></el-table-column>
            <el-table-column label="下单总金额" prop="pur_money" width="110"></el-table-column>
            <el-table-column label="入库PO数量" prop="instock_po_sum" width="90"></el-table-column>
            <el-table-column label="入库SKU数量" prop="instock_sku_qty" width="100"></el-table-column>
            <el-table-column label="入库数量" prop="instock_sku_sum" width="70"></el-table-column>
            <el-table-column label="入库金额" prop="instock_money" width="110"></el-table-column>
            <el-table-column label="生成PO单时效和数量">
                <el-table-column label="时效" prop="pr_po_interval" width="70"></el-table-column>
                <el-table-column label="数量" prop="pr_po_qty" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="PO审核时效和数量">
                <el-table-column label="时效" prop="audit_create_interval" width="70"></el-table-column>
                <el-table-column label="数量" prop="audit_create_qty" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="请款时效和数量">
                <el-table-column label="时效" prop="please_audit_interval" width="70"></el-table-column>
                <el-table-column label="数量" prop="please_audit_qty" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="付款时效和数量">
                <el-table-column label="时效" prop="pay_please_interval" width="70"></el-table-column>
                <el-table-column label="数量" prop="pay_please_qty" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="到仓时效和数量">
                <el-table-column label="时效" prop="quality_pay_interval" width="70"></el-table-column>
                <el-table-column label="数量" prop="quality_pay_qty" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="仓库点数时效和数量">
                <el-table-column label="时效" prop="aging_1" width="70"></el-table-column>
                <el-table-column label="数量" prop="actual_num" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="质检时效和数量">
                <el-table-column label="时效" prop="aging_2" width="70"></el-table-column>
                <el-table-column label="数量" prop="quality_level_num" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="贴码时效和数量">
                <el-table-column label="时效" prop="aging_3" width="70"></el-table-column>
                <el-table-column label="数量" prop="post_code_num" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="上架时效和数量">
                <el-table-column label="时效" prop="aging_4" width="70"></el-table-column>
                <el-table-column label="数量" prop="upper_num" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="到货日期<=7天">
                <el-table-column label="数量" prop="xiao_7_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="xiao_7_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="7<到货日期<=15天">
                <el-table-column label="数量" prop="between_7_15_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="between_7_15_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="15<到货日期<=30天">
                <el-table-column label="数量" prop="between_15_30_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="between_15_30_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="到货日期>30天">
                <el-table-column label="数量" prop="da_30_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="da_30_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="按期交付">
                <el-table-column label="数量" prop="delivery_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="delivery_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="预期时间+3天">
                <el-table-column label="数量" prop="delivery_3_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="delivery_3_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="预期时间+7天">
                <el-table-column label="数量" prop="delivery_7_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="delivery_7_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="预期时间+14天">
                <el-table-column label="数量" prop="delivery_14_qty" width="70"></el-table-column>
                <el-table-column label="比例" prop="delivery_14_rate" width="80"></el-table-column>
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