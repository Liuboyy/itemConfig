<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <el-form :model="targetObj" ref="targetObj" :rules="targetRules" size="small" class="ui-edit_layout_big">
                        <el-form-item label="本月业绩目标" prop="target" label-width="100px">
                            <el-input placeholder="请输入" v-model="targetObj.target"></el-input>
                        </el-form-item>
                        <el-form-item label="平台" label-width="80px" prop="platform">
                            <el-select size="small" v-model="targetObj.platform" filterable v-filter>
                                <el-option
                                        v-for="(label, value) in optionList.platformList"
                                        :key="value"
                                        :value="value"
                                        :label="value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="账号" label-width="80px" prop="account">
                            <el-select size="small" v-model="targetObj.account" filterable v-filter clearable>
                                <el-option
                                        v-for="item in optionList.accountList"
                                        :key="item.org_account"
                                        :value="item.org_account"
                                        :label="item.account_name"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label-width="10px">
                            <el-button type="primary" round @click="handleConfirmTarget">提交</el-button>
                            <!--:disabled="isDisabled"-->
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
                        type="year"
                        size="small"
                        v-model="targetObj.year"
                        placeholder="选择年"
                        :clearable="false"
                        format="yyyy"
                        value-format="yyyy"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <span style="display: inline-block; width: 50px"></span>
                <label>平台</label>
                <el-select size="small" v-model="targetObj.queryPlatform" filterable v-filter>
                    <el-option
                            v-for="(label, value) in optionList.platformList"
                            :key="value"
                            :value="value"
                            :label="value"></el-option>
                </el-select>
            </div>
        </div>
        <ComTableInfo
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="['60']"
                :showSearch="showSearch">
        </ComTableInfo>
        <div class="ui-main-module-page">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageData.currentPage"
                    :page-sizes="pageSizes"
                    size="small"
                    :page-size="pageData.currentList"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageData.currentTotal">
            </el-pagination>
        </div>
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
    } from '@/api/common/date_format'

    import {
        getPlatformList,
        getAccountAndGroupList,
        getTargetEntryInfo,
        getConfirmTargetInfo
    } from '@/api/sales_module/south_ease_target'

    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                targetObj: {
                    target: '',
                    platform: '',
                    account: '',
                    year: '',
                    queryPlatform: 'SHOPEE',
                },
                targetRules: {
                    target: [
                        {
                            required: true,
                            message: '带*号不能为空',
                            trigger: 'blur'
                        }
                    ],
                    platform: [
                        {
                            required: true,
                            message: '带*号不能为空',
                            trigger: 'blur'
                        }
                    ],
                    account: [
                        {
                            required: true,
                            message: '带*号不能为空',
                            trigger: 'blur'
                        }
                    ]
                },
                optionList: {
                    platformList: [],
                    accountList: []
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

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
                'loginInfo'
            ]),
        },
        methods: {
            ...mapActions([]),
            getTargetEntryInfo,


            // 查询
            handleQueryInfo(params, isFn) {


                let obj = {
                    platform: this.targetObj.queryPlatform,
                    year: this.targetObj.year,
                    ...params
                };

                this.getTargetEntryInfo(obj).then(({ data}) => {
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

            //提交
            handleConfirmTarget() {

                if(!this.targetObj.account || !this.targetObj.target) {
                    this.$message.warning('请输入目标值和选择账号再提交！');
                    return;
                }

                let obj = {
                    platform_code: this.targetObj.platform,
                    account_id: this.targetObj.account,
                    money: this.targetObj.target,
                    update_user: this.loginInfo.staff_code,
                    update_name: this.loginInfo.user_name
                };
                getConfirmTargetInfo(obj).then(({ data }) => {
                    this.handleOperationCallBack(data);
                })
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.$refs['targetObj'].clearValidate();
                    this.targetObj.target = '';
                    this.targetObj.platform = '';
                    this.targetObj.account = '';
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
                this.tableKey = ['序号', ...data.data.title];
                this.tableProps = ['index', 'account_name', ...data.data.title.slice(1)];
                this.tableData = data.data.value;

                 this.pageData.currentTotal = data.data.page_data.total * 1 ;
                 this.pageData.currentList = data.data.page_data.limit * 1 ;
                 this.pageData.currentPage = data.data.page_data.offset * 1 ;

            }
        },
        created(){
            this.thisVm = this;
            try{
                getPlatformList().then(({ data }) => {
                    this.optionList.platformList = data.data;
                });
                getCurrentDateRange().then((data) => {
                    const currentDay = data.end.substring(data.end.indexOf('-') + 4);
                    if (currentDay >= 1 && currentDay <= 3) {
                        this.isDisabled = false;
                    } else {
                        this.isDisabled = true;
                    }
                });
                getCurrentYear().then((data) => {
                    this.saveDefaultYear = data.year;
                    getCurrentMonth().then((data) => {
                        this.saveDefaultMonth = data.month;
                        this.targetObj.year = this.saveDefaultYear;
                        this.handleQueryInfo();
                    })
                });
            }catch (e) {
                console.log(e);
            }
        },
        watch: {
            'targetObj.platform'(val) {
                if (val) {
                    getAccountAndGroupList({ platform: val }).then(({ data }) => {
                        this.optionList.accountList = data.account_data;
                    })
                }
            },
            'targetObj.year'(val) {
                if (val) {
                    this.handleQueryInfo();
                }
            },
            'targetObj.queryPlatform'(val) {
                if (val) {
                    this.handleQueryInfo();
                }
            }
        }
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
