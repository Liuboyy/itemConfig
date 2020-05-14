<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="平台">
                            <el-popover
                                    ref="popover"
                                    width="400"
                                    placement="bottom-start"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.query">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">全选</el-checkbox>
                                        <el-checkbox-group v-model="checkedPlatform" @change="handleCheckedPlatformChange">
                                            <el-checkbox v-for="item in optionList.platformList" :label="item.platform_code" :key="item.platform_code">
                                                {{item.platform_name}}</el-checkbox>
                                        </el-checkbox-group>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="handleCloseCheckInfo">关闭</el-button>
                                        <el-button type="text" @click="handleConfirmCheckInfo">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.platform"
                                      @focus="handleFocusPopover"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="SKU">
                            <el-input size="small" v-model="queryData.sku" placeholder="请输入"></el-input>
                        </SearchRequirement>
                    </li>
                    <li class="ui-checkbox">
                        <SearchRequirement label="" width="0">
                            <el-checkbox v-model="queryData.checked">模糊查询</el-checkbox>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun" >查询</el-button>
                </div>
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
        <ComTableInfo
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :tableSort="tableSort"
                :defaultSort="queryData.sortOrder"
                :otherHeight="['el-tabs__header']"
                @handleSort="handleSortChange">
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
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getCoreDomesticSkuWeekInfo,
        getPlatformList
    } from '@/api/product_module/domestic_sku_week_count';

    const component_name = 'domestic_sku_week_count';

    export default {
        name: component_name,

        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    platform: '',
                    sku: '',
                    checked: false,
                    sortOrder: {
                        prop: 'sku_score',
                        order: 'descending'
                    },
                    sort: 2
                },
                optionList: {
                    platformList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],
                tableSort: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                popover: {
                    query: false
                },
                isIndeterminate: true,
                checkAll: false,
                checkedPlatform: [],
                savePlatform: [],
            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'domesticCoreSkuWeekReportInfo'
            ])
        },
        methods: {
            ...mapActions([
                'GetCoreDomesticSkuWeekInfo'
            ]),
            autoAddTableInx,
            getCoreDomesticSkuWeekInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['core_domestic_sku_report']);
                }

                let obj = {
                    user_number: this.loginInfo.staff_code,
                    platform_code: this.queryData.platform,
                    sku: this.queryData.sku,
                    sort: this.queryData.sort,
                    vague_select: this.queryData.checked ? 1 : 0,
                };

                obj = Object.assign(params || {}, obj);

                this.GetCoreDomesticSkuWeekInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.platform = '';
                this.queryData.sku = '';
                this.queryData.checked = false;
                this.checkedPlatform = [];
            },

            // 排序
            handleSortChange(data) {
                this.queryData.sortOrder = {
                    prop: data.prop,
                    order: data.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'core_domestic_sku_report',
                    value: JSON.stringify(this.queryData)
                });
                if (data.prop === "sku_score") {
                    this.queryData.sort = data.order === 'ascending' ? 1 : 2;
                }
                if (data.prop === "available_stock") {
                    this.queryData.sort = data.order === 'ascending' ? 3 : 4;
                }
                if (data.prop === "on_way_stock") {
                    this.queryData.sort = data.order === 'ascending' ? 5 : 6;
                }
                if (data.prop === "sale_days") {
                    this.queryData.sort = data.order === 'ascending' ? 7 : 8;
                }
                this.handleQueryInfo();
            },

            //点击弹框
            handleFocusPopover() {
                this.popover.query = true;
                this.isIndeterminate = this.checkedPlatform.length > 0 && this.checkedPlatform.length < this.optionList.platformList.length;
                this.checkAll = this.checkedPlatform.length === this.optionList.platformList.length;
                this.checkedPlatform = this.savePlatform;
            },
            //全选
            handleCheckAllChange(val) {
                let arr = [];
                this.optionList.platformList.forEach(item => {
                    arr.push(item.platform_code);
                });
                this.checkedPlatform = val ? arr: [];
                this.isIndeterminate = false;
            },

            //单选
            handleCheckedPlatformChange(val) {
                let arr = [];
                this.optionList.platformList.forEach(item => {
                    arr.push(item.platform_code);
                });
                this.checkAll = val.length === arr.length;
                this.isIndeterminate = val.length > 0 && val.length < arr.length;
            },
            //确定选中平台类型
            handleConfirmCheckInfo() {
                this.queryData.platform = this.checkedPlatform.join(',');
                this.popover.query = false;
            },
            //取消
            handleCloseCheckInfo() {
                this.isIndeterminate = true;
                this.checkAll = false;
                this.popover.query = false;
                this.checkedPlatform = this.savePlatform;
            },

            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(event);
                }
                this.popover.query = false;
            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'core_domestic_sku_report',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.title];
                this.tableData = data.data;
                this.tableProps = ['index','platform_name','sku','sku_score','available_stock','on_way_stock','sale_days','develop_name','buyer_name'];
                this.tableSort = [false,false,false,'custom','custom','custom','custom',false,false];

                this.savePlatform = this.checkedPlatform;

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }

        },
        created() {
            this.thisVm = this;
            getPlatformList().then(({ data }) => {
                this.optionList.platformList = data.data;
            });
            try {
                if (JSON.stringify(this.domesticCoreSkuWeekReportInfo) === '{}') {
                    this.handleQueryInfo();
                } else {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['core_domestic_sku_report']);
                    this.defaultSort = this.queryData.sortOrder;
                    this.handleQueryInfoCallBack(this.domesticCoreSkuWeekReportInfo);
                }
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        }
    }
</script>

<style scoped lang="less">

    /deep/.ui-checkbox .ui-search_require {
        width: 100px!important;
    }

    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
            padding-bottom: 5px;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    .el-checkbox + .el-checkbox {
        margin-left: 0!important;
    }
    .el-checkbox {
        width: 100px;
        margin-right: 20px;
        margin-bottom: 2px;
    }
</style>
