<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="月份" template="daterangeym" v-model="queryData.month"></SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品" >
                            <el-select size="small" v-model="queryData.product" multiple collapseTags filterable v-filter>
                                <el-option
                                        v-for="item in optionList.productList"
                                        :key="item.prod_name"
                                        :value="item.prod_name"
                                        :label="item.prod_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li class="ui-log">
                        <SearchRequirement label="项目">
                            <el-select size="small" v-model="queryData.project" multiple collapseTags filterable v-filter>
                                <el-option
                                        v-for="item in optionList.projectList"
                                        :key="item.prod_name"
                                        :value="item.prod_name"
                                        :label="item.prod_name"></el-option>
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
                    v-if="item.method && item.permit(thisVm) && item.icon && item.value === 'import'"
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
                :tableMinWidth="tableMinWidth"
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
                title="导入"
                width="400px"
                class="ui-layout_edit-dialog"
                :visible.sync="isImportShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="isImportShow = false; fileList = []">
            <div>
                <el-upload
                        ref="upload"
                        :action="uploadUrl"
                        :auto-upload="false"
                        :file-list="fileList"
                        :on-change="handleChangeFileInfo"
                        :on-success="handleSuccessCallBack"
                        :before-upload="beforeAvatarUpload">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传</el-button>
                </el-upload>
            </div>
            <div class="ui-tip_area">
                <p>温馨提示：仅支持<strong> ".csv"</strong>文件</p>
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
        getServerOptionList
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
                    product: [],
                    project: []
                },

                optionList: {
                    productList: [],
                    projectList: [],
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

                saveDefaultMonth: [],

                //导入
                isImportShow: false,
                fileList: []
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
                'buttonList',
                'serverCostsInfo'
            ]),
            uploadUrl() {
                return importApi['IMPORT_SERVER_COST_INFO'];
            },
//            buttonList() {
//                return config.AUTHORITY_BUTTON[component_name].buttonList;
//            }
        },
        methods: {
            ...mapActions([
                'GetServerCostsInfo'
            ]),
            autoAddTableInx,


            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['server_cost']);
                }

                let obj = {
                    month_start: this.queryData.month && this.queryData.month[0] || '',
                    month_end: this.queryData.month && this.queryData.month[1] || '',
                    product: this.queryData.product.join(','),
                    project: this.queryData.project.join(','),
                };

                obj = Object.assign(params || {}, obj);

                this.GetServerCostsInfo(obj).then(({ data }) => {
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
                this.queryData.product = [];
                this.queryData.project = [];
            },

            //导入
            handleImportInfo() {
                this.isImportShow = true;
            },

            //选取文件
            handleChangeFileInfo(file) {
                this.fileList = [file];
            },

            //校验文件
            beforeAvatarUpload(file) {
                return new Promise((resolve, reject) => {
                    const isType = file.name.substring(file.name.lastIndexOf('.') + 1, file.name.length);
                    const isTrueType = ['csv'].indexOf(isType) > -1;
                    if (!isTrueType) {
                        this.$message.error(`仅支持“.csv”文件`);
                        return reject(false)
                    }
                    return resolve(true);
                });
            },

            submitUpload() {
                this.$refs.upload.submit();
            },

            //导入成功回调
            handleSuccessCallBack(data) {
                if(data.status) {
                    this.isImportShow = false;
                    this.$message.success('上传成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$refs.upload.clearFiles();
                    this.$message.error(data.errorMess || '上传失败');
                }
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
                window.open('/financereport/Finance_report/exportFailData', '_self');
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'server_cost',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...Object.values(data.title)];
                this.tableProps = ['index', ...Object.keys(data.title)];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.data;
                });
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'index') return '60';
                    if (item === 'prod_code'|| item === 'time_unit'|| item === 'jf_mode'|| item === 'unit_price_dw'|| item === 'yl_unit'|| item === 'currency'|| item === 'fee_month') return '80';
                    if (item === 'public_ip'|| item === 'private_ip'|| item === 'region'|| item === 'dkl_ri') return '120';
                    if (item === 'update_date'|| item === 'prod_item_name'|| item === 'case_gg'|| item === 'jf_term'|| item === 'case_label') return '140';
                    if (item === 'account_id'|| item === 'owner_id'|| item === 'available_area'|| item === 'czkzf'|| item === 'unit_price'|| item === 'yl'|| item === 'case_dk'|| item === 'price'|| item === 'yh_price'|| item === 'yhq_dk'|| item === 'yf_price'|| item === 'xj_payment'|| item === 'xjq_dk'|| item === 'qf_price') return '150';
                    if (item === 'case_id'|| item === 'case_name') return '180';
                    if (item === 'case_pz') return '220';
                    return '100';
                });
                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.page * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getServerOptionList().then(({ data }) => {
                    this.optionList.productList = data.product_data;
                    this.optionList.projectList = data.project_data;
                });
                getMonthRange().then(( data ) => {
                    this.saveDefaultMonth = [data.start, data.end];
                    if (JSON.stringify(this.serverCostsInfo) === '{}') {
                        this.queryData.month = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['server_cost']);
                        this.handleQueryInfoCallBack(this.serverCostsInfo);
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">
    /deep/.el-upload-list__item-name {
        white-space: normal;
        font-size: 12px;
    }

    //去除文件动画效果
    /deep/ .el-list-enter-active,
    /deep/ .el-list-leave-active {
        transition: none;
    }

    .el-select-dropdown__item {
        float: left!important;
        width: 160px;
    }

</style>
