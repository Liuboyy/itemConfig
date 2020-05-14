<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="序号" prop="index" width="60">
                <template slot-scope="scope">
                    <span>{{autoAddTableInx(scope.$index)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="账号" prop="account_name" width="100"></el-table-column>
            <el-table-column label="SKU" prop="sku" width="100"></el-table-column>
            <el-table-column label="SellerSku" prop="seller_sku" width="140"></el-table-column>
            <el-table-column label="售价">
                <el-table-column label="当前" prop="current_price" width="100"></el-table-column>
                <el-table-column label="每周平均" prop="avg_price" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="利润率">
                <el-table-column label="当前" prop="profit_rate" width="80"></el-table-column>
                <el-table-column label="每周" prop="avg_profit_rate" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="销量">
                <el-table-column label="总" prop="total_sku_sale" width="80"></el-table-column>
                <el-table-column label="每周" prop="week_sku_sale" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="销售额">
                <el-table-column label="总" prop="total_cny_price" width="100"></el-table-column>
                <el-table-column label="每周" prop="week_cny_price" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="利润">
                <el-table-column label="总" prop="total_profit" width="80"></el-table-column>
                <el-table-column label="每周" prop="week_profit" width="80"></el-table-column>
            </el-table-column>
            <el-table-column label="SKU类目" prop="product_onelevel_name" width=""></el-table-column>
            <el-table-column label="状态" prop="data_status" width=""></el-table-column>
            <el-table-column label="库存" prop="quantity" width=""></el-table-column>
            <el-table-column label="修改日志" prop="modify_log" width=""></el-table-column>
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
        name: 'SoutheastAsiaTable',
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