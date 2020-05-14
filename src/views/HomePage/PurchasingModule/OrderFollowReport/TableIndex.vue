<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="序号" prop="index" width="60">
                <template slot-scope="scope">
                    <span>{{autoAddTableInx(scope.$index)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="统计日期" prop="statis_date" width="90"></el-table-column>
            <el-table-column label="采购员" prop="user_name" width="110"></el-table-column>
            <el-table-column label="组别" prop="group_name" width="110"></el-table-column>
            <el-table-column label="业务线" prop="purchase_type" width="70"></el-table-column>
            <el-table-column label="供应商数量" prop="supplier_cnt"></el-table-column>
            <el-table-column label="结算方式" prop="account_type" width="110">
                <template slot-scope="scope">
                    <el-popover
                            v-if="scope.row.account_type && scope.row.account_type.length > 8"
                            placement="top-start"
                            width="300"
                            trigger="hover">
                        <span>{{scope.row.account_type}}</span>
                        <span slot="reference" v-html="scope.row.account_type.length > 8 ? scope.row.account_type.substring(0,8) + '...':scope.row.account_type">{{scope.row.account_type}}</span>
                    </el-popover>
                    <span v-else>{{scope.row.account_type}}</span>
                </template>
            </el-table-column>
            <el-table-column label="PO数量" prop="po_cnt" width="70"></el-table-column>
            <el-table-column label="已作废PO数量" prop="cancel_po_cnt" width="100"></el-table-column>
            <el-table-column label="SKU数量" prop="sku_cnt" width="70"></el-table-column>
            <el-table-column label="采购数量" prop="purchase_qty" width="70"></el-table-column>
            <el-table-column label="采购金额" prop="po_amount" width="120"></el-table-column>
            <el-table-column label="未付款订单">
                <el-table-column label="未申请付款" prop="unpay_cnt">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'unpay_cnt')">{{scope.row.unpay_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="待财务付款" prop="pending_pay_cnt">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'pending_pay_cnt')">{{scope.row.pending_pay_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="单据驳回" prop="reject_cnt" width="70">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'reject_cnt')">{{scope.row.reject_cnt}}</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="已付款" prop="paid_cnt" width="80"></el-table-column>
            <el-table-column label="PO状态">
                <el-table-column label="待采购询价" prop="wait_pur_qury_cnt" width="90">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'wait_pur_qury_cnt')">{{scope.row.wait_pur_qury_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="等待生成进货单" prop="wait_generate_order_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'wait_generate_order_cnt')">{{scope.row.wait_generate_order_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="等待到货" prop="wait_arrive_cnt" width="70">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'wait_arrive_cnt')">{{scope.row.wait_arrive_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="部分到货等待剩余" prop="part_arrive_wait_cnt" width="120">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'part_arrive_wait_cnt')">{{scope.row.part_arrive_wait_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="作废订单待审核" prop="obsolete_wati_check_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'obsolete_wati_check_cnt')">{{scope.row.obsolete_wati_check_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="作废订单待退款" prop="obsolete_pending_refund_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'obsolete_pending_refund_cnt')">{{scope.row.obsolete_pending_refund_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="全部到货" prop="all_arrive_cnt" width="70"></el-table-column>
                <el-table-column label="部分到货不等待剩余" prop="part_arrive_nowait_cnt" width="130"></el-table-column>
            </el-table-column>
            <el-table-column label="异常处理" prop="abnormal_po_cnt" width="80">
                <template slot-scope="scope">
                    <el-button size="small" type="text" @click="handleClick(scope.row, 'abnormal_po_cnt')">{{scope.row.abnormal_po_cnt}}</el-button>
                </template>
            </el-table-column>
            <el-table-column label="取消未到货状态">
                <el-table-column label="待采购经理审核" prop="pending_mang_check_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'pending_mang_check_cnt')">{{scope.row.pending_mang_check_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="待上传截图" prop="pending_upload_img_cnt">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'pending_upload_img_cnt')">{{scope.row.pending_upload_img_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="待财务收款" prop="pending_finance_receipt_cnt">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'pending_finance_receipt_cnt')">{{scope.row.pending_finance_receipt_cnt}}</el-button>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="报损状态">
                <el-table-column label="待采购经理审核" prop="pending_mang_check_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'pending_mang_check_cnt')">{{scope.row.pending_mang_check_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="采购经理已驳回" prop="po_mang_obsolete_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'po_mang_obsolete_cnt')">{{scope.row.po_mang_obsolete_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="待财务经理审核" prop="pending_finance_mang_check_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'pending_finance_mang_check_cnt')">{{scope.row.pending_finance_mang_check_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="财务经理已驳回" prop="finance_mang_reject_cnt" width="105">
                    <template slot-scope="scope">
                        <el-button size="small" type="text" @click="handleClick(scope.row, 'finance_mang_reject_cnt')">{{scope.row.finance_mang_reject_cnt}}</el-button>
                    </template>
                </el-table-column>
                <el-table-column label="已通过" prop="passed_cnt" width="70"></el-table-column>
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

            handleClick(row, type) {
                this.$emit('click', row, type)
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