<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                   <li>
                        <SearchRequirement label="日期" v-model="queryData.date" template="daterange" :isOption="false" >
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn  :resetFn="handleResetQueryInfo" :queryFn="handleQueryInfo" refTable="tableArea"
                            :params="{limit: pageData.currentList}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        
        </div>
        <FVCountperDiem ref="tableArea" :tableData="tableData" :showSearch="showSearch" :otherHeight="['el-tabs__header']" :tableKey="tableKey"></FVCountperDiem>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        getThirtyDayDateRange
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";

    import {
        getstatisticsIfon,
    } from '@/api/sales_module/f_virtual_stock_statistics'

    // import {
    //    getThirtyDayDateRange
    // } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    import FVCountperDiem from '../components/FVCountperDiem'
    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'f_virtual_stock_statistics';

    export default {
        name: component_name,
        components: { FVCountperDiem },
        data() {
            return {
                pickerOptions: '',
                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                tableHeight:'100px',
                tableData:[],
                tableKey: [],

                queryData: {
                    date: [],
                    query_type: '1'
                },

                optionList: {
                    dateTypeList: [],
                    orderStatusList: [],
                    salesPersonList:[]
                },

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                // 日期初始化时间
                saveDefaultTime: [], 

                saveDefaultDate: '',
                saveCheckInfo: [],
                saveData: {
                    row: {},
                    code: '',
                    page: {}
                },
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
            getDefaultTime,
            getstatisticsIfon,
        
            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['f_virtual_stock_statistics']);
                }
        
                let obj = {
                  date_start: this.queryData.date[0],
                  date_end: this.queryData.date[1]
                };

                obj = Object.assign(params || {}, obj);

                this.getstatisticsIfon(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.date = this.saveDefaultTime;
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo();
            },
            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    if(this.isModifyShow) this.isModifyShow = false;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败');
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel:1
                 }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'f_virtual_stock_statistics',
                    value: JSON.stringify(this.queryData)
                });

               //渲染数据
                this.tableKey = data.title;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
            }
        },
        created() {
            this.thisVm = this;
            try {
                this.queryData.date = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.saveDefaultTime = getThirtyDayDateRange(new Date(new Date().getTime()));
                this.handleQueryInfo();
            }catch(e){
                console.log(e)
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
