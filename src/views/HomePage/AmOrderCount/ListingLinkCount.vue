<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="统计类型" >
                            <el-select size="small" v-model="queryData.type" @change="handleChangeType">
                                <el-option
                                        v-for="(label, value) in optionList.typeList"
                                        :key="value"
                                        :value="value"
                                        :label="label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="统计日期">
                            <el-date-picker
                                    v-show="queryData.type === 'i'"
                                    :clearable="false"
                                    size="small"
                                    v-model="queryData.daterange"
                                    type="daterange"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-date-picker
                                    v-show="queryData.type === 'f'"
                                    :clearable="false"
                                    v-model="queryData.date"
                                    type="date"
                                    placeholder="选择日期"
                                    size="small"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="小组" >
                            <el-popover
                                    ref="popover"
                                    width="300"
                                    placement="bottom-start"
                                    trigger="manual"
                                    :visible-arrow="false"
                                    v-model="popover.group"
                                    @show="handleInTreeData">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input size="small" placeholder="输入关键字进行搜索" v-model="groupFilter"></el-input>
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="target_id"
                                                show-checkbox
                                                :data="optionList.groupList"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :props="defaultProps"
                                                :filter-node-method="groupFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.group = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo()">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.groupName"
                                      @focus="popover.group = true"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="渠道" >
                            <el-select size="small" v-model="queryData.canal">
                                <el-option
                                        v-for="item in optionList.canalList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo" :params="{type: 'all'}"></FilterBtn>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <!--<el-button-->
                    <!--v-if="item.method && item.permit(thisVm) && item.icon"-->
                    <!--v-for="item in buttonList"-->
                    <!--size="small"-->
                    <!--:type="item.type"-->
                    <!--:key="item.value"-->
                    <!--:icon="item.icon"-->
                    <!--@click="item.action(thisVm, item.method)">{{item.name}}</el-button>-->
        </div>

        <ComTreeTable :tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :tableWidth="tableWidth"
                      :showSearch="showSearch"
                      :treeNode="{title: '团队', field: 'team_name', width: '140px'}"
                      @toggleTree="(v) => { handleToggleTree(v, 'click') }"></ComTreeTable>
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
    } from '@/api/common/date_format'


//    import {
//        getGroupOptionList
//    } from '@/api/common';

    import {
        getListingLinkCountInfo,
        getGroupOptionList
    } from '../../../api/am_order_count/listing_link_count'

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'listing_link_count';

    export default {
        name: component_name,
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                children: [],

                queryData: {
                    type: 'i',
                    date: '',
                    daterange: [],
                    canal: '',
                    groupName: '',
                    groupId: '',
                },
                saveDefaultDate: '',
                saveDefaultDateRange: [],
                saveGroupIds: [],
                saveStartDate: '',
                saveEndDate: '',
                saveType: '',
                saveCanal: '',

                optionList: {
                    typeList: [],
                    groupList: [],
                    canalList: [],
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

                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },

                popover: {
                    group: false,
                },

                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                defaultQueryKeys: [],

                //tree搜索关键字
                groupFilter: '',
            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'arrearsCountReportsInfo'
            ]),
//            buttonList() {
//                return config.AUTHORITY_BUTTON[component_name].buttonList;
//            }
        },
        methods: {
            ...mapActions([
                'GetArrearsCountReportInfo'
            ]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getListingLinkCountInfo,
            getGroupOptionList,

            // 列表信息查询
            handleQueryInfo (params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['listing_link_count']);
                }

                let obj = {
                    summary_type: this.queryData.type,
                    fulfillment_type: this.queryData.canal,
                    start_date: this.queryData.type === 'i' ? this.queryData.daterange[0] : this.queryData.date,
                    end_date: this.queryData.type === 'i' ? this.queryData.daterange[1] : this.queryData.date,
                    obj_type: 'team',
                    group_ids: this.queryData.groupId,
                    ...params
                };
                this.getListingLinkCountInfo(obj).then(({data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {
                this.queryData.type = 'i';
                this.queryData.canal = '';
                this.queryData.date = this.saveDefaultDate;
                this.queryData.daterange = this.saveDefaultDateRange;
                this.queryData.groupName = '';
                this.queryData.groupId = '';
                this.defaultQueryKeys = [];
            },

            //展开行
            handleToggleTree(row) {

                if(row.obj_type === 'all') return;

                let obj_type = '';
                let group_ids = '';

                switch (row.obj_type) {
                    case 'team':
                        obj_type = 'group';
                        group_ids = this.saveGroupIds || '';
                        break;
                    case 'group':
                        obj_type = 'account';
                        group_ids = row.group_id;
                        break;
                }

                let obj = {
                    summary_type: this.saveType,
                    fulfillment_type: this.saveCanal,
                    start_date: this.saveStartDate,
                    end_date: this.saveEndDate,
                    obj_type: obj_type,
                    team_ids: row.team_id,
                    group_ids: group_ids,
                };
                this.getListingLinkCountInfo(obj).then(({data}) => {
                    if(data.status) {
                        this.handleQueryInfoCallBack(data, row);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                })
            },

             //带入tree数据
            handleInTreeData() {
                this.$nextTick(() => {
                    const checkIds = this.defaultQueryKeys;
                    this.$refs.treeEditor.setCheckedKeys(checkIds);
                });
            },

            //树形保存
            handleTreeCheckInfo() {
                const [labels, ids] = [[], []];
                this.$refs.treeEditor.getCheckedNodes().forEach(item => {
                    if (item.obj_type === 'team') return;
                    labels.push(item.name);
                    ids.push(item.target_id);
                });
                this.queryData.groupName = labels.join(',');
                this.queryData.groupId = ids.map(item => item.replace(/^[a-zA-Z]+_/, '')).join(',');
                this.defaultQueryKeys = ids;
                this.popover.group = false;
            },

            //小组关键字搜索
            groupFilterNode(value, data) {
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
                this.popover.group = false;
                this.groupFilter = '';
            },

            //切换统计类型
            handleChangeType(val) {
                this.queryData.type = val;
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
                    isExcel: 1
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
                    key: 'listing_link_count',
                    value: JSON.stringify(this.queryData)
                });

                this.optionList.canalList = data.data.fulfillment_list;
                this.optionList.typeList = data.data.summary_type_list;

                this.saveGroupIds = this.queryData.groupId;
                this.saveType = this.queryData.type;
                this.saveCanal = this.queryData.canal;
                this.saveStartDate = this.queryData.type === 'i' ? this.queryData.daterange[0] : this.queryData.date;
                this.saveEndDate = this.queryData.type === 'i' ? this.queryData.daterange[1] : this.queryData.date;

                if (item) {
                    if(item.obj_type === 'group') {
                        //最底层展开至账号级
                        item.children.splice(0);
                        this.$nextTick().then(() => {
                            item.children = data.data.value;
                        });
                    }else {
                        item.children.splice(0);
                        this.$nextTick().then(() => {
                            item.children = data.data.value.map(item => {
                                return {
                                    ...item,
                                    children: [{}],
                                }
                            });
                        })
                    }
                } else {
                    //数据渲染

                    this.tableData.splice(0);
                    this.$nextTick().then(() => {
                        this.tableKey = ['小组', '账号', '总链接', 'us', 'ca', 'mx', 'uk', 'de', 'fr', 'sp', 'it', 'jp', 'ini', 'au', 'ae'];
                        this.tableProps = ['group_name', 'account_name', 'listing_sum_zl', 'us', 'ca', 'mx', 'uk', 'de', 'fr', 'sp', 'it', 'jp', 'ini', 'au', 'ae'];
                        this.tableWidth = ['110', '110', '',];
                        this.tableData = data.data.value.map((item, index) => {
                            return index === 0 ? {
                                ...item,
                            } : {
                                ...item,
                                children: [{}],
                            }
                        });
                    });
                }
            },
        },
        created () {
            this.thisVm = this;
            this.getGroupOptionList().then(({ data }) => {
                this.optionList.groupList = data.data;
            });
            this.saveDefaultDateRange = getThirtyDayDateRange(new Date(new Date().getTime() - 86400000));
            try {
                getCurrentDateRange().then(( data ) => {
                    this.saveDefaultDate = data.end;
                    this.queryData.date = this.saveDefaultDate;
                    this.queryData.daterange = this.saveDefaultDateRange;
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
            "groupFilter"(val) {
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

    /deep/.ui-main-module-table {
        .panel-body, .tree-title {
            font-size: 12px;
            border-color: #EBEEF5;
        }
        .datagrid-header {
            background: #fafafa;
            border-color: #efefef;
            .datagrid-htable {
                font-weight: bold;
                color: #666666;
            }
            .datagrid-cell span {
                font-size: 12px;
            }
            td {
                border-style: solid;
                border-color: #efefef;
            }
        }
        .datagrid-body{
            td {
                border-style: solid;
                border-color: #efefef;
            }
        }
        .datagrid-cell {
            padding: 0 8px;
        }
        .tree-folder {
            display: none;
        }
        .datagrid-row {
            height: 36px;
        }
        .datagrid-row-selected {
            background: transparent;
        }
        .tree-collapsed {
            background: url('../../../assets/image/listing.png') no-repeat -5px -5px;
        }
        .tree-expanded {
            background: url('../../../assets/image/listing.png') no-repeat -32px -2px ;
        }
        .datagrid-btable tr.datagrid-row:nth-child(3n-1){
            background: #fdfdfd;
        }
    }

</style>
