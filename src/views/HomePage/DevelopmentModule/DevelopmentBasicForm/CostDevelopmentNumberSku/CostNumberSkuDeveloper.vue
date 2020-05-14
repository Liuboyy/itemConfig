<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="创建日期"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement
                                label="在售时间"
                                template="splitDate"
                                :clearable="true"
                                v-model="queryData.salesTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发小组" >
                            <el-popover
                                    ref="popoverGroup"
                                    width="300"
                                    placement="bottom-start"
                                    trigger="manual"
                                    v-model="popover.group"
                                    :visible-arrow="false"
                                    @show="handleInTreeData('group')">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input size="small" placeholder="输入关键字进行搜索" v-model="groupFilter"></el-input>
                                        <el-tree
                                                ref="treeEditorGroup"
                                                node-key="group_id"
                                                show-checkbox
                                                :data="optionList.groupList"
                                                :props="defaultPropsGroup"
                                                :default-expanded-keys="defaultQueryKeysGroup"
                                                :filter-node-method="groupFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.group = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo('group')">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popoverGroup v-model="queryData.groupName"
                                      @focus="popover.group = true"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发人员">
                            <el-select size="small" v-model="queryData.developer" filterable v-filter
                                       collapseTags multiple>
                                <el-option
                                        v-for="item in optionList.developerList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select size="small" v-model="queryData.developmentType" filterable v-filter>
                                <el-option
                                        v-for="item in optionList.developmentTypeList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品状态">
                            <el-select size="small" v-model="queryData.productStatus" filterable v-filter
                                       collapseTags multiple>
                                <el-option
                                        v-for="item in optionList.productStatusList"
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
                                    @show="handleInTreeData('line')">
                                <div class="ui-input__tree">
                                    <div class="ui-base--area">
                                        <el-input size="small" placeholder="输入关键字进行搜索" v-model="productLineFilter"></el-input>
                                        <el-tree
                                                ref="treeEditor"
                                                node-key="category_id"
                                                show-checkbox
                                                :data="optionList.productLineList"
                                                :props="defaultProps"
                                                :default-expanded-keys="defaultQueryKeys"
                                                :filter-node-method="productLineFilterNode">
                                        </el-tree>
                                    </div>
                                    <div class="ui-tree__btn">
                                        <el-button type="text" @click="popover.productLine = false">关闭</el-button>
                                        <el-button type="text" @click="handleTreeCheckInfo('line')">确定</el-button>
                                    </div>
                                </div>
                            </el-popover>
                            <el-input class="ui-popover__input" readonly size="small" v-popover:popover v-model="queryData.productLineName"
                                      @focus="popover.productLine = true"></el-input>
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

        <ComTableInfo :tableData="tableData"
                      :tableKey="tableKey"
                      :tableProps="tableProps"
                      :showSearch="showSearch"
                      :cellStyle="cellStyle"
                      :tableSort="tableSort"
                      @handleSort="handleSortChange"
                      :otherHeight="['el-tabs__header']"></ComTableInfo>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';
    import {
        getPreDateRange,
        validTime
    } from '../../../../../api/common/date_format'

    import {
        getCostSkuOptionList
    } from '@/api/development_module/cost_development_number_sku'

    import TableIndex from './components/TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                activeName: '1',
                queryData: {
                    createTime: [],
                    salesTime: [],
                    developmentType: '',
                    developer: [],
                    productStatus: ['9'],
                    sortField: '',
                    sortBy: '',
                    sortOrder: {
                        prop: 'area5',
                        order: 'desc'
                    },
                    productLineName: '',
                    productLineId: [],
                    productLineId1: [],
                    productLineId2: [],
                    productLineId3: [],
                    groupName: '',
                    groupId: [],
                    groupId1: [],
                    groupId2: [],
                },
                optionList: {
                    developmentTypeList: [],
                    developerList: [],
                    productStatusList: [],
                    productLineList: [],
                    groupList: [],
                },
                tableData: [],
                tableKey: [],
                tableProps: [],
                tableSort: [],

                //产品线弹框
                popover: {
                    productLine: false,
                },
                defaultProps: {
                    children: 'children',
                    label: 'category_name'
                },
                defaultQueryKeys: [],
                //tree搜索关键字
                productLineFilter: '',

                //开发小组弹框
                popover: {
                    group: false,
                },
                defaultPropsGroup: {
                    children: 'children',
                    label: 'group_name'
                },
                defaultQueryKeysGroup: [],
                //tree搜索关键字
                groupFilter: '',

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //保存日期
                saveDefaultDate: []
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'costSkuDeveloperInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetCostNumberSkuDeveloperInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.salesTime = [];
                this.queryData.developmentType = '';
                this.queryData.developer = [];
                this.queryData.productStatus = ['9'];
                this.queryData.sortField = '';
                this.queryData.sortBy = '';
                this.queryData.productLineName = '';
                this.queryData.productLineId = [];
                this.queryData.productLineId1 = [];
                this.queryData.productLineId2 = [];
                this.queryData.productLineId3 = [];
                this.queryData.groupName = '';
                this.queryData.groupId = [];
                this.queryData.groupId1 = [];
                this.queryData.groupId2 = [];
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['cost_sku_developer']);
                }
                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                if(!validTime(this.queryData.salesTime[0], this.queryData.salesTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                if(this.queryData.salesTime[0] && !this.queryData.salesTime[1] ||
                    this.queryData.salesTime[1] && !this.queryData.salesTime[0]) {
                    this.$message.warning('在售时间请选择查询区间！');
                    return;
                }
                let obj = {
                    start_date: this.queryData.createTime[0] || '',
                    end_date: this.queryData.createTime[1] || '',
                    sell_start_date: this.queryData.salesTime && this.queryData.salesTime[0] || '',
                    sell_end_date: this.queryData.salesTime && this.queryData.salesTime[1] || '',
                    dev_type: this.queryData.developmentType,
                    user_ids: this.queryData.developer.join(','),
                    product_status: this.queryData.productStatus.join(','),
                    p_line_ids1: this.queryData.productLineId1.join(','),
                    p_line_ids2: this.queryData.productLineId2.join(','),
                    p_line_ids3: this.queryData.productLineId3.join(','),
                    group_ids1: this.queryData.groupId1.join(','),
                    group_ids2: this.queryData.groupId2.join(','),
                    sort_field: this.queryData.sortField,
                    sort_by: this.queryData.sortBy,
                };

                obj = Object.assign(obj || {}, params);

                this.GetCostNumberSkuDeveloperInfo(obj).then(({ data}) => {
                    // 导出
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            // 排序
            handleSortChange(column) {
                this.queryData.sortOrder = {
                    prop: column.prop,
                    order: column.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'cost_sku_developer',
                    value: JSON.stringify(this.queryData)
                });

                this.queryData.sortField = column.prop;

                if (column.prop === "area5") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area10") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area20") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area50") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area100") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area200") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area350") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "area351") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                if (column.prop === "total") {
                    this.queryData.sortBy = column.order === 'ascending' ? 'asc' : 'desc';
                }
                this.handleQueryInfo();
            },

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //带入tree数据
            handleInTreeData(type) {
                switch (type) {
                    case 'line':
                        this.$nextTick(() => {
                            const checkIds = this.queryData.productLineId;
                            this.$refs.treeEditor.setCheckedKeys(checkIds);
                        });
                        break;
                    case 'group':
                        this.$nextTick(() => {
                            const checkIds = this.queryData.groupId;
                            this.$refs.treeEditorGroup.setCheckedKeys(checkIds);
                        });
                        break;
                }
            },

            //树形保存
            handleTreeCheckInfo(type) {
                if(type === 'line') {
                    const [labels, ids, p_line_ids1, p_line_ids2, p_line_ids3] = [[], [], [], [], []];
                    this.getSimpleCheckedNodes(this.$refs.treeEditor.store).forEach(item => {
                        switch (item.category_level) {
                            case '1':
                                p_line_ids1.push(item.category_id);
                                break;
                            case '2':
                                p_line_ids2.push(item.category_id);
                                break;
                            case '3':
                                p_line_ids3.push(item.category_id);
                                break;
                        }
                        ids.push(item.category_id);
                        labels.push(item.category_name);
                    });
                    this.queryData.productLineName = labels.join(',');
                    this.queryData.productLineId = ids;
                    this.queryData.productLineId1 = p_line_ids1;
                    this.queryData.productLineId2 = p_line_ids2;
                    this.queryData.productLineId3 = p_line_ids3;
                    this.defaultQueryKeys = ids;
                    this.popover.productLine = false;
                }else {
                    const [labels, ids, group_ids1, group_ids2] = [[], [], [], []];
                    this.getSimpleCheckedNodes(this.$refs.treeEditorGroup.store).forEach(item => {
                        switch (item.level) {
                            case '1':
                                group_ids1.push(item.group_id);
                                break;
                            case '2':
                                group_ids2.push(item.group_id);
                                break;
                        }
                        ids.push(item.group_id);
                        labels.push(item.group_name);
                    });
                    this.queryData.groupName = labels.join(',');
                    this.queryData.groupId = ids;
                    this.queryData.groupId1 = group_ids1;
                    this.queryData.groupId2 = group_ids2;
                    this.defaultQueryKeysGroup = ids;
                    this.popover.group = false;
                }
            },


            //处理全选的时候只传父级id
            getSimpleCheckedNodes(store) {
                const checkedNodes = [];
                const traverse = function(node) {
                    const childNodes = node.root ? node.root.childNodes : node.childNodes;

                    childNodes.forEach(child => {
                        if (child.checked) {
                            checkedNodes.push(child.data);
                        }
                        if (child.indeterminate) {
                            traverse(child);
                        }
                    });
                };
                traverse(store);
                return checkedNodes;
            },

            //产品线关键字搜索
            productLineFilterNode(value, data) {
                if (!value) return true;
                return data.category_name.indexOf(value) !== -1;
            },

            //小组关键字搜索
            groupFilterNode(value, data) {
                if (!value) return true;
                return data.group_name.indexOf(value) !== -1;
            },

            // 关闭树形下拉
            handleCloseTreeOption(event) {
                try {
                    if (event.path.some(_e => _e.className && _e.className.indexOf && _e.className.indexOf('ui-popover__input') > -1)) return;
                } catch (e) {
                    console.log(e);
                }
                this.popover.productLine = false;
                this.popover.group = false;
                this.productLineFilter = '';
                this.groupFilter = '';
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
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

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'cost_sku_developer',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = data.data.key;
                this.tableProps = ['user_name','total','area5', 'area10', 'area20', 'area50', 'area100', 'area200', 'area350', 'area351'];
                this.tableSort = [false ,'custom','custom', 'custom', 'custom', 'custom', 'custom', 'custom', 'custom', 'custom'];

                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data.value;
                })
            }
        },
        created(){
            this.thisVm = this;
            try{
                getCostSkuOptionList().then(({ data }) => {
                    this.optionList.developmentTypeList = data.data.dev_type_list;
                    this.optionList.developerList = data.data.user_list;
                    this.optionList.productStatusList = data.data.product_status_list;
                    this.optionList.productLineList = data.data.product_line_list;
                    this.optionList.groupList = data.data.group_list;
                });
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.costSkuDeveloperInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['cost_sku_developer']);
                        this.handleQueryInfoCallBack(this.costSkuDeveloperInfo);
                    }
                });
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
            "groupFilter"(val) {
                this.$refs.treeEditorGroup.filter(val);
            },
        }
    }
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

</style>
