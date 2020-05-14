<!--新品销量标识_占比统计 -->
<template>
    <div class="ui-main-module-table">
        <el-table ref="myTable" :data="tableData" :height="tableHeight"  border stripe highlight-current-row>
                <el-table-column label="日销情况" prop="segment_name" minWidth="50"></el-table-column>
                <el-table-column v-for="(item,index) in tableKey" :label="item" :key="index">
                    <el-table-column label="新转FBA" prop="ratio" minWidth="50">
                        <template slot-scope="scope">
                            <span>{{scope.row[item] && scope.row[item].ratio}}</span>
                        </template>
                    </el-table-column>
                </el-table-column>
        </el-table>
    </div>
</template>
<script>
import { autoAddTableInx } from "@/services";
import config from "@/assets/js/config";
export default {
    name: "PRoductProPortion",
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