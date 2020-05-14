<!--国内仓库存统计表_种类数统计-->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="销量段" prop="sale_section" minWidth="200"></el-table-column>
            <el-table-column label="当前库存">
                <el-table-column label="在途种类数" prop="on_way_stock" minWidth="90"></el-table-column>
                <el-table-column label="可用种类数" prop="available_qty" minWidth="90"></el-table-column>
                <el-table-column label="总库存种类数" prop="stock_qty" minWidth="100"></el-table-column>
            </el-table-column>
            <el-table-column label="销售情况">
                <el-table-column label="近30天销库种类数" prop="30_sale_sum" minWidth="120"></el-table-column>
                <el-table-column label="可用库存SKU存活率" prop="available_rate" minWidth="130"></el-table-column>
                <el-table-column label="总库存SKU存活率" prop="stock_rate" minWidth="120"></el-table-column>
            </el-table-column>
            <el-table-column label="库龄维度" v-if="isShowAge">
                <el-table-column label="库龄30天内 种类数和占比" prop="stockage_xy_30_money" minWidth="100">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_30_money}}</div>
                        <div>{{scope.row.stockage_xy_30_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄30-60天 种类数和占比" prop="stockage_xy_60_money" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_60_money}}</div>
                        <div>{{scope.row.stockage_xy_60_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄60-90天 种类数和占比" prop="stockage_xy_90_money" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_90_money}}</div>
                        <div>{{scope.row.stockage_xy_90_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄90-180天 种类数和占比" prop="stockage_xy_180_money" minWidth="100">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_180_money}}</div>
                        <div>{{scope.row.stockage_xy_180_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄180-270天 种类数和占比" prop="stockage_xy_270_money" minWidth="105">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_270_money}}</div>
                        <div>{{scope.row.stockage_xy_270_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄270-360天 种类数和占比" prop="stockage_xy_360_money" minWidth="105">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_360_money}}</div>
                        <div>{{scope.row.stockage_xy_360_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄超360天 种类数和占比" prop="stockage_dy_360_money" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_dy_360_money}}</div>
                        <div>{{scope.row.stockage_dy_360_rate}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="预计(总库存)可售卖天数维度" v-if="isShowSale">
                <el-table-column label="预售天数30天内 种类数和占比" prop="ysxy_30day_zl" minWidth="110">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_30day_zl}}</div>
                        <div>{{scope.row.ysxy_30day_zl_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数30-60天 种类数和占比" prop="stockage_xy_60_money" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_60_money}}</div>
                        <div>{{scope.row.stockage_xy_60_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数60-90天 种类数和占比" prop="ysxy_60day_zl" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_60day_zl}}</div>
                        <div>{{scope.row.ysxy_60day_zl_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="可售天数90-180天 种类数和占比" prop="ysxy_90day_zl" minWidth="125">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_90day_zl}}</div>
                        <div>{{scope.row.ysxy_90day_zl_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数180-270天 种类数和占比" prop="ysxy_180day_zl" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_180day_zl}}</div>
                        <div>{{scope.row.ysxy_180day_zl_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数270-360天 种类数和占比" prop="ysxy_270day_zl" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_270day_zl}}</div>
                        <div>{{scope.row.ysxy_270day_zl_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数超360天 种类数和占比" prop="ysxy_360day_zl" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_360day_zl}}</div>
                        <div>{{scope.row.ysxy_360day_zl_rate}}</div>
                    </template>
                </el-table-column>

            </el-table-column>
            <el-table-column label="断货影响">
                <el-table-column label="近30天有销量且当前库存为0的SKU占比" prop="outstock_yx" minWidth="140"></el-table-column>
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
        name: 'DCountCalculateTable',
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