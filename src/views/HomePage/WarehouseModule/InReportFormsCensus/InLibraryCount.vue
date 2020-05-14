<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="仓库">
                            <el-select v-model="queryData.warehouse_name" filterable clearable placeholder="请选择" size="small">
                                <el-option
                                    v-for="(item,index) in optionList.warehouse_code"
                                    :key="index"
                                    :label="item.warehouse_name"
                                    :value="item.warehouse_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="存储属性">
                            <el-select v-model="queryData.stock_nature" filterable clearable placeholder="请选择" size="small">
                                <el-option
                                    v-for="(item,index) in optionList.stock_nature_list"
                                    :key="index"
                                    :label="item.stock_nature"
                                    :value="item.stock_nature"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="销售属性">
                            <el-select v-model="queryData.sale_nature" filterable clearable placeholder="请选择" size="small">
                                <el-option
                                    v-for="(item,index) in optionList.sale_nature_list"
                                    :key="index"
                                    :label="item.stock_nature"
                                    :value="item.stock_nature"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo({offset:pageData.currentList,page:'1'})"
                               icon="icon-chaxun">查询
                    </el-button>
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
             @checked="checked"
            :showSearch="showSearch"
            :tableKey="tableKey"
            :tableProps="tableProps"
            :tableData="tableData"
            :tableWidth="tableWidth">
            <template slot="30" slot-scope="scope">
                <p>{{scope.row.stockage_xy_30}}</p>
                <p>{{scope.row.stockage_xy_30_bi}}</p>
            </template>
            <template slot="60" slot-scope="scope">
                <p>{{scope.row.stockage_xy_60}}</p>
                <p>{{scope.row.stockage_xy_60_bi}}</p>
            </template>
            <template slot="90" slot-scope="scope">
                <p>{{scope.row.stockage_xy_90}}</p>
                <p>{{scope.row.stockage_xy_90_bi}}</p>
            </template>
            <template slot="180" slot-scope="scope">
                <p>{{scope.row.stockage_xy_180}}</p>
                <p>{{scope.row.stockage_xy_180_bi}}</p>
            </template>
            <template slot="270" slot-scope="scope">
                <p>{{scope.row.stockage_xy_270}}</p>
                <p>{{scope.row.stockage_xy_270_bi}}</p>
            </template>
            <template slot="360" slot-scope="scope">
                <p>{{scope.row.stockage_xy_360}}</p>
                <p>{{scope.row.stockage_xy_360_bi}}</p>
            </template>
            <template slot="360X" slot-scope="scope">
                <p>{{scope.row.stockage_dy_360}}</p>
                <p>{{scope.row.stockage_dy_360_bi}}</p>
            </template>
        </ComTableInfo>
        <!-- 分页 -->
        <div class="ui-main-module-page">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="pageData.currentPage"
                :page-sizes="pageSizes"
                :page-size="pageData.currentList"
                layout="total, sizes, prev, pager, next, jumper"
                :total="pageData.currentTotal">
            </el-pagination>
        </div>

    </div>
</template>
<script>
    import {} from '@/services';
    import axios from 'axios';
    import config from '@/assets/js/config';
    import {
        mapActions,
        mapGetters
    } from 'vuex';
     import {
        getLableInfo,
        getOptionList
    } from '../../../../api/warehouse_module/InLibraryCount'
    // 组件名称，用于keep-alive和权限
    const component_name = 'in_library_count';
    export default {
        name: component_name,
        data() {
            return {
                 // 初始化实例对象
                thisVm: {},

                showSearch: true,
                queryData: {
                    warehouse_name:'',//仓库  
                    stock_nature:'',//仓库属性  
                    sale_nature:'',// 销售属性
                },
                optionList: {
                    warehouse_code: [],
                    stock_nature_list:[],
                    sale_nature_list:[],
                },
                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                // 新增 
                checkedId:[],
                
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {

            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    warehouse_name:'',//仓库  
                    stock_nature:'',//仓库属性  
                    sale_nature:'',// 销售属性
                }
            },
            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1,
                }, true)
            },
            checked(val){
                let arrId=[]
                val.forEach(item => {
                    arrId.push(item.id)
                });
                this.checkedId=arrId;
            },
           
            _getInfo(){
                getOptionList().then(({data})=>{
                    if(data.status=='200'){
                        this.optionList.warehouse_code=data.warehouse_code;
                        this.optionList.sale_nature_list =data.sale_nature_list ;
                        this.optionList.stock_nature_list=data.stock_nature_list
                    }else{
                        this.$message.error(data.msg || '操作失败');
                    }
                })
            },
            // 查询
            handleQueryInfo(params){
                let obj = {
                    ...this.queryData,
                };
                // obj.source_password = obj.source_password ? passwordEncryption(obj.source_password) :'';
                obj = Object.assign(obj || {}, params);

                getLableInfo(obj).then(({data}) => {
                    if(data.status=='2'){
                        return 
                    }
                    if(data.status=='200'){
                        this.handleQueryInfoCallBack(data);
                    }else{
                        this.$message.error(data.msg || '操作失败');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

           

           

            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    offset: val,
                    page: 1
                }, true)
            },
            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    offset: this.pageData.currentList,
                    page: val
                }, true)
            },

            // 操作回调
            handleOperationCallBack(data){
                if(data.status=='200'){
                    this.$message.success('操作成功');
                    this.handleQueryInfo({offset: this.pageData.currentList, page: this.pageData.currentPage});
                }else{
                    // this.addData.source_password = passwordDecryption(this.addData.source_password)
                    this.$message.error(data.info || '操作失败');
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){
                //数据渲染
               
                this.tableData =data.data_list;
                this.tableKey = [ 'SKU', '仓库','可用库存', '销售属性', '存储属性', '库龄30天内数量和占比', '库龄30-60天内数量和占比', '库龄60-90天内数量和占比', '库龄90-180天内数量和占比', '库龄180-270天内数量和占比', '库龄270-360天内数量和占比',  '库龄超360天的数量和占比'];
                this.tableProps = ['sku','warehouse_name','avaliable_qty', 'sale_nature','stock_nature','30','60','90','180','270','360','360X'];
                this.tableWidth = ['','','','','','','','',''];

                //渲染分页
                this.pageData.currentList = data.total_list[0].page_num * 1;
                this.pageData.currentPage = data.total_list[0].page * 1;
                this.pageData.currentTotal = data.total_list[0].total_num * 1;
            }
        },
        created(){
             this.thisVm = this;
            this.handleQueryInfo({
                offset: this.pageData.currentList,
                page: this.pageData.currentPage
            })
            this._getInfo();
        }
    }
</script>
<style lang="less" scoped>

</style>
