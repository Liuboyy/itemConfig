<!--海外仓仓库存统计表_种类数统计-->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="销量段" prop="brank" minWidth="200"></el-table-column>
            <el-table-column label="当前库存">
                <el-table-column label="中转仓在途种类数" prop="transit_onway_qty" minWidth="120"></el-table-column>
                <el-table-column label="中转仓在库种类数" prop="transit_onstock_qty" minWidth="120"></el-table-column>
                <el-table-column label="海外仓在途种类数" prop="overseas_onway_qty" minWidth="120"></el-table-column>
                <el-table-column label="海外仓在库种类数" prop="overseas_onstock_qty" minWidth="120"></el-table-column>
                <el-table-column label="海外仓总库存种类数" prop="overseas_total_qty" minWidth="130"></el-table-column>
                <el-table-column label="中转仓+海外仓总库存种类数" prop="total_qty" minWidth="110"></el-table-column>
            </el-table-column>
            <el-table-column label="销售情况">
                <el-table-column label="近30天海外仓销库种类数" prop="sale_30_qty" minWidth="100"></el-table-column>
                <el-table-column label="海外仓在库库存活动率" prop="overseas_onstock_sale_day" minWidth="110"></el-table-column>
                <el-table-column label="海外仓总库存活动率" prop="overseas_total_sale_day" minWidth="100"></el-table-column>
                <el-table-column label="海外仓总库存+中转仓在库活动率" prop="to_sale_day" minWidth="140"></el-table-column>
                <el-table-column label="海外仓总库存+中转仓总库存活动率" prop="total_sale_day" minWidth="140"></el-table-column>
            </el-table-column>
            <el-table-column label="库龄维度" v-if="isShowAge">
                <el-table-column label="库龄90天内 种类数和占比" prop="age_90_qty" minWidth="100">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.age_90_qty}}</div>
                        <div>{{scope.row.age_90_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄90-180天 种类数和占比" prop="age_90_180_qty" minWidth="100">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.age_90_180_qty}}</div>
                        <div>{{scope.row.age_90_180_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄180-270天 种类数和占比" prop="age_180_270_qty" minWidth="105">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.age_180_270_qty}}</div>
                        <div>{{scope.row.age_180_270_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄270-360天 种类数和占比" prop="age_270_360_qty" minWidth="105">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.age_270_360_qty}}</div>
                        <div>{{scope.row.age_270_360_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄超360天 种类数和占比" prop="age_360_qty" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.age_360_qty}}</div>
                        <div>{{scope.row.age_360_rate}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="海外仓在库预售天数维度" v-if="isShowOnstock">
                <el-table-column label="预售天数90天内 种类数和占比" prop="onstock_90_qty" minWidth="110">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.onstock_90_qty}}</div>
                        <div>{{scope.row.onstock_90_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数90-180天 种类数和占比" prop="onstock_90_180_qty" minWidth="125">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.onstock_90_180_qty}}</div>
                        <div>{{scope.row.onstock_90_180_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数180-270天 种类数和占比" prop="onstock_180_270_qty" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.onstock_180_270_qty}}</div>
                        <div>{{scope.row.onstock_180_270_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数270-360天 种类数和占比" prop="onstock_270_360_qty" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.onstock_270_360_qty}}</div>
                        <div>{{scope.row.onstock_270_360_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数超360天 种类数和占比" prop="onstock_360_qty" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.onstock_360_qty}}</div>
                        <div>{{scope.row.onstock_360_rate}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="海外仓在途+在库预售天数维度" v-if="isShowOnway">
                <el-table-column label="预售天数90天内 数量和占比" prop="on_way_stock_90_qty" minWidth="110">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.on_way_stock_90_qty}}</div>
                        <div>{{scope.row.on_way_stock_90_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数90-180天 数量和占比" prop="on_way_stock_90_180_qty" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.on_way_stock_90_180_qty}}</div>
                        <div>{{scope.row.on_way_stock_90_180_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数180-270天 数量和占比" prop="on_way_stock_180_270_qty" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.on_way_stock_180_270_qty}}</div>
                        <div>{{scope.row.on_way_stock_180_270_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数270-360天 数量和占比" prop="on_way_stock_270_360_qty" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.on_way_stock_270_360_qty}}</div>
                        <div>{{scope.row.on_way_stock_270_360_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数超360天 数量和占比" prop="on_way_stock_360_qty" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.on_way_stock_360_qty}}</div>
                        <div>{{scope.row.on_way_stock_360_rate}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="断货影响">
                <el-table-column label="已断货天数*加权日均销量" prop="outstock_day_sale_money" minWidth="100"></el-table-column>
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
        name: 'OCountSpeciesTable',
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
            isShowAge: {
                type: Boolean,
                default: false
            },
            isShowOnstock: {
                type: Boolean,
                default: false
            },
            isShowOnway: {
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

                    this.$refs['myTable'].doLayout();
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
<style scoped lang="less">
    @color: #ff9900;

    .text-color {
        color:  @color;
    }
</style>