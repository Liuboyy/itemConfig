<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="月份" template="daterangeym" v-model="queryData.month"></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="区域">
                            <el-select size="small" v-model="queryData.region" v-filter filterable collapseTags multiple>
                                <el-option v-for="item in optionList.regionList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="分类">
                            <el-select size="small" v-model="queryData.classify" v-filter filterable collapseTags multiple>
                                <el-option v-for="item in optionList.classifyList"
                                           :key="item.d_id"
                                           :value="item.d_id"
                                           :label="item.d_name"></el-option>
                            </el-select>
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
                    v-if="item.method && item.permit(thisVm) && item.icon && item.value !== 'import'"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <ComTableInfo
                isCheck
                @checked="handleCheckInfo"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :otherHeight="['el-tabs__header']">
            <template slot="case_pz" slot-scope="scope">
                <el-popover
                        v-if="scope.row.case_pz && scope.row.case_pz.length > 50"
                        placement="right-start"
                        width="400"
                        trigger="hover">
                    <span>{{scope.row.case_pz}}</span>
                    <span slot="reference">{{scope.row.case_pz.length > 50 ? scope.row.case_pz.substring(0,50) + '...':scope.row.case_pz}}</span>
                </el-popover>
                <span v-else>{{scope.row.case_pz}}</span>
            </template>
            <template slot="operation" slot-scope="scope">
                <ComPermitButton label="编辑" permit="edit" @click="handleEditInfo(scope.row)"></ComPermitButton>
                <ComPermitButton label="删除" permit="delete" @click="handleDeleteInfo(scope.row)"></ComPermitButton>
            </template>
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


        <el-dialog
                top="10vh"
                width="1400px"
                :title="isEditDialog ? '编辑' : '批量新增'"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddDialog"
                :close-on-click-modal=false
                @close="handleCloseAddInfo">
            <TableEdit
                    ref="tableEdit"
                    type="form"
                    :isRefresh="isAddEdit"
                    :isAdd="!isEditDialog ? true : false"
                    :tableKey="tableEdit.key"
                    :props="tableEdit.props"
                    :types="tableEdit.types"
                    :optionList="tableEdit.optionList"
                    @backData="handleTableEditInfo"></TableEdit>
            <div slot="footer">
                <el-button size="small" @click="handleCloseAddInfo" style="margin: 0 28px">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmInfo">确定</el-button>
            </div>
        </el-dialog>

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
        getOptionList,
        addOtherCostsInfo,
        editOtherCostsInfo,
        deleteOtherCostsInfo
    } from '../../../../api/zen_tao_module/it_expense_list'


    import {
        getMonthRange,
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'it_expense_list';

    export default {
//        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    month: [],
                    region: [],
                    classify: [],
                },

                optionList: {
                    regionList: [],
                    classifyList: [],
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                saveDefaultMonth: [],
                saveCheckInfo: [],
                saveId: '',

                //弹框操作
                isAddDialog: false,
                isEditDialog: false,
                isAddEdit: false,
                tableEdit: {
                    key: ['账单日期', '所属月份', '区域', '分类', '详情', '单价', '数量', '合计', '备注'],
                    props: ['fee_day', 'fee_month', 'region', 'fee_type', 'fee_item', 'unit_price', 'qty', 'total_price', 'remarks'],
                    types: ['date', 'month', 'select', 'select', 'input', 'floatNumber', 'number', 'floatNumber', 'input'],
                    optionList: [],
                },
                tableEditData: [],
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
                'buttonList',
                'otherCostsInfo'
            ]),
//            buttonList() {
//                return config.AUTHORITY_BUTTON[component_name].buttonList;
//            }
        },
        methods: {
            ...mapActions([
                'GetOtherCostsInfo'
            ]),
            autoAddTableInx,


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['other_cost']);
                }

                let obj = {
                    fee: this.queryData.region.join(','),
                    classify: this.queryData.classify.join(','),
                    month_start: this.queryData.month && this.queryData.month[0] || '',
                    month_end: this.queryData.month && this.queryData.month[1] || '',
                };

                obj = Object.assign(params || {}, obj);

                this.GetOtherCostsInfo(obj).then(({ data }) => {
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
                this.queryData.month = this.saveDefaultMonth;
                this.queryData.region = [];
                this.queryData.classify = [];
            },

            //获取勾选数据
            handleCheckInfo(val) {
                this.saveCheckInfo = val;
            },

            //获取数据
            handleTableEditInfo(val) {
                this.tableEditData = val;
            },

            //新增
            handleBatchAddInfo() {
                this.isAddDialog = true;
            },
            //取消
            handleCloseAddInfo() {
                this.isAddDialog = false;
                this.isEditDialog = false;
                this.tableEditData = [];
                this.$nextTick().then(() => {
                    this.$refs['tableEdit'] && this.$refs['tableEdit'].handleRefreshTableData([], 'com');
                })
            },
            //确定
            handleConfirmInfo() {

                let flag = this.tableEditData.some(item => {
                    return !item[0] || !item[1] || !item[2] || !item[3] || !item[4] || !item[5] || !item[6] || !item[7] || !item[8]
                });

                if (flag) {
                    this.$message.warning('请填写完整信息后提交！');
                    return;
                }
                if (this.isEditDialog) {
                    let obj = {
                        id: this.saveId,
                        fee_day: this.tableEditData[0][0],
                        fee_month: this.tableEditData[0][1],
                        region: this.tableEditData[0][2],
                        fee_type: this.tableEditData[0][3],
                        fee_item: this.tableEditData[0][4],
                        unit_price: this.tableEditData[0][5],
                        qty: this.tableEditData[0][6],
                        total_price: this.tableEditData[0][7],
                        remarks: this.tableEditData[0][8],
                        user_number: this.loginInfo.user_name
                    };
                    editOtherCostsInfo(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })

                }else {

                    let orderData = this.tableEditData.map(item => {
                        return {
                            fee_day: item[0],
                            fee_month: item[1],
                            region: item[2],
                            fee_type: item[3],
                            fee_item: item[4],
                            unit_price: item[5],
                            qty: item[6],
                            total_price: item[7],
                            remarks: item[8],
                            create_user: this.loginInfo.user_name
                        }
                    });

                    addOtherCostsInfo({
                        other_data: JSON.stringify(orderData)
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }
            },

            //编辑
            handleEditInfo(row) {
                this.saveId = row.id;
                this.isAddDialog = true;
                this.isEditDialog = true;
                this.$nextTick().then(() => {
                    this.$refs['tableEdit'] && this.$refs['tableEdit'].handleRefreshTableData([row], 'com');
                })
            },

            //单个删除
            handleDeleteInfo({id}) {
                this.handleDeleteCallBack(id);
            },

            //批量删除
            handleBatchDeleteInfo() {
                if (!this.saveCheckInfo.length) {
                    this.$message.warning('请勾选数据！');
                    return;
                }
                let id = this.saveCheckInfo.map(item => item.id).join(',');
                this.handleDeleteCallBack(id)
            },
            handleDeleteCallBack(id) {
                this.$confirm('是否确认删除？', '提示', {
                    type: 'warning',
                }).then(() => {
                    deleteOtherCostsInfo({
                        id: id,
                        user_number: this.loginInfo.user_name
                    }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    });
                }).catch((e) =>{console.log(e)})
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.isAddDialog = false;
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
                    is_excel: 1
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'other_cost',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title), '操作'];
                this.tableProps = ['index', ...Object.keys(data.title), 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableWidth = this.tableProps.map(item => {
                    if (item === 'index') return '60';
                    if (item === 'qty') return '70';
                    if (item === 'region_name'|| item === 'create_user'|| item === 'update_user') return '80';
                    if (item === 'fee_day'|| item === 'fee_month'|| item === 'fee_type_name'|| item === 'operation') return '100';
                    if (item === 'create_date'|| item === 'update_date') return '140';
                    return '';
                });
                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList().then(({ data }) => {
                    this.optionList.regionList = data.fee_data;
                    this.optionList.classifyList = data.classify;

                    let regionObj = {};
                    let classifyObj = {};
                    this.optionList.regionList.map(item => {
                        return regionObj[item.d_id] = item.d_name;
                    });
                    this.optionList.classifyList.map(item => {
                        return classifyObj[item.d_id] = item.d_name;
                    });
                    this.tableEdit.optionList[2] = regionObj;
                    this.tableEdit.optionList[3] = classifyObj;
                });
                getMonthRange().then(( data ) => {
                    this.saveDefaultMonth = [data.start, data.end];
                    if (JSON.stringify(this.otherCostsInfo) === '{}') {
                        this.queryData.month = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['other_cost']);
                        this.handleQueryInfoCallBack(this.otherCostsInfo);
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

</style>
