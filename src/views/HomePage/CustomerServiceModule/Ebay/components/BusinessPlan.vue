<template>
    <el-dialog class="ui-layout_edit-dialog"
               top="5vh"
               width="800px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <p>数据更新时间： {{detailsData.refreshed_date}} 期间的商业追踪计划表现状态为
                <span v-if="detailsData.pgc_status === '正常'" class="green">{{detailsData.pgc_status}}</span>
                <span v-if="detailsData.pgc_status === '警告'" class="orange">{{detailsData.pgc_status}}</span>
                <span v-if="detailsData.pgc_status === '限制'" class="purple">{{detailsData.pgc_status}}</span>
                <span v-if="detailsData.pgc_status === '无'">{{detailsData.pgc_status}}</span>
            </p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData">
                    <el-table-column label="按照您提交的商业计划，我们做了以下审核" prop="metric_name"></el-table-column>
                    <el-table-column label="标准值" prop="standard_value"></el-table-column>
                    <el-table-column label="状态(O是达标，X就是不达标)" prop="status">
                        <template slot-scope="scope">
                            <i class="icon-dabiao" v-if="scope.row.status === '达标'"></i>
                            <i class="icon-budabiao" v-if="scope.row.status === '不达标'"></i>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <table border="1" cellspacing="0" cellpadding="0" class="ui-table">
                <tr>
                    <td>主要销售国家</td><td>{{detailsData.primary_corridor}}</td>
                </tr>
                <tr>
                    <td>次要销售国家</td><td>{{detailsData.secondary_corridor}}</td>
                </tr>
                <tr>
                    <td>主要产品所属一级分类</td><td>{{detailsData.primary_vertical}}</td>
                </tr>
                <tr>
                    <td>主要产品所属二级分类</td><td>{{detailsData.primary_category}}</td>
                </tr>
                <tr>
                    <td>次要产品所属一级分类</td><td>{{detailsData.secondary_vertical}}</td>
                </tr>
                <tr>
                    <td>次要产品所属二级分类</td><td>{{detailsData.secondary_category}}</td>
                </tr>
                <tr>
                    <td>申请账户主营产品预估平均单价(美金)</td><td>{{detailsData.estimated_item_asp_usd}}</td>
                </tr>
                <tr>
                    <td>仓储所在地</td><td>{{detailsData.location_of_warehouse}}</td>
                </tr>
                <tr>
                    <td>海外仓存货销量占比</td><td>{{detailsData.warehouse_adoption_rate}}</td>
                </tr>
            </table>
        </div>
    </el-dialog>
</template>
<script>

    export default{
        name: 'BusinessPlan',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            dialogData: {
                type: Array,
                default () {
                    return [];
                }
            },
            detailsData: {
                type: Object,
                default () {
                    return {};
                }
            }

        },
        data(){
            return {}
        },
        computed: {},
        methods: {
            //取消
            handleCloseDialog() {
                this.$emit('update:visible', false);
            },
        },
        created() {

        }
    }
</script>
<style scoped lang="less">

    @borderColor: #e6e6e6;
    @textColor: #333333;
    @marginBottom: 6px;
    @fontSize: 12px;

    .ui-dialog_area {
        p {
            color: @textColor;
            margin-bottom: @marginBottom;
            font-size: @fontSize;
        }

        .ui-main-module-table {
            margin-bottom: @marginBottom;
        }

        .ui-table {
            border-top: 1px @borderColor solid;
            border-left: 1px @borderColor solid;
            margin-bottom: @marginBottom;
            td {
                border-right: 1px @borderColor solid;
                border-bottom: 1px @borderColor solid;
                padding: 8px;
                font-size: @fontSize;
            }
            td:nth-child(2n-1) {
                width: 400px;
            }
            td:nth-child(2n) {
                width: 400px;
            }
        }

        .icon-dabiao {
            font-size: 12px;
            color: #8dc644;
        }

        .icon-budabiao {
            font-size: 12px;
            color: #fe3434;
        }

    }
</style>