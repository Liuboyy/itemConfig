<!--新品销量标识_销量统计 -->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData"  border stripe highlight-current-row :height="tableHeight">
            <!-- <el-table-column label="FBA断货"> -->
                <el-table-column label="日销情况" prop="segment_name" minWidth="100"></el-table-column>
                <el-table-column v-for="(item,index) in tableKey" :label="item" :key="index">
                    <el-table-column label="新转FBA" prop="new_fba" minWidth="100">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].new_fba}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="总计" prop="count" minWidth="100">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].count}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
            <!-- </el-table-column> -->
        </el-table>
    </div>
</template>
<script>
import { autoAddTableInx } from "@/services";
import config from "@/assets/js/config";
export default {
    name: "PRoduntSalesVolume",
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
        }
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
                    this.tableHeight = config.setTableHeight(
                        "s-main",
                        this.otherHeight
                    );
                }

                this.$refs["myTable"] && this.$refs["myTable"].doLayout();
                document.querySelector("body").style.overflow = "";
            });
        }
    },
    created() {},
    mounted() {
        this.$nextTick().then(() => {
            if (this.height && this.isSetHeight) {
                this.tableHeight = this.height;
            } else {
                this.tableHeight = this.isSetHeight
                    ? config.setTableHeight("ui-main", this.otherHeight)
                    : "";
            }
            this.$refs["myTable"] && this.$refs["myTable"].doLayout();
        });
        const vm = this;
        window.onresize = function() {
            document.querySelector("body").style.overflow = "hidden";
            vm.tableHeight = config.setTableHeight(
                "s-main",
                vm.otherHeight,
                null,
                vm.extraView
            );
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
                    vm.tableHeight = vm.isSetHeight
                        ? config.setTableHeight("ui-main", vm.otherHeight)
                        : "";
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