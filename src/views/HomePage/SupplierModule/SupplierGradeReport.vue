<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="创建时间" template="daterange" v-model="queryData.createTime" :isOption="false" clearable>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商代码">
                            <el-input size="small" placeholder="请输入" v-model="queryData.supplierCode"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商名称">
                            <el-input size="small" placeholder="请输入" v-model="queryData.supplierName"></el-input>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="供应商等级">
                            <el-select size="small" v-model="queryData.supplierGrade" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.supplierGradeList"
                                        :key="item.supplier_level"
                                        :value="item.supplier_level"
                                        :label="item.supplier_level_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select size="small" v-model="queryData.productLine" filterable v-filter multiple collapseTags>
                                <el-option
                                        v-for="item in optionList.productLineList"
                                        :key="item.category_id_level_1"
                                        :value="item.category_id_level_1"
                                        :label="item.category_name_level_1"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun">查询</el-button>
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
                @handleSort="handleSortChange">
            <template v-for="(item, index) in tableProps" :slot="item" slot-scope="scope"  v-if="index > 0">
                <el-button size="small" type="text" @click="handleSupplierDetails(scope.row, scope.row[item].level)"
                           v-if="buttonList['detail'] && buttonList['detail'].permit(thisVm)">{{scope.row[item].value}}</el-button>
                <span v-else>{{scope.row[item].value}}</span>
            </template>
        </ComTableInfo>

        <ComDialogPreview title="查看明细" width="1300px" isPage
                          :visible.sync="isShowDetails"
                          :tableKey="dialogKey"
                          :tableProps="dialogProps"
                          :tableData="dialogData"
                          :tableWidth="dialogWidth"
                          :dialogPageData="dialogPageData"
                          @dialogPageChange="handleDialogPageChange">
            <template slot="web_link" slot-scope="scope">
                <el-button size="small" type="text" :label="scope.row.web_link" v-if="buttonList['link'] && buttonList['link'].permit(thisVm)"
                           @click="handleSupplierLink(scope.row)">{{scope.row.web_link}}</el-button>
            </template>
        </ComDialogPreview>

    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getCurrentMonth,
    } from '@/api/common/date_format'

    import {
        getSupplierGradeInfo,
        getSupplierDetailsInfo,
        getOptionList
    } from '../../../api/supplier_module/supplier_grade_report'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
        const component_name = 'supplier_grade_report';

    export default {
        name: component_name,
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    supplierCode: '',
                    supplierName: '',
                    supplierGrade: [],
                    productLine: [],
                    sort: '',
                },
                optionList: {
                    supplierGradeList: [],
                    productLineList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                tableSort: [],

                saveDefaultDate: '',
                saveRowData: {},
                saveRowLevel: '',

                //查看详情
                isShowDetails: false,
                dialogKey: [],
                dialogProps: [],
                dialogData: [],
                dialogWidth: [],
                dialogPageData: {
                    limit: 20,
                    offset: 1,
                    total: 0
                },
            }
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([]),
            getSupplierGradeInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.createTime = [];
                this.queryData.supplierGrade = [];
                this.queryData.productLine = [];
                this.queryData.supplierCode = '';
                this.queryData.supplierName = '';
                this.queryData.sort = '';

            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['supplier_grade_report']);
                }
                let obj = {
                    supplier_code: this.queryData.supplierCode,
                    supplier_name: this.queryData.supplierName,
                    category: this.queryData.productLine.join(','),
                    supplier_level: this.queryData.supplierGrade.join(','),
                    date_start: this.queryData.createTime && this.queryData.createTime[0],
                    date_end: this.queryData.createTime && this.queryData.createTime[1],
                    sort: this.queryData.sort,
                    ...params,
                };

                obj = Object.assign(obj || {}, params);

                this.getSupplierGradeInfo(obj).then(({ data}) => {
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
            handleSortChange(data) {
                this.queryData.sortOrder = {
                    prop: data.prop,
                    order: data.order
                };
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'supplier_grade_report',
                    value: JSON.stringify(this.queryData)
                });
                if (data.prop === "point_supplier_cnt") {
                    this.queryData.sort = data.order === 'ascending' ? 1 : 2;
                }
                if (data.prop === "commonly_supplier_cnt") {
                    this.queryData.sort = data.order === 'ascending' ? 3 : 4;
                }
                if (data.prop === "test_supplier_cnt") {
                    this.queryData.sort = data.order === 'ascending' ? 5 : 6;
                }
                if (data.prop === "other_supplier_cnt") {
                    this.queryData.sort = data.order === 'ascending' ? 7 : 8;
                }
                this.handleQueryInfo();
            },

            //查看明细
            handleSupplierDetails(row, level, page) {
                this.saveRowData = row;
                this.saveRowLevel = level;
                let obj = {
                    supplier_code: row.supplier_code,
                    supplier_name: row.supplier_name,
                    category: row.category_id,
                    supplier_level: this.saveRowLevel,
                    date_start: row.date_start,
                    date_end: row.date_end,
                    ...page
                };
                getSupplierDetailsInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.isShowDetails = true;
                        this.dialogKey = ['序号', ...data.title];
                        this.dialogProps = ['index', 'supplier_code', 'supplier_name', 'supplier_level_name', 'user_name', 'create_time', 'web_link', 'one_month_predict_num', 'six_month_predict_num'];
                        this.dialogWidth = ['60', '110', '220', '110', '80', '140', '', '110', '110'];
                        this.dialogData = data.data;
                        this.dialogPageData.limit = data.page_data.limit;
                        this.dialogPageData.offset = data.page_data.offset;
                        this.dialogPageData.total = data.page_data.total;
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })

            },
            //弹框分页
            handleDialogPageChange({offset,limit}) {
                this.handleSupplierDetails(this.saveRowData, this.saveRowLevel, {offset, limit})
            },
            //明细导出
//            handleDialogExportInfo() {
//                let params = {
//                    is_excel: 1,
//                };
//                this.handleSupplierDetails(this.saveRowData, params)
//            },

            //供应商链接
            handleSupplierLink(row) {
                window.open(`${row.web_link}`, '_blank')
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
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
                    key: 'supplier_grade_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['一级类目','重点开发供应商数量', '一般开发供应商数量', '试点开发供应商数量', '其他开发供应商数量'];
                this.tableProps = ['category_name', 'point_supplier_cnt', 'commonly_supplier_cnt','test_supplier_cnt', 'other_supplier_cnt'];
                this.tableSort = [false, 'custom', 'custom','custom','custom'];
                this.tableData = data.data.map(item => {
                    return {
                        ...item,
                        supplier_code: this.queryData.supplierCode,
                        supplier_name: this.queryData.supplierName,
                        date_start: this.queryData.createTime && this.queryData.createTime[0],
                        date_end: this.queryData.createTime && this.queryData.createTime[1],
                    }
                })
            }
        },
        created(){
            this.thisVm = this;
            try{
                getOptionList().then(({ data }) => {
                    this.optionList.supplierGradeList = data.supplier_level;
                    this.optionList.productLineList = data.category_data;
                });
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>
    /deep/.el-button {
        white-space: pre-line;
        text-align: left;
    }

</style>
