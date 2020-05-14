<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <el-form :model="targetObj" ref="targetObj" :rules="targetRules" size="small" class="ui-edit_layout_big">
                        <el-form-item label="本月业绩目标" prop="target" label-width="100px">
                            <el-input placeholder="请输入" v-model="targetObj.target" :disabled="isDisabled"></el-input>
                        </el-form-item>
                        <el-form-item label="小组名称" label-width="80px">
                            <el-select :disabled="isDisabled" size="small" v-model="targetObj.groupName" filterable v-filter>
                                <el-option
                                        v-for="item in optionList.groupNameList"
                                        :key="item.group_id"
                                        :value="item.group_id"
                                        :label="item.group_name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="10px">
                            <el-button type="primary" round @click="handleConfirmTarget" :disabled="isDisabled">提交</el-button>
                        </el-form-item>
                    </el-form>
                </ul>
                <div class="ui-tip_area">
                    <i class="icon-tishi1"></i><span>说明：录入入口只在每月1-3号开放，过期就会关闭入口，冻结数据</span>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <label>往期目标</label>
            <div>
                <label>年份</label>
                <el-date-picker
                        @change="handleChangeYear"
                        type="year"
                        size="small"
                        v-model="targetObj.year"
                        placeholder="选择年"
                        :clearable="false"
                        format="yyyy"
                        value-format="yyyy"
                        :picker-options="pickerOptions">
                </el-date-picker>
            </div>
        </div>
        <ComTableInfo
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch">
        </ComTableInfo>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getCurrentYear,
        getCurrentDateRange,
        getCurrentMonth
    } from '../../../../api/common/date_format'

    import {
        getTargetGroupList,
        getTargetEntryInfo,
        getConfirmTargetInfo
    } from '../../../../api/am_order_count/target_complete'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                targetObj: {
                    target: '',
                    groupName: '',
                    year: ''
                },
                targetRules: {
                    target: [
                        {
                            required: true,
                            message: '带*号不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                optionList: {
                    groupNameList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                saveDefaultYear: '',
                saveDefaultMonth: '',

                //判断是否每月1-3号
                isDisabled: true,

                //限制2018年之前的时间查询
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() < new Date('2018-01-01').getTime()
                    },
                }

            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'targetEntryInfo',
                'loginInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetTargetEntryInfo',
            ]),
            getCurrentYear,
            getCurrentMonth,
            getCurrentDateRange,
            getTargetGroupList,
            getTargetEntryInfo,
            getConfirmTargetInfo,


            // 查询
            handleQueryInfo(params) {

                let obj = {
                    year: this.targetObj.year || params,
                    user_number: this.loginInfo.staff_code,
                };

                this.GetTargetEntryInfo(obj).then(({ data}) => {
                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
                }).catch(err => {
                    console.log(err);
                })
            },

            //切换年份
            handleChangeYear(val) {
                this.handleQueryInfo(val)
            },

            //提交
            handleConfirmTarget() {

                if(!this.targetObj.groupName || !this.targetObj.target) {
                    this.$message.warning('请输入目标值和选择小组再提交！');
                    return;
                }

                let obj = {
                    id: this.targetObj.groupName,
                    type: JSON.stringify(['1']),
                    month: JSON.stringify([this.saveDefaultMonth]),
                    money: JSON.stringify([this.targetObj.target]),
                    update_user: JSON.stringify([this.loginInfo.staff_code, this.loginInfo.user_name]),
                };

                this.getConfirmTargetInfo(obj).then(({ data }) => {
                    this.targetObj.target = '';
                    this.targetObj.groupName = '';
                    this.handleOperationCallBack(data);
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo();
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },

            // 分页
            handleSizeChange(size) {
                this.handleQueryInfo({
                    limit: size,
                    offset: 1
                }, true);
            },
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'target_entry',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableData = data.data.value;
                this.tableKey = Object.values(data.data.title);
                let prop = Object.keys(data.data.title);
                prop.splice(0,1);
                this.tableProps = ['group_name',...prop];
            }
        },
        created(){
            this.thisVm = this;
            this.getCurrentDateRange().then((data) => {
                const currentDay = data.end.substring(data.end.indexOf('-') + 4);
                if(currentDay >= 1 && currentDay <= 3) {
                    this.isDisabled = false;
                }else {
                    this.isDisabled = true;
                }
            });
            try{
                this.getCurrentYear().then((data) => {
                    this.saveDefaultYear = data.year;
                    this.getCurrentMonth().then((data) => {
                        this.saveDefaultMonth = data.month;
                        this.targetObj.year = this.saveDefaultYear;
                        this.handleQueryInfo(this.targetObj.year);
                    })
                });
                this.getTargetGroupList({
                    user_number: this.loginInfo.staff_code
                }).then(({ data }) => {
                    this.optionList.groupNameList = data.data.value;
                })
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

    @textColor: #333333;


    /deep/.ui-search-area {

        border: none!important;

        .el-button--small, .el-button--small.is-round {
            padding: 8px 18px;
        }
        .el-form-item__label {
            font-size: 12px;
            color: @textColor;
        }

        .ui-tip_area {
            text-align: left;
            margin-left: 35px;
            background: #fffdf9;
            border: 1px #ffdda8 solid;
            border-radius: 4px;
            width: 555px;
            padding: 10px;

            span {
                font-size: 12px;
                color: @textColor;
            }
            .icon-tishi1 {
                color: #f2ae3e;
                font-size: 20px;
            }
        }
    }

    .ui-fn-module {
        background: #FFFFFF;
        font-size: 12px;
        color: @textColor;
        padding: 40px 0 10px 10px;
        margin: 0!important;

        & > label {
            float: left;
            color: @textColor;
            font-weight: bold;
            width: 80px;
        }
        & > div label {
            width: 30px;
            display: inline-block
        }
    }

</style>
