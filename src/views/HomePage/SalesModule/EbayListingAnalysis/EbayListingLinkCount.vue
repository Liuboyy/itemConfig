<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    size="small"
                                    type="date"
                                    v-model="queryData.countTime"
                                    placeholder="选择日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    :clearable="false">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="组织" >
                            <el-popover
                                    ref="popover"
                                    width="400"
                                    placement="bottom-start"
                                    trigger="manual"
                                    v-model="popover.organization"
                                    :visible-arrow="false"
                                    @show="handleInTreeData">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input size="small" placeholder="输入关键字进行搜索" v-model="organizationFilter"></el-input>
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="id"
                                                show-checkbox
                                                :data="optionList.organizationList"
                                                :props="defaultProps"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :filter-node-method="organizationFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.organization = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.organizationName"
                                      @focus="popover.organization = true"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="大仓" >
                            <el-select size="small" v-model="queryData.bigWarehouse" filterable v-filter collapseTags multiple>
                                <el-option
                                        v-for="item in optionList.bigWarehouseList"
                                        :key="item.id"
                                        :value="item.id"
                                        :label="item.name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="仓库" >
                            <el-select size="small" v-model="queryData.warehouse" filterable v-filter collapseTags multiple>
                                <el-option
                                        v-for="item in optionList.warehouseList"
                                        :key="item.d_id"
                                        :value="item.d_id"
                                        :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleToggleTree" :reset-fn="handleResetQueryInfo"
                           :params="{type: 'all'}" ></FilterBtn>
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

        <ComTreeTable :tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :showSearch="showSearch"
                      :treeNode="{title: '组织', field: 'org_name', width: '400px'}"
                      @toggleTree="(v) => { handleToggleTree(v, 'click') }">
            <template slot="listing_sum_total" slot-scope="scope">
                <span class="ui-link" @click="handleDetailsInfo(scope.row)"
                      v-if="scope.row.listing_sum_total > 0 && buttonList['details'].permit()">{{scope.row.listing_sum_total}}</span>
                <span v-else>{{scope.row.listing_sum_total}}</span>
            </template>
        </ComTreeTable>

        <ComDialogPreview
                isPage
                isButton
                :visible.sync="isDetailShow"
                :tableKey="dialogKey"
                :tableProps="dialogProps"
                :tableData="dialogData"
                :tableWidth="dialogWidth"
                :dialogPageData="dialogPageData"
                @dialogPageChange="handleDialogPageChange"
                @export="handleDialogExportInfo" ></ComDialogPreview>

        <!--<div class="ui-main-module-page">-->
            <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="pageData.currentPage"-->
                    <!--:page-sizes="pageSizes"-->
                    <!--:page-size="pageData.currentList"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="pageData.currentTotal">-->
            <!--</el-pagination>-->
        <!--</div>-->

    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        goToNewPage,
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getPreDateRange,
        getCurrentDateRange,
        getLastMonthStartDate,
        getLastMonthEndDate,
        getCountDate,
    } from '@/api/common/date_format'

    import {
        getEbayListingLinkCountInfo,
        getWarehouseOptionList,
        getOrganizationList,
        getDetailsInfo
    } from '@/api/sales_module/ebay_listing_link'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'ebay_listing_link';

    export default {
        name: component_name,
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                children: [],

                queryData: {
                    countTime: '',
                    bigWarehouse: [],
                    warehouse: [],
                    organizationName: '',
                    organizationId: [],
                    organizationLevelId: '',
                    organizationLevelType: 3,
                },

                //保存默认日期
                saveDefaultDate: '',

                optionList: {
                    organizationList: [],
                    bigWarehouseList: [],
                    warehouseList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //产品线弹框
                popover: {
                    organization: false,
                },
                defaultProps: {
                    children: 'child',
                    label: 'org_name'
                },
                defaultQueryKeys: [],
                //tree搜索关键字
                organizationFilter: '',

                //查看明细
                isDetailShow: false,
                dialogKey: [],
                dialogProps: [],
                dialogData: [],
                dialogWidth: [],
                dialogPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },

                saveRowData: {},
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                ''
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                ''
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getDetailsInfo,
            getEbayListingLinkCountInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn, item) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['ebay_listing_link']);
                }


                let obj = {
                    level_type: this.queryData.organizationLevelType,
                    org_id: this.queryData.organizationLevelId,
                    user_id: this.queryData.organizationId.join(','),
                    big_store: this.queryData.bigWarehouse.join(','),
                    small_store: this.queryData.warehouse.join(','),
                    statistics_time: this.queryData.countTime,
                    ...params,
                };

                this.getEbayListingLinkCountInfo(obj).then(({data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data, item);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData = {
                    countTime: this.saveDefaultDate,
                    bigWarehouse: [],
                    warehouse: [],
                    organizationName: '',
                    organizationId: [],
                    organizationLevelId: '',
                    organizationLevelType: 3
                };
                this.defaultQueryKeys = [];
            },

            //查看明细
            handleDetailsInfo(row, params) {
                if(row.listing_sum_total == 0) return;
                let obj = {
                    org_id: row.id_all,
                    big_store: row.big_store,
                    small_store: row.small_store,
                    statistics_time: row.statistics_time,
                    ...params,
                };
                getDetailsInfo(obj).then(({ data }) => {
                    if(data.status === 2) return;
                    if(data.status) {
                        this.dialogKey = ['序号', ...Object.values(data.title)];
                        this.dialogProps = ['index', ...Object.keys(data.title)];
                        this.dialogWidth = ['60','','120','120','150','140'];
                        this.dialogData = data.data;
                        this.dialogPageData.limit = data.page_data.limit;
                        this.dialogPageData.offset = data.page_data.offset;
                        this.dialogPageData.total = data.page_data.total;
                        this.isDetailShow = true;
                    }else {
                        this.$message.error(data.errorMess || '操作失败');
                    }
                });
                this.saveRowData = row;
            },
            //明细导出
            handleDialogExportInfo() {
                this.handleDetailsInfo(this.saveRowData, {is_excel: 1});
            },
            //明细分页
            handleDialogPageChange({offset,limit}) {
                this.handleDetailsInfo(this.saveRowData, {offset, limit})
            },

            //展开树形表格
            handleToggleTree(row, type) {

                let level = '';
                switch (row.level) {
                    case '1':
                        level = 2;
                        break;
                    case '2':
                        level = 3;
                        break;
                    case '3':
                        level = 4;
                        break;
                    case '4':
                        level = 5;
                        break;
                    case '5':
                        level = 6;
                        break;
                }

                if(row && type === 'click') {
                    this.queryData.organizationLevelId = row.id_all;
                    this.queryData.organizationLevelType = level;
                    this.handleQueryInfo({}, false, row);
                }else {
                    this.queryData.organizationLevelType = 3;
                    this.handleQueryInfo();
                }
            },

            //带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.queryData.organizationId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            //树形保存
            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
//                    if(!item.leaf) return;
                    labels.push(item.org_name);
                    ids.push(item.id);
                });
                this.queryData.organizationName = labels.join(',');
                this.queryData.organizationId = ids;
                this.defaultQueryKeys = ids;
                this.popover.organization = false;
            },

            //组织关键字搜索
            organizationFilterNode(value, data) {
                if (!value) return true;
                return data.org_name.indexOf(value) !== -1;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(e);
                }
                this.popover.organization = false;
                this.organizationFilter = '';
            },


            // 分页条数切换
            handleSizeChange (val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true);
            },

            // 跳转页数切换
            handleCurrentChange (val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true);
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                    total_count: this.pageData.currentTotal
                }, true)
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },

            //查询回调
            handleQueryInfoCallBack (data, item) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'ebay_listing_link',
                    value: JSON.stringify(this.queryData)
                });

                if (item) {
                    if(item.end_flag == 1) {
                        item.children.splice(0);
                        this.$nextTick().then(() => {
                            item.children = data.data.map(item => {
                                return {
                                    ...item,
                                    big_store: this.queryData.bigWarehouse.join(','),
                                    small_store: this.queryData.warehouse.join(','),
                                    statistics_time: this.queryData.countTime
                                }
                            });
                        });
                    }else {
                        item.children.splice(0);
                        this.$nextTick().then(() => {
                            item.children = data.data.map(item => {
                                if(item.id_all == 302 && item.end_flag == 1) {
                                    return {
                                        ...item,
                                        big_store: this.queryData.bigWarehouse.join(','),
                                        small_store: this.queryData.warehouse.join(','),
                                        statistics_time: this.queryData.countTime
                                    }
                                }else {
                                    return {
                                        ...item,
                                        children: [{}],
                                        big_store: this.queryData.bigWarehouse.join(','),
                                        small_store: this.queryData.warehouse.join(','),
                                        statistics_time: this.queryData.countTime
                                    }
                                }
                            });
                        })
                    }
                } else {

                    //数据渲染
                    this.tableKey = ['总计', '海外仓', '国内仓', '虚拟仓', '代销仓'];
                    this.tableProps = ['listing_sum_total', 'listing_sum1', 'listing_sum2', 'listing_sum3', 'listing_sum4'];
                    this.tableData.splice(0);
                    this.$nextTick().then(() => {
                        this.tableData = data.data.map((item, index) => {
                            return {
                                ...item,
                                children: [{}],
                                big_store: this.queryData.bigWarehouse.join(','),
                                small_store: this.queryData.warehouse.join(','),
                                statistics_time: this.queryData.countTime
                            }
                        });
                    })
                }
            },
        },
        created () {
            this.thisVm = this;
            try {
                getWarehouseOptionList().then(({ data }) => {
                    this.optionList.bigWarehouseList = data.big_store;
                    this.optionList.warehouseList = data.small_store;
                });
                getOrganizationList().then(({ data }) => {
                    this.optionList.organizationList = data.data.value;
                });
                getCurrentDateRange().then((data) => {
                    this.saveDefaultDate = data.end;
                    this.queryData.countTime = this.saveDefaultDate;
                    this.handleQueryInfo();
                });
            } catch (e) {
                console.log(e);
            }
        },
        mounted() {
            document.addEventListener('click', this.handleCloseTreeOption);
        },
        beforeDestroy() {
            document.removeEventListener('click', this.handleCloseTreeOption);
        },
        watch: {
            "organizationFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
        }
    };
</script>

<style lang="less" scoped>
    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }

</style>
