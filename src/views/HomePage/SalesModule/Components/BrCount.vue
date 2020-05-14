<!--报表br统计 -->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight" border stripe highlight-current-row
                  :rowKey="rowKey" :load="load" lazy>
            <el-table-column label="">
                <el-table-column label="" prop="group_name" width="150"></el-table-column>
            </el-table-column>
            <el-table-column label="BR总额">
                <el-table-column label="session" prop="total_sessions" minWidth="100">
                    <template slot-scope="scope">
                        <span>{{scope.row && scope.row.total_sessions}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="pv" prop="total_pv" minWidth="100">
                    <template slot-scope="scope">
                        <span>{{scope.row && scope.row.total_pv}}</span>
                    </template>
                </el-table-column>
            </el-table-column>
            <el-table-column v-for="(item, index) in tableKey" :label="item" :key="index + 1">
                <el-table-column label="session" prop="sessions" minWidth="80">
                    <template slot-scope="scope">
                        <span>{{scope.row[item] && scope.row[item].sessions}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="pv" prop="pv" minWidth="80">
                    <template slot-scope="scope">
                        <span>{{scope.row[item] && scope.row[item].pv}}</span>
                    </template>
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
    import { autoAddTableInx } from "@/services";
    import config from "@/assets/js/config";
    export default {
        name: "BrCount",
        props: {
            tableData: {
                type: Array,
                default() {
                    return [];
                }
            },
            tableKey: {
                type: Array,
                default() {
                    return [];
                }
            },
            showSearch: {
                type: Boolean,
                default: true
            },
            queryType: {
                type: String,
                default: ""
            },
            isSetHeight: {
                type: Boolean,
                default: true
            },
            // 设置表格高度
            height: {
                type: String,
                default: ""
            },
            otherHeight: {
                type: Array,
                default() {
                    return [];
                }
            },
            extraView: {
                type: String,
                default: ""
            },
            isShowAge: {
                type: Boolean,
                default: false
            },
            isShowSale: {
                type: Boolean,
                default: false
            },
            rowKey: {
                type: String,
                default: ''
            },
            load: {
                type: Function,
                default() {}
            },
        },
        data() {
            return {
                tableHeight: "100px"
            };
        },
        computed: {},
        methods: {
            autoAddTableInx,

            // 刷新表格高度
            handleRefreshTableHeight() {
                this.$nextTick().then(() => {
                    document.querySelector("body").style.overflow = "hidden";
                    if (this.height) {
                        this.tableHeight = this.height;
                    } else {
                        this.tableHeight = config.setTableHeight("s-main", this.otherHeight);
                    }

                    this.$refs["myTable"] && this.$refs["myTable"].doLayout();
                    document.querySelector("body").style.overflow = "";
                });
            },
        },
        created() {},
        mounted() {
            this.$nextTick().then(() => {
                if (this.height && this.isSetHeight) {
                    this.tableHeight = this.height;
                } else {
                    this.tableHeight = this.isSetHeight ? config.setTableHeight("ui-main", this.otherHeight) : "";
                }
                this.$refs["myTable"] && this.$refs["myTable"].doLayout();
            });
            const vm = this;
            window.onresize = function() {
                document.querySelector("body").style.overflow = "hidden";
                vm.tableHeight = config.setTableHeight( "s-main", vm.otherHeight, null, vm.extraView );
                vm.$refs["myTable"] && vm.$refs["myTable"].doLayout();
                document.querySelector("body").style.overflow = "";
            };
        },
        watch: {
            showSearch(val, old) {
                let vm = this;
                document.querySelector("body").style.overflow = "hidden";
                setTimeout(() => {
                    if (vm.height && vm.isSetHeight) {
                        vm.tableHeight = vm.height;
                    } else {
                        vm.tableHeight = vm.isSetHeight ? config.setTableHeight("ui-main", vm.otherHeight) : "";
                    }
                    vm.$refs["myTable"] && vm.$refs["myTable"].doLayout();
                    document.querySelector("body").style.overflow = "";
                }, 400);
            }
        }
    };
</script>
<style scoped lang="less">
    @color: #ff9900;

    .text-color {
        color: @color;
    }
</style>