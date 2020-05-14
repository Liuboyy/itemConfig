<template>
    <TemplateDefault color="#fff" :staticNum="90" class="ui-config__wrap">
        <el-form class="clearFix">
            <h5>| 出库金额系数配置</h5>
            <el-form-item label="收入折扣" labelWidth="80px" prop="discount">
                <el-input size="small" placeholder="请输入" v-model="configObj.discount"></el-input>
            </el-form-item>
            <el-form-item label="成本占比" labelWidth="140px" prop="rate">
                <el-input size="small" placeholder="请输入" v-model="configObj.rate"></el-input>
            </el-form-item>
            <el-form-item labelWidth="60px">
                <el-button size="small" type="primary" @click="handleSubmitInfo('ratio')">保存</el-button>
            </el-form-item>
        </el-form>
        <el-form class="clearFix ui-config_form">
            <h5>| 月底库存金额调整配置</h5>
            <el-form-item label="日期" labelWidth="80px" prop="date">
                <el-date-picker
                        clearable
                        type="date"
                        size="small"
                        v-model="configObj.date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd">
                </el-date-picker>
            </el-form-item>
            <el-form-item label="调整后的结存金额" labelWidth="140px" prop="money">
                <el-input size="small" placeholder="请输入" v-model="configObj.money"></el-input>
            </el-form-item>
            <el-form-item labelWidth="60px">
                <el-button size="small" type="primary" @click="handleSubmitInfo('money')">保存</el-button>
            </el-form-item>
        </el-form>
        <ComPreviewTable :tableKey="tableKey" :tableProps="tableProps" :tableData="tableData" tableHeight="560px"></ComPreviewTable>
    </TemplateDefault>
</template>
<script>
    import {
        getRatioConfigInfo,
        upDateRatioConfigInfo,
        getAdjustMoneyConfigInfo,
        upDateAdjustMoneyConfigInfo
    } from '../../../../api/warehouse_module/financial_inventory_monitoring'
    export default{
        data(){
            return {

                tableKey: ['日期', '调整后的结存金额'],
                tableProps: [],
                tableData: [],

                configObj: {
                    discount: '',
                    rate: '',
                    date: '',
                    money: '',
                },
            }
        },
        computed: {},
        methods: {

            //获取数据
            handleQueryInfo() {

                //出库金额系数配置
                getRatioConfigInfo().then(({ data }) => {
                    if (data.status) {
                        this.configObj.discount = data.data.income_discount_ratio;
                        this.configObj.rate = data.data.cost_ratio;
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                });

                //月底库存金额调整配置
                getAdjustMoneyConfigInfo().then(({ data }) => {
                    if (data.status) {
                        this.tableData = data.data;
                        this.tableProps = ['riqi_date', 'remain_amt'];
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                })

            },

            //保存
            handleSubmitInfo(type) {
                if (type === 'ratio') {

                    let reg = /^\d+(\.\d+)?$/;

                    if (!this.configObj.discount || !this.configObj.rate) {
                        this.$message.warning('请填写完整数据！');
                        return;
                    }
                    if(this.configObj.discount) {
                        if(!reg.test(this.configObj.discount)) {
                            this.$message.warning('请输入数字！');
                            return;
                        }
                    }
                    if(this.configObj.rate) {
                        if(!reg.test(this.configObj.rate)) {
                            this.$message.warning('请输入数字！');
                            return;
                        }
                    }
                    upDateRatioConfigInfo({
                        discount: this.configObj.discount,
                        rate: this.configObj.rate,
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }else {
                    let reg = /^\d+(\.\d+)?$/;

                    if (!this.configObj.date || !this.configObj.money) {
                        this.$message.warning('请填写完整数据！');
                        return;
                    }
                    if(this.configObj.money) {
                        if(!reg.test(this.configObj.money)) {
                            this.$message.warning('请输入数字！');
                            return;
                        }
                    }
                    upDateAdjustMoneyConfigInfo({
                        date: this.configObj.date,
                        money: this.configObj.money
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }
            },

            //操作回调
            handleOperationCallBack(data) {
                if (data.status) {
                    this.$message.success('操作成功');
                    this.configObj.date = '';
                    this.configObj.money = '';
                    this.handleQueryInfo();
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },
        },

        created() {
            this.handleQueryInfo();

        }
    }
</script>
<style scoped lang="less">
    .ui-config__wrap {
        text-align: left;
        padding: 40px;

        h5 {
            margin-bottom: 10px;
        }

        .el-form-item {
            float: left;
        }

        .el-input {
            width: 240px;
        }

        /deep/.el-form-item__label {
            font-size: 12px;
            color: #333333;
        }

        .ui-config_form {
            border-top: 1px dashed #e6e6e6;
            padding-top: 20px;
        }
    }

</style>