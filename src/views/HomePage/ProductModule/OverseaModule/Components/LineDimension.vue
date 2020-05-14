<template>
    <div :class="className" v-if="initTable">
        <slot></slot>
        <vxe-table ref="myTable" border stripe size="mini" resizable
                   :data.sync="tableData" :height="tableHeight" :tree-config="{children: 'children'}"
                   @toggle-tree-change="handleToggleTree">
            <vxe-table-column title="产品线" field="line_list_name" width="200" tree-node></vxe-table-column>
            <vxe-table-column title="创建sku到创建采购单耗时" field="day_time" width="100"></vxe-table-column>
            <vxe-table-column title="采购单数量">
                <vxe-table-column title="所有" field="pur_number" width="70"></vxe-table-column>
                <vxe-table-column title="已到货" field="pur_number_a" width="70"></vxe-table-column>
                <vxe-table-column title="货到付款" field="pur_number_b" width="70"></vxe-table-column>
                <vxe-table-column title="未付款" field="pur_number_c" width="70"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="所有状态采购单">
                <vxe-table-column title="总计采购数量" field="pur_sum" width="100"></vxe-table-column>
                <vxe-table-column title="总计采购金额" field="pay_price" width="100"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="全部到货">
                <vxe-table-column title="数量" field="pur_sum_j" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_j" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="部分到货">
                <vxe-table-column title="数量" field="pur_sum_a" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_a" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="等待到货">
                <vxe-table-column title="数量" field="pur_sum_b" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_b" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="等待生成进货单">
                <vxe-table-column title="数量" field="pur_sum_c" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_c" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="待采购审核">
                <vxe-table-column title="数量" field="pur_sum_d" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_d" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="等待采购询价">
                <vxe-table-column title="数量" field="pur_sum_e" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_e" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="作废订单待审核">
                <vxe-table-column title="数量" field="pur_sum_f" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_f" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="作废订单待退款">
                <vxe-table-column title="数量" field="pur_sum_g" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_g" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="订单已作废">
                <vxe-table-column title="数量" field="pur_sum_h" width="70"></vxe-table-column>
                <vxe-table-column title="采购金额" field="pay_price_h" width="80"></vxe-table-column>
            </vxe-table-column>
            <vxe-table-column title="已付金额" field="pay_price_i" width="100"></vxe-table-column>
            <vxe-table-column title="入库数量" field="arrive_transfer_sum" width="80"></vxe-table-column>
            <template slot="empty">
                <div>
                    <NotData v-show="!tableData.length"></NotData>
                </div>
            </template>
        </vxe-table>
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
        name: 'LineDimension',
        props: {
            tableData: {
                type: Array,
                default () {
                    return [];
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            className: {
                type: String,
                default: 'ui-main-module-table'
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
            isSetHeight: {
                type: Boolean,
                default: true
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
                children: []
            };
        },
        methods: {
            autoAddTableInx,

            //展开行
            handleToggleTree({row}) {
                this.$emit('toggleTree', row);
            },

            // 刷新表格高度
            handleRefreshTableHeight () {
                this.$nextTick().then(() => {
                    document.querySelector('body').style.overflow = 'hidden';
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight('ui-main-module', this.otherHeight);
                    }
                    this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
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
                this.$refs['myTable'].doLayout && this.$refs['myTable'].doLayout();
            });
            const vm = this;
            window.onresize = function(){
                document.querySelector('body').style.overflow = 'hidden';
                vm.tableHeight = config.setTableHeight('s-main', vm.otherHeight, null, vm.extraView);
                vm.$refs['myTable'].doLayout && vm.$refs['myTable'].doLayout();
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
                    vm.$refs['myTable'].doLayout && vm.$refs['myTable'].doLayout();
                    document.querySelector('body').style.overflow = '';
                }, 400);
            },
        }
    };
</script>

<style scoped lang="less">
    @borderColor: #efefef;

    /deep/.vxe-table {
        border-left: 1px solid @borderColor;
        border-right: 1px solid @borderColor;
        .vxe-table--header-wrapper {
            border-top: 1px solid @borderColor;
        }
        th {
            color: #666666;
            background: #f5f8fa!important;
        }
        td {
            color: #333333;
        }
    }

    /deep/.vxe-table .vxe-cell {
        padding: 0 8px;
    }

    /deep/.vxe-table.t--border .vxe-body--column {
        border-right: 1px solid @borderColor;
        border-bottom: 1px solid @borderColor;
    }

    /deep/.vxe-table .vxe-tree-wrapper {
        width: 20px;
        .vxe-tree--node-btn {
            font-size: 14px;
        }
    }

    /deep/.vxe-icon--caret-right:before {
        content: "";
        position: absolute;
        top: .38em;
        left: .12em;
        width: .5em;
        height: .5em;
        border-width: .1em;
        border-style: solid;
        border-top-color: inherit;
        border-right-color: inherit;
        border-bottom-color: transparent;
        border-left-color: transparent;
        transform: rotate(315deg);
    }

</style>
