<!--国内仓库存统计表_金额统计-->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row>
            <el-table-column label="销量段" prop="sale_section" minWidth="200"></el-table-column>
            <el-table-column label="当前库存">
                <el-table-column label="在途库存金额" prop="on_way_money" minWidth="95"></el-table-column>
                <el-table-column label="可用库存金额" prop="available_money" minWidth="95"></el-table-column>
                <el-table-column label="总库存金额" prop="stock_money" minWidth="100"></el-table-column>
            </el-table-column>
            <el-table-column label="销售情况">
                <el-table-column label="近30天销库金额" prop="30_sale_money" minWidth="105"></el-table-column>
                <el-table-column label="可用库存预售天数" prop="available_sale_day" minWidth="120"></el-table-column>
                <el-table-column label="总库存预售天数" prop="stock_sale_day" minWidth="110"></el-table-column>
            </el-table-column>
            <el-table-column label="库龄维度" v-if="isShowAge">
                <el-table-column label="库龄30天内 金额和占比" prop="stockage_xy_30_money" minWidth="90">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_30_money}}</div>
                        <div>{{scope.row.stockage_xy_30_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄30-60天 金额和占比" prop="stockage_xy_60_money" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_60_money}}</div>
                        <div>{{scope.row.stockage_xy_60_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄60-90天 金额和占比" prop="stockage_xy_90_money" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_90_money}}</div>
                        <div>{{scope.row.stockage_xy_90_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄90-180天 金额和占比" prop="stockage_xy_180_money" minWidth="100">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_180_money}}</div>
                        <div>{{scope.row.stockage_xy_180_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄180-270天 金额和占比" prop="stockage_xy_270_money" minWidth="105">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_270_money}}</div>
                        <div>{{scope.row.stockage_xy_270_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄270-360天 金额和占比" prop="stockage_xy_360_money" minWidth="105">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_xy_360_money}}</div>
                        <div>{{scope.row.stockage_xy_360_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="库龄超360天 金额和占比" prop="stockage_dy_360_money" minWidth="95">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.stockage_dy_360_money}}</div>
                        <div>{{scope.row.stockage_dy_360_rate}}</div>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column label="预计(总库存)可售卖天数维度" v-if="isShowSale">
                <el-table-column label="预售天数30天内 金额和占比" prop="ysxy_30day_money" minWidth="110">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_30day_money}}</div>
                        <div>{{scope.row.ysxy_30day_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数30-60天 金额和占比" prop="ysxy_60day_money" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_60day_money}}</div>
                        <div>{{scope.row.ysxy_60day_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数60-90天 金额和占比" prop="ysxy_90day_money" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_90day_money}}</div>
                        <div>{{scope.row.ysxy_90day_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数90-180天 金额和占比" prop="ysxy_180day_money" minWidth="125">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_180day_money}}</div>
                        <div>{{scope.row.ysxy_180day_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数180-270天 金额和占比" prop="ysxy_270day_money" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_270day_money}}</div>
                        <div>{{scope.row.ysxy_270day_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数270-360天 金额和占比" prop="ysxy_360day_money" minWidth="130">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysxy_360day_money}}</div>
                        <div>{{scope.row.ysxy_360day_rate}}</div>
                    </template>
                </el-table-column>
                <el-table-column label="预售天数超360天 金额和占比" prop="ysdy_360day_money" minWidth="120">
                    <template slot-scope="scope">
                        <div class="text-color">{{scope.row.ysdy_360day_money}}</div>
                        <div>{{scope.row.ysdy_360day_rate}}</div>
                    </template>
                </el-table-column>

            </el-table-column>
            <el-table-column label="断货影响">
                <el-table-column label="已断货天数*加权日均销量*成本" prop="outstock_yx" minWidth="110"></el-table-column>
            </el-table-column>
            <el-table-column label="年化存货周转率">
                <el-table-column label="上月" prop="sy_zzl" minWidth=""></el-table-column>
                <el-table-column label="最近7天" prop="7day_zzl" minWidth=""></el-table-column>
                <el-table-column label="最近30天" prop="30day_zzl" minWidth=""></el-table-column>
                <el-table-column label="最近90天" prop="90day_zzl" minWidth=""></el-table-column>
                <el-table-column label="最近365天" prop="365day_zzl" minWidth=""></el-table-column>
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
        name: 'DCountAmountTable',
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