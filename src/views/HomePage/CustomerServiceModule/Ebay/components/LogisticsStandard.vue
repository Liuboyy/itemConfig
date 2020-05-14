<template>
    <el-dialog class="ui-layout_edit-dialog"
               top="2vh"
               width="1000px"
               :title="title"
               :visible="visible"
               @close="handleCloseDialog">
        <div class="ui-dialog_area">
            <p>您 {{detailsData.review_start_date}} - {{detailsData.review_end_date}}  期间美国>$5交易全程跟踪物流的使用状态为
                <span v-if="detailsData.e_packet_status === '正常'" class="green">{{detailsData.e_packet_status}}</span>
                <span v-if="detailsData.e_packet_status === '超标'" class="red">{{detailsData.e_packet_status}}</span>
                <span v-if="detailsData.e_packet_status === '警告'" class="orange">{{detailsData.e_packet_status}}</span>
                <span v-if="detailsData.e_packet_status === '限制'" class="purple">{{detailsData.e_packet_status}}</span>
                <span v-if="detailsData.e_packet_status === '不考核'" class="blue">{{detailsData.e_packet_status}}</span>
                <span v-if="detailsData.e_packet_status === '无'">{{detailsData.e_packet_status}}</span>
            </p>
            <p>数据更新时间：{{detailsData.grefreshed_date}}</p>
            <p>>$5交易中使用ePacket+带有效追踪物流的比例 {{detailsData.adoption}}，标准是高于 {{detailsData.gstandard_value}}</p>
            <table border="1" cellspacing="0" cellpadding="0" class="ui-table">
                <tr>
                    <td>评估总交易数</td><td>{{detailsData.evaluated_tnx_cnt}}</td>
                    <td>使用全程跟踪物流且揽收扫描满足时效要求的比例</td><td>{{detailsData.evaluated_adoption}}</td>
                </tr>
                <tr>
                    <td>其中：跨境发货占</td><td>{{detailsData.cbt_tnx_cnt}}</td>
                    <td>使用ePacket+且揽收扫描满足时效要求的比例</td><td>{{detailsData.cbt_adoption}}</td>
                </tr>
                <tr>
                    <td>其中：海外仓发货占</td><td>{{detailsData.wh_tnx_cnt}}</td>
                    <td>使用带有效追踪物流且揽收扫描满足时效要求的比例</td><td>{{detailsData.wh_adoption}}</td>
                </tr>
            </table>
            <p>小于5美金及其他25个主要国家的物流使用合规状态为 {{detailsData.eds_status}} 标准是 {{detailsData.lstandard_value}}</p>
            <p>数据更新时间：{{detailsData.lrefreshed_date}}</p>
            <table border="1" cellspacing="0" cellpadding="0" class="ui-table">
                <tr>
                    <td>评估总交易数</td><td>{{detailsData.add_trans_cnt}}</td>
                    <td>物流使用合规比例</td><td>{{detailsData.eds_comply_rate}}</td>
                </tr>
                <tr>
                    <td>其中：买家选择使用标准型及以上物流占</td><td>{{detailsData.add_buyer_std_trans_cnt}}</td>
                    <td>使用全程追踪物流比例</td><td>{{detailsData.eds_std_comply_rate}}</td>
                </tr>
                <tr>
                    <td>其中：买家选择使用经济型物流占</td><td>{{detailsData.add_buyer_econ_trans_cnt}}</td>
                    <td>使用至少含揽收信息或全程跟踪物流比例</td><td>{{detailsData.eds_econ_comply_rate}}</td>
                </tr>
            </table>
            <p>SpeedPAK物流管理方案及物流选项使用状态为
                <span v-if="detailsData.account_status_spk1 === '正常'" class="green">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '超标'" class="red">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '警告'" class="orange">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '限制'" class="purple">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '不考核'" class="blue">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '无'">{{detailsData.e_packet_status}}</span>
            </p>
            <p>数据更新时间：{{detailsData.end_date_as_refresh}}</p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData1">
                    <el-table-column label="" prop="trans_type"></el-table-column>
                    <el-table-column label="评估总交易数" prop="trans_count"></el-table-column>
                    <el-table-column label="SpeedPAK+使用比例" prop="speedpak_rate">
                        <template slot-scope="scope">
                            <span class="green" v-if="scope.row.color == 0">{{scope.row.speedpak_rate}}</span>
                            <span class="red" v-if="scope.row.color == 1">{{scope.row.speedpak_rate}}</span>
                            <span v-if="scope.row.color == null">{{scope.row.speedpak_rate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最低要求" prop="min_requirement"></el-table-column>
                </el-table>
            </div>
            <p>对应时间：{{detailsData.start_date_spk1}} - {{detailsData.end_date_spk1}} 下次评估：{{detailsData.next_evaluation_date_spk1}} </p>
            <p>SpeedPAK物流管理方案及物流选项使用状态为
                <span v-if="detailsData.account_status_spk1 === '正常'" class="green">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '超标'" class="red">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '警告'" class="orange">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '限制'" class="purple">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '不考核'" class="blue">{{detailsData.account_status_spk1}}</span>
                <span v-if="detailsData.account_status_spk1 === '无'">{{detailsData.e_packet_status}}</span>,
                数据更新时间：{{detailsData.create_pst}}</p>
            <div class="ui-main-module-table">
                <el-table border :data="dialogData2">
                    <el-table-column label="" prop="spak_type"></el-table-column>
                    <el-table-column label="评估总交易数" prop="trans_count"></el-table-column>
                    <el-table-column label="合规率" prop="satisfy_rate">
                        <template slot-scope="scope">
                            <span class="green" v-if="scope.row.color == 0">{{scope.row.satisfy_rate}}</span>
                            <span class="red" v-if="scope.row.color == 1">{{scope.row.satisfy_rate}}</span>
                            <span v-if="scope.row.color == null">{{scope.row.satisfy_rate}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column label="最低要求" prop="min_requirement"></el-table-column>
                </el-table>
            </div>
            <p>另外，您还有 {{detailsData.speedpak_trans}} 笔交易已经使用SpeedPAK服务，但并未设置SpeedPAK物流选项，请做相应修改 </p>
            <p>对应时间：{{detailsData.start_date_spk2}} - {{detailsData.end_date_spk2}}  下次评估：{{detailsData.next_evaluation_date_spk2}} </p>
        </div>
    </el-dialog>
</template>
<script>

    export default{
        name: 'LogisticsStandard',
        props: {
            visible: {
                type: Boolean,
                default: false
            },
            title: {
                type: String,
                default: ''
            },
            dialogData1: {
                type: Array,
                default () {
                    return [];
                }
            },
            dialogData2: {
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
            },
            types: {
                type: String,
                default: ''
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
                padding: 5px;
                font-size: @fontSize;
            }
            td:nth-child(2n-1) {
                width: 400px;
            }
            td:nth-child(2n) {
                width: 80px;
            }
        }
    }
</style>