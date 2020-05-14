<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="采购单创建时间" v-model="queryData.createTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="付款时间" v-model="queryData.paymentTime" template="daterange" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购员">
                            <el-select size="small" v-model="queryData.buyer" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.buyerList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="组别">
                            <el-select size="small" v-model="queryData.group" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.groupList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="结算方式">
                            <el-select size="small" v-model="queryData.settleWay" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.settleWayList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="采购仓库">
                            <el-select size="small" v-model="queryData.warehouse" multiple collapse-tags filterable v-filter>
                                <el-option v-for="item in optionList.warehouseList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线" >
                            <el-popover
                                    ref="popover"
                                    width="300"
                                    placement="bottom-start"
                                    trigger="manual"
                                    v-model="popover.productLine"
                                    :visible-arrow="false"
                                    @show="handleInTreeData">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input size="small" placeholder="输入关键字进行搜索" v-model="productLineFilter"></el-input>
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="id"
                                                show-checkbox
                                                :data="optionList.productLineList"
                                                :props="defaultProps"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :filter-node-method="productLineFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.productLine = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.productLineName"
                                      @focus="popover.productLine = true"></el-input>
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
        <div class="ui-tabs_box">
            <el-tabs v-model="queryData.query_type" type="card" @tab-click="handleTabClick">
                <el-tab-pane label="日期维度统计" name="1"></el-tab-pane>
                <el-tab-pane label="采购员维度统计" name="2"></el-tab-pane>
            </el-tabs>
        </div>

        <TableIndex :tableData="tableData" :showSearch="showSearch" :otherHeight="['el-tabs__header']" :queryType="queryType"></TableIndex>

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
        getArrivalOverseaInfo,
        getOptionList,
        getProductLineList
    } from '@/api/purchasing_module/arrival_time_oversea';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    import TableIndex from './TableIndex.vue'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'arrival_time_oversea';

    export default {
        name: component_name,
        components: {TableIndex},
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    query_type: '1',
                    createTime: [],
                    paymentTime: [],
                    buyer: [],
                    group: [],
                    settleWay: [],
                    warehouse: [],
                    productLineName: '',
                    productLineId: [],
                },

                optionList: {
                    buyerList: [],
                    groupList: [],
                    warehouseList: [],
                    settleWayList: [],
                    productLineList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableMinWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultDate: [],

                //产品线弹框
                popover: {
                    productLine: false,
                },
                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                defaultQueryKeys: [],
                //tree搜索关键字
                productLineFilter: '',

                queryType: '',
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([
                'Fn'
            ]),
            autoAddTableInx,
            getArrivalOverseaInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['arrival_time_oversea']);
                }

                let obj = {
                    tj_type: this.queryData.query_type,
                    po_create_time_s: this.queryData.createTime && this.queryData.createTime[0] && this.queryData.createTime[0] + ' 00:00:00',
                    po_create_time_e: this.queryData.createTime && this.queryData.createTime[1] && this.queryData.createTime[1] + ' 23:59:59',
                    pay_time_s: this.queryData.paymentTime && this.queryData.paymentTime[0] && this.queryData.paymentTime[0] + ' 00:00:00',
                    pay_time_e: this.queryData.paymentTime && this.queryData.paymentTime[1] && this.queryData.paymentTime[1] + ' 23:59:59',
                    buyer_id: this.queryData.buyer.join(','),
                    buyer_group: this.queryData.group.join(','),
                    warehouse_code: this.queryData.warehouse.join(','),
                    account_type: this.queryData.settleWay.join(','),
                    product_onelevel_id: this.queryData.productLineId.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.getArrivalOverseaInfo(obj).then(({ data }) => {
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
                this.queryData = {
                    query_type: this.queryData.query_type,
                    createTime: [],
                    paymentTime: [],
                    buyer: [],
                    group: [],
                    settleWay: [],
                    warehouse: [],
                    productLineName: '',
                    productLineId: [],
                };
            },

            handleTabClick(tab) {
                this.queryData.query_type = tab.name;
                this.handleQueryInfo({limit: this.pageData.currentList});
            },

            //带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.queryData.productLineId;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            //树形保存
            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    if(!item.leaf) return;
                    labels.push(item.name);
                    ids.push(item.id);
                });
                this.queryData.productLineName = labels.join(',');
                this.queryData.productLineId = ids;
                this.defaultQueryKeys = ids;
                this.popover.productLine = false;
            },

            //小组关键字搜索
            productLineFilterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(e);
                }
                this.popover.productLine = false;
                this.productLineFilter = '';
            },


            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败');
                }

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
                    isExcel: 1,
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'arrival_time_oversea',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.queryType = this.queryData.query_type;
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data_table;
                });

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList({module: 'cn_fba_goods_time'}).then(({ data }) => {
                    this.optionList.buyerList = data.categor_dict.buyer_list;
                    this.optionList.groupList = data.categor_dict.group_list;
                    this.optionList.warehouseList = data.categor_dict.warehouse_list;
                    this.optionList.settleWayList = data.categor_dict.pay_list;
                });
                getProductLineList().then(({ data }) => {
                    this.optionList.productLineList = data.data.value;
                });
                this.handleQueryInfo();
            }catch (e) {
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
            "productLineFilter"(val) {
                this.$refs.treeEditor.filter(val);
            },
        }
    }
</script>

<style scoped lang="less">

    @color: #ff9900;

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;;
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


</style>
