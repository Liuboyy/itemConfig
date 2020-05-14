<!--FBA断货统计_月统计表 -->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
           <el-table-column label="FBA断货" fixed="left" width="200">
                <el-table-column label="销量段" prop="name" width="200"></el-table-column>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableKey" :label="item" :key="index">
                 <el-table-column label="非停售,近30天销量>0">
                    <el-table-column label="listing条目数" prop="list_30_count" minWidth="100">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].list_30_count}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="近30天销量" prop="sales_30_qty" minWidth="">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].sales_30_qty}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="近30天销售金额" prop="sales_30_money" minWidth="105">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].sales_30_money}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                <el-table-column label="非停售,近30天销量>0,库存为0" prop="" minWidth="">
                    <el-table-column label="listing条目数" prop="list_30d_count" minWidth="100">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].list_30d_count}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="加权日均销量*已断货天数" prop="sales_30d_qty" minWidth="100">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].sales_30d_qty}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="加权日均销量*已断货天数*成本" prop="sales_30d_money" minWidth="110">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].sales_30d_money}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
                 <el-table-column label="断货影响比列" prop="" minWidth="110">
                     <el-table-column label="断货listing占比" prop="count_rate" minWidth="100">
                         <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].count_rate}}</span>
                        </template>
                     </el-table-column>
                    <el-table-column label="断货销量影响占比" prop="qty_rate" minWidth="110">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].qty_rate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="断货销售金额影响占比" prop="money_rate" minWidth="135">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].money_rate}}</span>
                        </template>
                    </el-table-column>
                 </el-table-column>
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
        name: 'FVCountAmountTable',
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
            isShowAge: {
                type: Boolean,
                default: false
            },
            isShowSale: {
                type: Boolean,
                default: false
            }
        },
        data(){
            return {
                tableHeight: '100px',
            }
        },
        computed: {},
        methods: {
            autoAddTableInx,

            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    document.querySelector('body').style.overflow = 'hidden';
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight('s-main', this.otherHeight);
                    }

                    this.$refs['myTable'] && this.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                });
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
                this.$refs['myTable'] && this.$refs['myTable'].doLayout();
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
                    vm.$refs['myTable'] && vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400);
            },
        }
    }
</script>
<style scoped lang="less">
    @color: #ff9900;

    .text-color {
        color:  @color;
    }
</style>