<template>
    <el-dialog class="ui-layout_edit-dialog"
               width="800px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <p>您 {{detailsData.reviewstardate}} 至 {{detailsData.reviewenddate}} 期间综合表现为
                <span v-if="detailsData.actionstatus === '正常'" class="green">{{detailsData.actionstatus}}</span>
                <span v-if="detailsData.actionstatus === '超标'" class="red">{{detailsData.actionstatus}}</span>
                <span v-if="detailsData.actionstatus === '警告'" class="orange">{{detailsData.actionstatus}}</span>
                <span v-if="detailsData.actionstatus === '限制'" class="purple">{{detailsData.actionstatus}}</span>
                <span v-if="detailsData.actionstatus === '无'">{{detailsData.actionstatus}}</span>
            </p>
            <p>数据更新时间：{{detailsData.createpst}}</p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData">
                    <el-table-column label="" prop="warehouse_name"></el-table-column>
                    <el-table-column label="合规刊登率">
                        <el-table-column label="标准值" prop="correctlistratesd"></el-table-column>
                        <el-table-column label="当前值" prop="correctlistrate"></el-table-column>
                    </el-table-column>
                    <el-table-column label="及时发货率">
                        <el-table-column label="标准值" prop="ascanhtratesd"></el-table-column>
                        <el-table-column label="当前值" prop="ascanhtrate"></el-table-column>
                    </el-table-column>
                    <el-table-column label="物品及时送达率">
                        <el-table-column label="标准值" prop="dscaneddratesd"></el-table-column>
                        <el-table-column label="当前值" prop="dscaneddrate"></el-table-column>
                    </el-table-column>
                    <el-table-column label="物流不良交易率">
                        <el-table-column label="标准值" prop="shipdefectratesd"></el-table-column>
                        <el-table-column label="当前值" prop="shipdefectrate"></el-table-column>
                    </el-table-column>
                </el-table>
            </div>
            <p>对应时间：{{detailsData.cor_reviewstardate + ' - ' +  detailsData.cor_reviewenddate}}
                下次评估：{{detailsData.nextevaluationdate}} </p>
        </div>
    </el-dialog>
</template>
<script>

    export default{
        name: 'OverseaStandard',
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

    }
</style>