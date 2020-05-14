<template>
    <div :class="className" v-if="initTable">
        <slot></slot>
        <el-table ref="myTable" stripe border highlight-current-row
                  :data="tableData" :height="tableHeight">
            <el-table-column label="序号" prop="index" width="60" type="type">
                <template slot-scope="scope">
                    <span>{{autoAddTableInx(scope.$index)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="SKU" prop="sku" width="140"></el-table-column>
            <el-table-column label="产品类型" prop="product_type" width="70"></el-table-column>
            <el-table-column label="一级产品线" prop="one_level_name" width="100"></el-table-column>
            <el-table-column label="二级产品线" prop="two_level_name" width="100"></el-table-column>
            <el-table-column label="三级产品线" prop="three_level_name" width="120"></el-table-column>
            <el-table-column label="开发员" prop="developer" width="120"></el-table-column>
            <el-table-column label="SKU创建时间" prop="create_date" width="140"></el-table-column>
            <el-table-column label="产品状态" prop="product_status" width="140">
                <template slot-scope="scope">
                    <i v-if="scope.row.product_status_id == '6'|| scope.row.product_status_id == '9'" class="ui-state_dot state_orange"></i>
                    <i v-if="scope.row.product_status_id == '2'||scope.row.product_status_id == '3'||scope.row.product_status_id == '5'||scope.row.product_status_id == '6'|| scope.row.product_status_id == '14'|| scope.row.product_status_id == '12'|| scope.row.product_status_id == '11'|| scope.row.product_status_id == '10'|| scope.row.product_status_id == '8'|| scope.row.product_status_id == '4'|| scope.row.product_status_id == '3'|| scope.row.product_status_id == '2'|| scope.row.product_status_id == '1'|| scope.row.product_status_id == '18'|| scope.row.product_status_id == '17'|| scope.row.product_status_id == '16'|| scope.row.product_status_id == '15'|| scope.row.product_status_id == '21'|| scope.row.product_status_id == '20'|| scope.row.product_status_id == '19'|| scope.row.product_status_id == '27'|| scope.row.product_status_id == '22'|| scope.row.product_status_id == '30'|| scope.row.product_status_id == '29'|| scope.row.product_status_id == '28'" class="ui-state_dot state_blue"></i>
                    <i v-if="scope.row.product_status_id == '5'||scope.row.product_status_id == '7'||scope.row.product_status_id == '100'" class="ui-state_dot state_gray"></i>
                    <i v-if="scope.row.product_status_id == '0'" class="ui-state_dot state_red"></i>
                    <span>{{scope.row.product_status}}</span>
                </template>
            </el-table-column>
            <el-table-column label="创建sku到创建采购单耗时" prop="pur_create_time" width="100"></el-table-column>
            <el-table-column label="采购单状态" prop="purchas_status_fast" width="140">
                <template slot-scope="scope">
                    <i v-if="scope.row.purchas_status_fast_id == '1'" class="ui-state_dot state_orange"></i>
                    <i v-if="scope.row.purchas_status_fast_id == '2'||scope.row.purchas_status_fast_id == '3'||scope.row.purchas_status_fast_id == '5'||scope.row.purchas_status_fast_id == '6'|| scope.row.purchas_status_fast_id == '7'|| scope.row.purchas_status_fast_id == '8'|| scope.row.purchas_status_fast_id == '9'|| scope.row.purchas_status_fast_id == '99'" class="ui-state_dot state_blue"></i>
                    <i v-if="scope.row.purchas_status_fast_id == '4'||scope.row.purchas_status_fast_id == '10'" class="ui-state_dot state_gray"></i>
                    <span>{{scope.row.purchas_status_fast}}</span>
                </template>
            </el-table-column>
            <el-table-column label="首次">
                <el-table-column label="创建时间" prop="pur_create_time1" width="140"></el-table-column>
                <el-table-column label="付款时间" prop="payer_time" width="140"></el-table-column>
                <el-table-column label="到货时间" prop="arrive_transfer_time" width="140"></el-table-column>
                <el-table-column label="到仓时间" prop="arrive_overseas_time1" width="140"></el-table-column>
            </el-table-column>
            <el-table-column label="采购单数量">
                <el-table-column label="所有" prop="pur_number" width="70"></el-table-column>
                <el-table-column label="已到货" prop="pur_number1" width="70"></el-table-column>
                <el-table-column label="货到付款" prop="pur_number2" width="70"></el-table-column>
                <el-table-column label="未付款" prop="pur_number3" width="70"></el-table-column>
            </el-table-column>
            <el-table-column label="所有状态采购单">
                <el-table-column label="总计采购数量" prop="pur_sum" width="100"></el-table-column>
                <el-table-column label="总计采购金额" prop="pay_price" width="100"></el-table-column>
            </el-table-column>
            <el-table-column label="全部到货">
                <el-table-column label="数量" prop="pur_sum1" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price1" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="部分到货">
                <el-table-column label="数量" prop="pur_sum2" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price2" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="等待到货">
                <el-table-column label="数量" prop="pur_sum3" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price3" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="等待生成进货单">
                <el-table-column label="数量" prop="pur_sum4" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price4" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="待采购审核">
                <el-table-column label="数量" prop="pur_sum5" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price5" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="等待采购询价">
                <el-table-column label="数量" prop="pur_sum6" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price6" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="作废订单待审核">
                <el-table-column label="数量" prop="pur_sum7" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price7" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="作废订单待退款">
                <el-table-column label="数量" prop="pur_sum8" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price8" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="订单已作废">
                <el-table-column label="数量" prop="pur_sum9" width="70"></el-table-column>
                <el-table-column label="采购金额" prop="pay_price9" width=""></el-table-column>
            </el-table-column>
            <el-table-column label="已付金额" prop="pay_price10" width="100"></el-table-column>
            <el-table-column label="入库数量" prop="arrive_transfer_sum" width="80"></el-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </el-table>
    </div>
</template>

<script>
    /**
     * name: 表格渲染信息
     *
     * params:
     *      tableKey: 表头信息  ['姓名', '性别']
     *      tableData:  表格数据  [{name: '小白'， sex: '男'}]
     *      tableProps:  表格props  ['name', 'sex']
     *      showSearch:  收缩搜索栏时切换表格高度
     *      isCheck:  是否可勾选
     *      otherHeight:  自适应表格高度
     *      border: 是否有边框
     *      className: 自定义类名
     * */
    import { autoAddTableInx } from '@/services';
    import config from '@/assets/js/config';

    export default {
        name: 'SkuDimension',
        props: {
            tableKey: {
                type: Array,
                default () {
                    return [];
                }
            },
            tableData: {
                type: Array,
                default () {
                    return [];
                }
            },
            tableProps: {
                type: Array,
                default () {
                    return [];
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            tableWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            otherHeight: {
                type: Array,
                default () {
                    return [];
                }
            },
            className: {
                type: String,
                default: 'ui-main-module-table'
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
            tableMinWidth: {
                type: Array,
                default () {
                    return [];
                }
            },
            extraView: {
                type: String,
                default: ''
            },
            showAdvanceQuery: {
                type: Boolean,
                default: true
            },
        },
        data () {
            return {
                initTable: true,
                tableHeight: '100px',
            };
        },
        methods: {
            autoAddTableInx,
            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    document.querySelector('body').style.overflow = 'hidden';
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    }

                    this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                });
            },
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
    };
</script>

<style scoped lang="less">

</style>
