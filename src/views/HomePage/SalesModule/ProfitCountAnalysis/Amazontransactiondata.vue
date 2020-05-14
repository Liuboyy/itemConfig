<template>
  <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="账号">
                            <el-select size="small" v-model="queryData.account_number" v-filter filterable collapseTags multiple>
                                <el-option v-for="item in optionList.accountNameList"
                                           :key="item.id"
                                           :value="item.id"
                                           :label="item.account_name"></el-option>
                            </el-select>
                    </SearchRequirement>
                </li>
                <li>
                        <SearchRequirement  v-model="queryData.summary_type" label="统计类型" template="select" :options="optionList.countTypeList">
                        </SearchRequirement>
                </li>
                <li v-if="queryData.summary_type == 'd'">
                    <SearchRequirement label="统计日期">
                        <el-date-picker
                                        size="small"
                                        v-model="queryData.date"
                                        :clearable="false"
                                        type="date"
                                        placeholder="选择日期"
                                        format="yyyy-MM-dd"
                                        value-format="yyyy-MM-dd"></el-date-picker>
                    </SearchRequirement>
                </li>
                <li v-if="queryData.summary_type == 'm'">
                    <SearchRequirement label="统计月份">
                        <el-date-picker
                                        :clearable="false"
                                        size="small"
                                        v-model="queryData.date"
                                        type="month"
                                        placeholder="选择月"
                                        format="yyyy-MM"
                                        value-format="yyyy-MM"
                        ></el-date-picker>
                    </SearchRequirement>
                </li>
            </ul>
            <FilterBtn
                      refTable="myTable"
                      :query-fn="handleQueryInfo"
                      :reset-fn="handleResetQueryInfo"
                      :params="{}">
            </FilterBtn>
        </div>
    </transition>
      <div class="ui-fn-module">
        <span class="ui-top_i" @click="showSearch = !showSearch">
            <ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon>
        </span>
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
                       :tableMinWidth="tableMinWidth"
                       :showSearch="showSearch">
            <template slot="description" slot-scope="scope">
            <el-popover
                       v-if="scope.row.description && scope.row.description.length > 85"
                       placement="right-start"
                       width="500"
                       trigger="hover">
                <span>{{scope.row.description}}</span>
                <span slot="reference">{{scope.row.description.length > 85 ? scope.row.description.substring(0,85) + '...':scope.row.description}}</span>
            </el-popover>
            <span v-else>{{scope.row.description}}</span>
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
                       :total="pageData.currentTotal"></el-pagination>
    </div>
        <el-dialog
                       title="导入"
                       width="480px"
                       class="ui-layout_edit-dialog"
                       :visible.sync="isImportShow"
                       :close-on-click-modal="false"
                       :close-on-press-escape="false"
                       @close="handleCloseInfo">
      <div>
        <el-form labelWidth="100px" ref="importObj" :model="importObj">
            <el-form-item label="账号站点">
                <el-select size="small" v-model="importObj.account" v-filter filterable>
                    <el-option
                            v-for="item in optionList.accountList"
                            :key="item.account_id"
                            :value="item.account_id"
                            :label="item.account_name">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="月份">
                <el-date-picker
                            :clearable="false"
                            size="small"
                            v-model="importObj.month"
                            type="month"
                            placeholder="选择月"
                            format="yyyy-MM"
                            value-format="yyyy-MM">
                </el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-upload
                        ref="upload"
                        :action="uploadUrl"
                        :data="upData"
                        :auto-upload="false"
                        :file-list="fileList"
                        :on-change="handleChangeFileInfo"
                        :on-success="handleSuccessCallBack">
                    <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
                    <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">确定上传</el-button>
                    <div slot="tip" class="el-upload__tip">仅支持亚马逊源头下载文件</div>
                </el-upload>
                <!--<ComUpload ref="upload" :url="uploadUrl" :upData="upData" :autoUpload=false-->
                           <!--@success="handleSuccessCallBack" label="选择文件" success></ComUpload>-->
            </el-form-item>
        </el-form>
      </div>
      <div class="ui-tip_area">
        <!--<p>温馨提示：仅支持亚马逊源头下载文件</p>-->
      </div>
    </el-dialog>
  </div>
</template>

<script>
    import config from "@/assets/js/config";
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        getThirtyDayDateRange
    } from "@/services/index";
    import {
        mapActions, 
        mapGetters 
    } from "vuex";
    
    import { 
        getCurrentDate, 
        getCurrentMonth 
    } from "@/api/common/date_format";
    
    import {
        getDropDownList,
        getAccountList,
        getAmazontransactiondata
    } from "@/api/sales_module/amazon_transaction_data";
    
    
    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = "amazon_transaction_data";
    
    export default {

        name: component_name,
        data() {
           return {
               thisVm: {},

               // 搜索缩进
               showSearch: true,

               children: [],

               queryData: {
                   date: "",
                   summary_type: "d",
                   account_number: []
               },

               //保存默认日期
               saveDefaultDate: [],
               saveDefaultMonth: [],

               optionList: {
                   countTypeList: {
                       d: "日",
                       m: "月"
                   },
                   accountList: [],
                   accountNameList: [],
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
                   currentTotal: 0
               },

               //导入
               isImportShow: false,
               importObj: {
                   account: '',
                   month: '',
               },
               importRules: {
                   account: [
                       {
                           required: true,
                           message: '带*号不能为空',
                           trigger: 'change'
                       }
                   ],
                   month: [
                       {
                           required: true,
                           message: '带*号不能为空',
                           trigger: 'change'
                       }
                   ]
               },
               fileList: []
           }
        },
        computed: {
            ...mapGetters(["queryParamsInfo", 'loginInfo']),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            },
            uploadUrl() {
                return `${config.BI_PATH}/yibai/zhiku/amazonreturn/upload`;
//                return 'http://192.168.71.162:8802/yibai/zhiku/amazonreturn/upload';
            },
            accountName() {
                let name = '';
                this.optionList.accountList.map(item => {
                    if (item.account_id === this.importObj.account) {
                      name = item.account_name
                    }
                });
                return name;
            },
            upData() {
                return {
                    user_number: this.loginInfo.staff_code,
                    account_id: this.importObj.account,
                    account_name: this.accountName,
                    report_date: this.importObj.month,
                }
            }
        },
        methods: {
            ...mapActions(["Fn"]),
            autoAddTableInx,
            getDefaultTime,
            // getAmazonReturnOrderAccountInfo,
            // getAmazonReturnOrderSiteInfo,

            // 列表信息查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(
                        this.queryParamsInfo["amazon_transaction_data"]
                    );
                }

                let obj = {
                    account_id: this.queryData.account_number.join(','),
                    report_date: this.queryData.date,
                    date_type: this.queryData.summary_type,
                    ...params
                };

                getAmazontransactiondata(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    } else {
                        this.$message.error(data.errorMess || "查询失败！");
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.account_number = [];
                this.queryData.summary_type = "d";
                this.queryData.date = this.saveDefaultDate;
            },

            handleTabClick(tab) {
                this.handleQueryInfo();
            },

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo(
                    {
                        limit: val,
                        offset: 1
                    },
                    true
                );
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo(
                    {
                        limit: this.pageData.currentList,
                        offset: val
                    },
                    true
                );
            },

            //导入
            handleImportInfo() {
                this.isImportShow = true;
                getAccountList().then(({ data }) => {
                    this.optionList.accountList = data.data_list
                })
            },

            //选取文件
            handleChangeFileInfo(file) {
                this.fileList = [file];
            },

            submitUpload() {
                if(!this.importObj.account || !this.importObj.month) {
                    this.$message.warning('请填写账号站点和月份后再提交！');
                    return;
                }
                this.$refs.upload.submit();
            },

            //导入成功回调
            handleSuccessCallBack(data) {
                if(data.status) {
                    this.$message.success('上传成功');
                    this.handleCloseInfo();
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '上传失败');
                }
            },
            //取消
            handleCloseInfo() {
                this.isImportShow = false;
                this.importObj.account = '';
                this.importObj.month = '';
                this.fileList = [];
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo(
                    {
                        is_excel: 1,
                        total_count: this.pageData.currentTotal
                    },
                    true
                );
            },

            // 操作回调
            handleOperationCallBack(data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success("操作成功！");
                    this.handleQueryInfo({ limit: this.pageData.currentList });
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || "操作失败！");
                    errorFn && errorFn();
                }
            },

            //查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
                    key: "amazon_transaction_data",
                    value: JSON.stringify(this.queryData)
                });

                this.tableData = data.data;
                this.tableKey = ['序号', ...data.title];
                this.tableProps = ['index','account_id', 'account_name','data_time', 'settlement_id','types','order_id','sku', 'description','quantity','market_place',  'fulfillment','order_city','order_state', 'order_postal','product_sales','product_sales_tax', 'shipping_credits','shipping_credits_tax', 'gift_wrap_credits','giftwrap_credits_tax', 'promotional_rebates','promotional_rebates_tax', 'sales_tax_collected','tcs_cgst','tcs_sgst', 'tcs_igst','amazon_integral','selling_fees', 'fba_fees','other_transaction_fees', 'low_value_goods','other','total','marketplace_withheld_tax'];
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'index') return '60';
                    if (item === 'shipping_credits') return '100';
                    if (item === 'tcs_sgst') return '110';
                    if (item === 'account_name'|| item === 'product_sales_tax'||item === 'shipping_credits_tax'|| item === 'tcs_cgst'|| item === 'tcs_igst'|| item === 'settlement_id'|| item === 'sku') return '120';
                    if (item === 'order_id'|| item === 'sales_tax_collected'|| item === 'data_time') return '150';
                    if (item === 'description') return '300';
                    return '90';
                })

                this.pageData.currentTotal = data.page_data.total * 1;
                this.pageData.currentList = data.page_data.limit * 1;
                this.pageData.currentPage = data.page_data.offset * 1;
            }
        },
        created() {
            this.thisVm = this;
            try {
                getDropDownList().then(({ data }) => {
                    this.optionList.accountNameList = data.account;
                });
                getCurrentMonth().then(data => {
                    this.saveDefaultMonth = data.month;
                    getCurrentDate().then(data => {
                        this.saveDefaultDate = data.date;
                        this.queryData.date = data.date;
                        this.handleQueryInfo();
                    });
                });


            } catch (e) {
                console.log(e);
            }
        },
        watch: {
            "queryData.summary_type"(val) {
                if (val && val === "m") {
                    this.queryData.date = this.saveDefaultMonth;
                } else {
                    this.queryData.date = this.saveDefaultDate;
                }
            }
        }
    };
</script>

<style lang="less" scoped>
/deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
  margin-top: 0 !important;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: 0 !important;
}

/deep/.el-table__indent {
  padding-left: 10px !important;
}

    .el-upload__tip {
        color: #ff9900;
    }

    /deep/.el-upload-list__item-name {
        white-space: normal;
        font-size: 12px;
    }

    //去除文件动画效果
    /deep/ .el-list-enter-active,
    /deep/ .el-list-leave-active {
        transition: none;
    }
</style>
