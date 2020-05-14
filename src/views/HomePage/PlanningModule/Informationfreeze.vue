<template>
  <div class="ui-main-module">
    <transition name="slide-fade">
      <div class="ui-search-area" v-show="showSearch">
        <ul class="ui-main-module-search clearFix">
          <li>
            <SearchRequirement label="sku">
              <el-input size="small" placeholder="多个查询用英文 ',' 隔开" v-model="queryData.sku_code"></el-input>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="产品名">
              <el-input size="small" placeholder="请输入" v-model="queryData.product_name"></el-input>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="产品线">
              <el-select        
                size="small"
                v-model="queryData.product_line"
                filterable
                v-filter
                collapseTags
                multiple
              >
                <el-option
                  v-for="item in optionList.productline"
                  :key="item.id"
                  :value="item.id"
                  :label="item.linelist_cn_name"
                ></el-option>
              </el-select>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="开发类型">
              <el-select
                size="small"
                v-model="queryData.develop_type"
                filterable
                v-filter
                collapseTags
                multiple
              >
                <el-option
                  v-for="item in optionList.developmenttype"
                  :key="item.d_id"
                  :value="item.d_id"
                  :label="item.d_name"
                ></el-option>
              </el-select>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="sku状态">
              <el-select
                size="small"
                v-model="queryData.sku_status"
                filterable
                v-filter
                collapseTags
                multiple
              >
                <el-option
                  v-for="item in optionList.skustatus"
                  :key="item.d_id"
                  :value="item.d_id"
                  :label="item.d_name"
                ></el-option>
              </el-select>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="货源状态">
              <el-select
                size="small"
                v-model="queryData.source_status"
                filterable
                v-filter
                collapseTags
                multiple
              >
                <el-option
                  v-for="item in optionList.Sourcingtatus"
                  :key="item.d_id"
                  :value="item.d_id"
                  :label="item.d_name"
                ></el-option>
              </el-select>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="供应商状态">
              <el-select
                size="small"
                v-model="queryData.supplier_status"
                filterable
                v-filter
                collapseTags
                multiple
              >
                <el-option
                  v-for="item in optionList.supplierstatus"
                  :key="item.d_id"
                  :value="item.d_id"
                  :label="item.d_name"
                ></el-option>
              </el-select>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="加权日均销量">
              <el-row>
                <el-col :span="11">
                  <el-input size="small" placeholder="请输入" v-model="queryData.sale_sum_start"></el-input>
                </el-col>
                <el-col :span="2">-</el-col>
                <el-col :span="11">
                  <el-input
                    size="small"
                    placeholder="请输入"
                    v-model="queryData.sale_sum_end"
                  ></el-input>
                </el-col>
              </el-row>
            </SearchRequirement>
          </li>
          <li>
            <SearchRequirement label="最终需采购数量">
              <el-row>
                <el-col :span="11">
                  <el-input size="small" placeholder="请输入" v-model="queryData.sale_need_start"></el-input>
                </el-col>
                <el-col :span="2">-</el-col>
                <el-col :span="11">
                  <el-input
                    size="small"
                    placeholder="请输入"
                    v-model="queryData.sale_need_end"
                  ></el-input>
                </el-col>
              </el-row>
            </SearchRequirement>
          </li>
        </ul>
        <FilterBtn
          :resetFn="handleResetQueryInfo"
          :queryFn="handleQueryInfo"
          refTable="tableArea"
          :params="{limit: pageData.currentList}"
        ></FilterBtn>
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
        @click="item.action(thisVm, item.method)"
      >{{item.name}}</el-button>
    </div>
    <ComTableInfo
      ref="tableArea"
      :tableKey="tableKey"
      :tableProps="tableProps"
      :tableData="tableData"
      :tableMinWidth="tableMinWidth"
      :showSearch="showSearch"
    >
      <!-- <template :slot="item" slot-scope="scope" v-for="(item, i) in tableProps" v-if="i > 9">
        <span class="ui-link" @click="handleSee(scope.row)">{{scope.row[item]}}</span>
      </template> -->
      <template slot="operation" slot-scope="scope" > 
        <span class="ui-link" @click="handleSee(scope.row)">查看seller_sku</span>
      </template>
    </ComTableInfo>

    <!-- <el-dialog :visible.sync="dialogVisible" width="800px" :before-close="handleClose" title="查看seller_sku">
        <ComPreviewTable  isButton isPage :tableData='dialog.data' :tableKey='dialog.key' :tableProps='dialog.props' tableHeight='400px'
         @export="handleExportDetailsInfo"  @dialogPageChange="handleDetailsPageChange" :dialogPageData="dialogPageData"></ComPreviewTable>
    </el-dialog> -->

    <ComDialogPreview
                isButton
                isPage
                title="查看seller_sku"
                :visible.sync="dialogVisible"
                :tableKey="dialog.key"
                :tableProps="dialog.props"
                :tableWidth="dialog.width"
                :tableData="dialog.data"
                :dialogPageData="dialogPageData"
                @dialogPageChange="handleDetailsPageChange"
                @export="handleExportDetailsInfo"></ComDialogPreview>

    <div class="ui-main-module-page ">
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
import config from "@/assets/js/config";
import { autoAddTableInx } from "@/services";
import { mapActions, mapGetters } from "vuex";

import {
  getInformationfreeze,
  getInformationList,
  getinformsellersku
} from "@/api/sales_module/Informationfreeze";

import { getPreDateRange } from "@/api/common/date_format";

import * as importApi from "@/api/import_api/index";

// 组件名称，用于keep-alive和权限（要跟路由保持一致）
const component_name = "information_freeze";

export default {
  name: component_name,
  data() {
    return {
      pickerOptions: "",
      // 初始化实例对象
      thisVm: {},

      //搜索缩进
      showSearch: true,

      queryData: {
        sku_code: "",
        product_name: "",
        product_line: [],
        develop_type: [],
        sku_status: [],
        source_status: [],
        supplier_status: [],
        sale_sum_start: "",
        sale_sum_end: "",
        sale_need_start: "",
        sale_need_end: ""
      },

      optionList: {
        productline: [],
        developmenttype: [],
        skustatus: [],
        Sourcingtatus: [],
        supplierstatus: [],
      },

      tableData: [],
      tableKey: [],
      tableProps: [],
      tableMinWidth: [],

      //分页
      pageSizes: config.pageData.pageSizes,
      pageData: {
        currentPage: 1,
        currentList: 20,
        currentTotal: 0
      },

      saveDefaultDate: [],
      saveCheckInfo: [],

      //导入
      isImportShow: false,
      isAuditResultShow: false,
      resultData: {},
      //提示语
      isPercentageShow: false,

      dialogVisible:false,
      dialog:{
          key: [],
          data: [],
          props: [],
          width: []
      },
      dialogPageData: {
        limit: 20,
        offset: 1,
        total: 0
      },
      
      saveData: {
          row: {},
          code: '',
          page: {}
      },
    };
  },
  computed: {
    ...mapGetters(["loginInfo", "queryParamsInfo"]),
    uploadUrl() {
      return importApi["IMPORT_PLATFORM_COST_INFO"];
    },
    buttonList() {
      return config.AUTHORITY_BUTTON[component_name].buttonList;
    }
  },
  methods: {
    ...mapActions(["Fn"]),
    autoAddTableInx,
    getInformationfreeze,

    // 列表信息查询
    handleQueryInfo(params, isFn) {
      // 判断是否为功能参数
      if (isFn) {
        // 获取保存的查询参数
        this.queryData = JSON.parse(
          this.queryParamsInfo["information_freeze"]
        );
      }
      if(this.queryData.sale_sum_start || this.queryData.sale_sum_end) {
        if(!this.queryData.sale_sum_start || !this.queryData.sale_sum_end) {
          this.$message.warning('请输入查询区间！');
          return;
        }
      }
      if(this.queryData.sale_need_start || this.queryData.sale_need_end) {
        if(!this.queryData.sale_need_start || !this.queryData.sale_need_end) {
          this.$message.warning('请输入查询区间！');
          return;
        }
      }
      if (this.queryData.sale_sum_start && this.queryData.sale_sum_end) {
        if(Number(this.queryData.sale_sum_start) > Number(this.queryData.sale_sum_end)) {
          this.$message.warning('开始值不能大于结束值')
          return
        }
      }
      if (this.queryData.sale_need_start && this.queryData.sale_need_end) {
        if(Number(this.queryData.sale_need_start) > Number(this.queryData.sale_need_end)) {
          this.$message.warning('开始值不能大于结束值')
          return
        }
      }
      let obj = {
        sku_code: this.queryData.sku_code,
        product_name: this.queryData.product_name,
        product_line: this.queryData.product_line.join(','),
        develop_type: this.queryData.develop_type.join(','),
        sku_status: this.queryData.sku_status.join(','),
        source_status: this.queryData.source_status.join(','),
        supplier_status: this.queryData.supplier_status.join(','),
        sale_sum_start: this.queryData.sale_sum_start,
        sale_sum_end: this.queryData.sale_sum_end,
        sale_need_start: this.queryData.sale_need_start,
        sale_need_end: this.queryData.sale_need_end,
      };

      obj = Object.assign(params || {}, obj);

      this.getInformationfreeze(obj).then(({ data }) => {
        if (data.status === 2) return;
        if (data.status) {
          this.handleQueryInfoCallBack(data);
        } else {
          this.$message.error(data.errorMess || "查询失败");
        }
      });
    },

    //查看操作
    handleSee(row) {
        this.dialogVisible=true
    },

    // 查询重置
    handleResetQueryInfo() {
      this.queryData = {
        sku_code: "",
        product_name: "",
        product_line: [],
        develop_type: [],
        sku_status: [],
        source_status: [],
        supplier_status: [],
        sale_sum_start: "",
        sale_sum_end: "",
        sale_need_start: "",
        sale_need_end: ""
      };
    },

    //获取查看弹框
     handleSee(row, page, params) {
         this.saveData.row = row;
         let obj = {
           sku_code: row.sku,
             ...page,
             ...params
      };
     getinformsellersku(obj).then(({ data }) => {
        if (data.status === 2) return;
        if (data.status) {
            this.dialogVisible = true;
            this.dialog.key = ['序号', ...Object.values(data.title)];
            this.dialog.props = ['index', ...Object.keys(data.title)];
            this.dialog.data = data.data;
            this.dialog.width = this.dialog.props.map(item =>{
              if(item === 'weight_sale_pcs') return '120'
            })
            this.dialogPageData.limit = data.page_data.limit * 1;
            this.dialogPageData.offset = data.page_data.offset * 1;
            this.dialogPageData.total = data.page_data.total * 1;
        }else {
                this.$message.error(data.errorMess || '操作失败');
            }
        })
    },

    //弹框分页
    handleDetailsPageChange({offset,limit}) {
        this.saveData.page = {offset,limit};
        this.handleSee(this.saveData.row, {offset, limit}, {})
    },

    //明细导出
    handleExportDetailsInfo() {
        this.handleSee(this.saveData.row, this.saveData.page, {is_excel: 1});
    },


    //操作回调
    handleOperationCallBack(data) {
      if (data.status) {
        this.$message.success("操作成功");
        if (this.isModifyShow) this.isModifyShow = false;
        this.handleQueryInfo({ limit: this.pageData.currentList });
      } else {
        this.$message.error(data.errorMess || "操作失败");
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
        total_count: this.pageData.currentTotal
      }, true)
    },

    // 查询回调
    handleQueryInfoCallBack(data) {

      // 保存查询参数
      this.$store.commit("SAVE_QUERY_PARAMS_INFO", {
        key: "information_freeze",
        value: JSON.stringify(this.queryData)
      });

      //渲染数据
      this.tableKey = ['序号', ... Object.values(data.title),'操作'];
      this.tableProps = ['index', ...Object.keys(data.title),'operation'];
      this.tableMinWidth = this.tableProps.map(item =>{
        if(item === 'index') return '80'
        if(item === 'operation') return '100'
        if(item === 'pr_qty') return '130'
        if(item === 'wait_pay_onway_qty') return '120'
        if(item === 'current_mrp_req_qty') return '140'
        if(item === 'other_allot_qty') return '110'
        if(item === 'ofter_allot_qty') return '120'
        if(item === 'final_pur_qty') return '120'
        if(item === 'statis_date') return '150'
      })

      this.tableData.splice(0);
      this.$nextTick().then(() => {
      this.tableData = data.data;
      });
      this.pageData.currentTotal = data.page_data.total * 1 ;
      this.pageData.currentList = data.page_data.limit * 1 ;
      this.pageData.currentPage = data.page_data.page * 1 ;
    }
  },
  created() {
    this.thisVm = this;
    try {
      getInformationList().then(({ data }) => {
        this.optionList.developmenttype = data.develop_type;
        this.optionList.productline = data.product_line;
        this.optionList.skustatus = data.sku_status;
        this.optionList.Sourcingtatus = data.source_data;
        this.optionList.supplierstatus = data.supplier_data;
      });
      this.handleQueryInfo();
    } catch (e) {
      console.log(e);
    }
  }
};
</script>

<style scoped lang="less">
@color: #ff9900;

/deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
  margin-top: 0;
}
/deep/.el-tabs--card > .el-tabs__header {
  border-bottom: 0;
}

.text-color {
  color: @color;
}

.ui-layout_edit-dialog {
  .ui-check_box {
    .el-checkbox + .el-checkbox {
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
/deep/ .ui-fn-module {
  margin: 0 15px 0 0;
  .el-button--small {
    padding-top: 15px;
  }

  .el-progress-bar__outer {
    background: #ffffff;
  }
  .el-progress-bar {
    width: 15%;
    float: right;
    margin-top: 10px;
  }

  .el-alert {
    float: right;
    height: 34px;
    line-height: 34px;
    width: 15%;
    margin-top: 1px;
  }
  .el-alert__title {
    color: #333333;
    font-weight: bold;
    font-size: 12px;
  }
  .el-alert--warning.is-light {
    background-color: #fffdf9;

    box-sizing: border-box;
  }

  .ui-tip_box {
    display: inline-block;
    width: 200px;
    height: 34px;
    line-height: 34px;
    float: right;
    font-size: 12px;
    font-weight: bold;
    background: #fffdf9;
    border: 1px solid #ffdda8;
    border-radius: 4px;
    padding-left: 5px;
    .icon-tishi1 {
      color: #f2ae3e;
      font-size: 16px;
    }
  }
}
</style>
