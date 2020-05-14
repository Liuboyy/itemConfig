<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="平台账号">
                            <el-select size="small" v-model="queryData.platformAccount" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.platformAccountList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="账号简称">
                            <el-select size="small" v-model="queryData.sortName" filterable v-filter multiple collapseTags>
                                <el-option v-for="item in optionList.sortNameList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="刊登网站">
                            <el-select size="small" v-model="queryData.website" filterable v-filter clearable>
                                <el-option v-for="item in optionList.websiteList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台产品线">
                            <el-select size="small" v-model="queryData.productLine" filterable v-filter clearable>
                                <el-option v-for="item in optionList.productLineList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="店铺指数">
                            <el-select size="small" v-model="queryData.shopIndex" filterable v-filter clearable>
                                <el-option v-for="item in optionList.shopIndexList"
                                           :key="item.value"
                                           :value="item.value"
                                           :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <!--<li>-->
                        <!--<SearchRequirement label="更新时间" v-model="queryData.updateTime" template="daterange" clearable>-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
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
                :tableWidth="['80']"
                :showSearch="showSearch">
            <template slot="store_metric" slot-scope="scope">
                <i class="ui-state_dot state_green" v-if="scope.row.store_metric === '正常'"></i>
                <i class="ui-state_dot state_orange" v-if="scope.row.store_metric === '过高'|| scope.row.store_metric === '過高'"></i>
                <i class="ui-state_dot state_red" v-if="scope.row.store_metric === '非常高'"></i>
                <span>{{scope.row.store_metric}}</span>
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
                title="数据导入"
                width="400px"
                class="ui-layout_edit-dialog"
                :visible.sync="isImportShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @close="isImportShow = false">
            <div>
                <ComUpload :url="uploadUrl" :upData="upData" label="选择文件"
                           @success="handleSuccessCallBack" success></ComUpload>
                <el-button size="small" @click="handleDownLoad"  style="margin-left: 10px">下载模板</el-button>
            </div>
        </el-dialog>

        <ComResultShow title="上传结果" :visible.sync="isResultShow" :processedNum="resultNum" :unProcessedNum=Number(0)></ComResultShow>

        <el-dialog
                title="上传结果"
                width="440px"
                class="ui-layout_edit-dialog ui-error_dialog"
                :visible.sync="isErrorShow"
                @close="isErrorShow = false">
            <div>
                <p>{{errorData.error_Mess}}</p>
                <ul>
                    <li v-for="item in errorData.error_list">
                        <span>{{item}}</span>
                    </li>
                </ul>

            </div>
            <div class="dialog-footer" slot="footer">
                <el-button size="small" @click="isErrorShow = false">关闭</el-button>
                <el-button size="small" @click="handleCopyInfo(errorData.error_list)" type="primary">复制店铺</el-button>
            </div>
        </el-dialog>

    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        makeCopy
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getServiceIndexSnadInfo,
        getOptionList,
        getBatchDeleteInfo
    } from '@/api/customer_service_module/service_index_snad';

    import {
        getPreDateRange,
    } from '@/api/common/date_format'

    import * as importApi from '@/api/import_api/index';

    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'service_index_snad';

    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    platformAccount: [],
                    sortName: [],
                    website: '',
                    productLine: '',
                    shopIndex: '',
                    updateTime: [],
                },

                optionList: {
                    platformAccountList: [],
                    sortNameList: [],
                    websiteList: [],
                    productLineList: [],
                    shopIndexList: [],
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

                saveDefaultDate: [],
                saveCheckInfo: [],

                //数据导入
                isImportShow: false,
                //导入结果
                isResultShow: false,
                isErrorShow: false,
                errorData: {},
                resultNum: 0
            }

        },
        computed: {
            ...mapGetters([
                'loginInfo',
                'queryParamsInfo',
                'statisticalReport'
            ]),
            uploadUrl() {
                return `${config.BI_PATH2}/yibai/zhiku/ebay_customer_service/upload_store_file_snad/upload/`
            },
            upData() {
                return {
                    current_user: this.loginInfo.login_name,
                    user_id: this.loginInfo.staff_code
                }
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
            getServiceIndexSnadInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['service_index_snad']);
                }

                let obj = {
                    ...params,
                    account_id1: this.queryData.platformAccount.join(','),
                    account_id2: this.queryData.sortName.join(','),
                    listing_site: this.queryData.website,
                    snad_type: this.queryData.productLine,
                    store_metric: this.queryData.shopIndex,
                    start_date: this.queryData.updateTime && this.queryData.updateTime[0],
                    end_date: this.queryData.updateTime && this.queryData.updateTime[1],
                };

                obj = Object.assign(params || {}, obj);

                this.getServiceIndexSnadInfo(obj).then(({ data }) => {
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
                    platformAccount: [],
                    sortName: [],
                    website: '',
                    productLine: '',
                    shopIndex: '',
                    updateTime: [],
                };
            },

            //获取勾选数据
            handleCheckInfo(val) {
                this.saveCheckInfo = val;
            },

            //批量删除
            handleDeleteInfo() {

                this.$confirm('确认要清空所有数据吗？', '提示', {
                    type: 'warning'
                }).then(() => {
                    getBatchDeleteInfo().then(({ data }) => {
                        if (data.status) {
                            this.$message.success('操作成功');
                            this.handleQueryInfo({limit: this.pageData.currentList})
                        }else {
                            this.$message.error(data.errorMess || data.error_Mess || '操作失败');
                        }
                    })
                }).catch((err) => {
                    console.log(err)
                });

//                this.$confirm(`确定要删除选中的${this.saveCheckInfo.length}条数据？`, '提示', {
//                    type: 'warning'
//                }).then(() => {
//
//                    let account_list = [];
//                    for (let i = 0; i < this.saveCheckInfo.length; i++) {
//                        account_list.push({
//                            account_name: this.saveCheckInfo[i].account_name,
//                            listing_site: this.saveCheckInfo[i].listing_site,
//                            snad_type: this.saveCheckInfo[i].snad_type,
//                        })
//                    }
//                    getBatchDeleteInfo({ account_list: account_list }).then(({ data }) => {
//                        this.handleOperationCallBack(data);
//                    })
//                }).catch(() => {
//                    this.handleQueryInfo({limit: this.pageData.currentList});
//                })
            },

            //数据导入
            handleImportInfo() {
                if(this.tableData.length > 0) {
                    this.$message.warning('请先清空数据，再进行导入！');
                    return;
                }
                this.isImportShow = true;
            },
            //导入成功回调
            handleSuccessCallBack(data) {
                this.isImportShow = false;
                if(data.status === 2) {
                    this.$message.error(data.errorMess || data.error_Mess || '操作失败');
                } else if(data.status === 3) {
                    this.isErrorShow = true;
                    this.errorData = data;
                }else {
                    this.isResultShow = true;
                    this.resultNum = data.insert_count;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }
            },
            //复制店铺
            handleCopyInfo(name) {
                makeCopy(name).then(() => {
                    this.$message.success('复制成功');
                })
            },
            //下载模板
            handleDownLoad() {
                window.open(`${config.BI_PATH2}/yibai/zhiku/ebay_customer_service/upload_store_file_snad/download/`, '_self');
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
                    is_excel: 1,
                    total: this.pageData.currentTotal
                }, true)
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'service_index_snad',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index','account_name','account_short_name','listing_site','snad_type','store_metric','statis_date'];
                this.tableData = data.data;

                this.pageData.currentTotal = data.page_data.total * 1 ;
                this.pageData.currentList = data.page_data.limit * 1 ;
                this.pageData.currentPage = data.page_data.offset * 1 ;
            }
        },
        created() {
            this.thisVm = this;
            try{
                getOptionList({ module: 'store_snad' }).then(({ data }) => {
                    this.optionList.platformAccountList = data.categor_dict.account_list;
                    this.optionList.sortNameList = data.categor_dict.account_short_list;
                    this.optionList.websiteList = data.categor_dict.site_list;
                    this.optionList.productLineList = data.categor_dict.snad_type_list;
                    this.optionList.shopIndexList = data.categor_dict.store_metric_list;
                });
                this.handleQueryInfo();
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>

<style scoped lang="less">

    /deep/.ui-error_dialog .el-dialog__body {
        max-height: 400px!important;
        overflow: auto!important;
    }
</style>
