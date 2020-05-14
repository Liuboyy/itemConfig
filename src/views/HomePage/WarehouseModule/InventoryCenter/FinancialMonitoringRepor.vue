<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                     <li>
                        <SearchRequirement label="日期">
                            <el-date-picker
                                    size="small"
                                    v-model="queryData.businessDate"
                                    type="daterange"
                                    :editable="false"
                                    :clearable="false"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
                            :params="{}"></FilterBtn>
            </div>
        </transition>
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch">
        </ComTableInfo>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";

    import {
        // getSmallPlatformSalesInfo,
        // getDropDownList
    } from '@/api/sales_module/small_platform_sales'

    import {
       getFirstToCurrentMonthRange
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'small_platform_sales';

    export default {
        name: component_name,
        data() {
            return {
                pickerOptions: '',
                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    businessDate: []
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],


                saveDefaultDate: [],
                saveCheckInfo: [],


                //提示语
                isPercentageShow: false,

                //默认时间
                saveDefaultMonth: [],
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            uploadUrl() {
                return importApi['IMPORT_PLATFORM_COST_INFO'];
            },
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            // getSmallPlatformSalesInfo,
        


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['small_platform_sales']);
                }
        

                let obj = {

                };

                obj = Object.assign(params || {}, obj);

                // this.getSmallPlatformSalesInfo(obj).then(({ data }) => {
                //     if (data.status === 2) return;
                //     if (data.status) {
                //         this.handleQueryInfoCallBack(data);
                //     }else {
                //         this.$message.error(data.errorMess || '查询失败')
                //     }
                // })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData = {
                    paymentTime: this.saveDefaultMonth
                };
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo();
                }else {
                    this.$message.error(data.errorMess || '操作失败');
                }
            },


            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'small_platform_sales',
                    value: JSON.stringify(this.queryData)
                });

                // //渲染数据
                // this.tableKey = ['销售员', '账号', ...Object.values(data.title)];
                // this.tableProps = ['user_name','account_name', ...data.title];
                // this.queryData.data_type === '1' ? this.$set(this.tableKey, 2, '销售额（单位:EUR）') : this.$set(this.tableKey, 2, '订单数');
                // this.tableData.splice(0);
                // this.$nextTick().then(() => {
                //     let dataList = [];
                //     data.data.forEach(item => {
                //         item.forEach(_item => {
                //             dataList.push(_item)
                //         })
                //     });
                //     this.tableData = dataList;
                // });
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'total'|| item === 'account_name') return '130';
                    return '90';
                })
            }
        },
        created() {
            this.thisVm = this;
            try{
                getFirstToCurrentMonthRange().then(( data ) => {
                    // this.saveDefaultDay = [data.end];
                    this.saveDefaultMonth = [data.start, data.end]
                    this.queryData.businessDate = this.saveDefaultMonth
                    this.handleQueryInfo();
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

    @color: #ff9900;

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0;
    }

    .text-color {
        color:  @color;
    }

    .ui-layout_edit-dialog {
        .ui-check_box {
            .el-checkbox+.el-checkbox {
                margin-left: 0;
            }
            .el-checkbox {
                width: 200px;
                margin: 5px 30px 5px 0;
            }
            .el-checkbox__label {
                font-size: 12px;
            }
        }
    }

    /deep/ .ui-fn-module {
        margin: 0 15px 0 0;
        .el-button--small {
            padding-top: 15px;
        }

        .el-progress-bar__outer {
            background: #ffffff;
        }
        .el-progress-bar {
            width: 15%;
            float: right;
            margin-top: 10px;
        }

        .el-alert {
            float: right;
            height: 34px;
            line-height: 34px;
            width: 15%;
            margin-top: 1px;
        }
        .el-alert__title {
            color: #333333;
            font-weight: bold;
            font-size: 12px;
        }
        .el-alert--warning.is-light {
            background-color: #fffdf9;

            box-sizing: border-box;
        }

        .ui-tip_box {
            display: inline-block;
            width: 200px;
            height: 34px;
            line-height: 34px;
            float: right;
            font-size: 12px;
            font-weight: bold;
            background: #fffdf9;
            border: 1px solid #ffdda8;
            border-radius: 4px;
            padding-left: 5px;
            .icon-tishi1 {
                color: #f2ae3e;
                font-size: 16px;
            }
        }
    }


</style>
