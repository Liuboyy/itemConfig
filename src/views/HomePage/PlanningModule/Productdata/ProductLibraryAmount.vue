<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                            label="开始日期"
                            v-model="queryData.dateStart"
                            template="date"
                            :isOption="false"
                        ></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement
                            label="中间日期"
                            v-model="queryData.dateMiddle"
                            template="date"
                            :isOption="false"
                        ></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement
                            label="结束日期"
                            v-model="queryData.dateEnd"
                            template="date"
                            :isOption="false"
                        ></SearchRequirement>
                    </li>
                </ul>
                <FilterBtn
                    :resetFn="handleResetQueryInfo"
                    :queryFn="handleQueryInfo"
                    refTable="tableArea"
                    :params="{}"
                ></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch">
                <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
            </span>
            <el-button
                v-if="item.method && item.permit(thisVm) && item.icon"
                v-for="item in buttonList"
                size="small"
                :type="item.type"
                :key="item.value"
                :icon="item.icon"
                @click="item.action(thisVm, item.method)"
            >{{item.name}}</el-button>
        </div>
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="销量统计" name="1"></el-tab-pane>
                <el-tab-pane label="占比统计" name="2"></el-tab-pane>
            </el-tabs>
        </div>

        <PRoduntSalesVolume
            v-if="queryData.query_type === '1'"
            ref="tableArea"
            :tableData="tableData"
            :showSearch="showSearch"
            :otherHeight="['el-tabs__header']"
            :tableKey="tableKey"
        ></PRoduntSalesVolume>

        <PRoductProPortion
            v-if="queryData.query_type === '2'"
            ref="tableArea"
            :tableData="tableData"
            :showSearch="showSearch"
            :otherHeight="['el-tabs__header']"
            :tableKey="tableKey"
        ></PRoductProPortion>
    </div>
</template>

<script>
import config from "@/assets/js/config";
import { autoAddTableInx } from "@/services";
import { mapActions, mapGetters } from "vuex";
import { getSalesMonthMarkNewSaleMoneyData } from "@/api/planning_module/product_library_amount";
import PRoduntSalesVolume from "../components/PRoduntSalesVolume";
import PRoductProPortion from "../components/PRoductProPortion";
import { validTime, getCountDate } from "@/api/common/date_format";

// 组件名称，用于keep-alive和权限（要跟路由保持一致）
const component_name = "product_library_amount";

export default {
    name: component_name,
    components: { PRoduntSalesVolume, PRoductProPortion },
    data() {
        return {
            // 初始化实例对象
            thisVm: {},

            //搜索缩进
            showSearch: true,

            queryData: {
                query_type: '1',
                dateStart: '',
                dateEnd: '',
                dateMiddle: ''
            },

            optionList: {},

            tableData: [],
            tableKey: [],
            tableProps: [],
            tableMinWidth: [],

            saveDefaultDate: '',
            saveDefaultmiddle: '',
            saveDefaultstart: ''
        };
    },
    computed: {
        ...mapGetters(["loginInfo", "queryParamsInfo"]),
        buttonList() {
            return config.AUTHORITY_BUTTON[component_name].buttonList;
        }
    },
    methods: {
        ...mapActions(["Fn"]),
        getSalesMonthMarkNewSaleMoneyData,

        // 列表信息查询
        handleQueryInfo(params, isFn) {
            // 判断是否为功能参数
            if (isFn) {
                // 获取保存的查询参数
                this.queryData = JSON.parse(
                    this.queryParamsInfo["product_library_amount"]
                );
            }

            if (!validTime(this.queryData.dateStart, this.queryData.dateEnd)) {
                this.$message.warning("开始日期不能大于结束日期");
                return;
            }

            let obj = {
                date_start: this.queryData.dateStart,
                date_end: this.queryData.dateEnd,
                date_middle: this.queryData.dateMiddle,
                type: this.queryData.query_type,
                ...params
            };

            obj = Object.assign(params || {}, obj);

            getSalesMonthMarkNewSaleMoneyData(obj).then(({ data }) => {
                if (data.status === 2) return;
                if (data.status) {
                    this.handleQueryInfoCallBack(data);
                } else {
                    this.$message.error(data.errorMess || "查询失败");
                }
            });
        },

        // 查询重置
        handleResetQueryInfo() {
            this.queryData = {
                query_type: this.queryData.query_type,
                dateStart: this.saveDefaultstart,
                dateMiddle: this.saveDefaultmiddle,
                dateEnd: this.saveDefaultDate
            };
        },

        handleTabClick(tab) {
            this.queryData.query_type = tab.name;
            this.handleQueryInfo();
        },

        //操作回调
        handleOperationCallBack(data) {
            if (data.status) {
                this.$message.success("操作成功");
                this.handleQueryInfo();
            } else {
                this.$message.error(data.errorMess || "操作失败");
            }
        },

        //导出
        handleExportInfo() {
            this.handleQueryInfo(
                {
                    is_excel: 1
                },
                true
            );
        },

        // 查询回调
        handleQueryInfoCallBack(data) {
            // 保存查询参数
            this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
                key: "product_library_amount",
                value: JSON.stringify(this.queryData)
            });

            //渲染数据
            this.tableKey = Object.values(data.title);
            // this.tableProps = Object.keys(data.title);
            this.tableData.splice(0);
            this.$nextTick().then(() => {
                this.tableData = data.data;
            });
            this.tableMinWidth = this.tableProps.map(item => {
                if (item === "flag_name_all") return "200";
            });
        }
    },
    created() {
        this.thisVm = this;
        try {
            this.saveDefaultDate = getCountDate(0);
            this.queryData.dateEnd = this.saveDefaultDate;

            this.saveDefaultmiddle = getCountDate(-30);
            this.queryData.dateMiddle = this.saveDefaultmiddle;

            this.saveDefaultstart = getCountDate(-60);
            this.queryData.dateStart = this.saveDefaultstart;
            this.handleQueryInfo();
        } catch (e) {
            console.log(e);
        }
    }
};
</script>

<style scoped lang="less">
@color: #ff9900;

/deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
    margin-top: 0 !important;
}
/deep/.el-tabs--card > .el-tabs__header {
    border-bottom: 0 !important;
}
</style>
