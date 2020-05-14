<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <!--<li>-->
                        <!--<SearchRequirement-->
                                <!--label="统计时间"-->
                                <!--template="daterange"-->
                                <!--v-model="queryData.date">-->
                        <!--</SearchRequirement>-->
                    <!--</li>-->
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select
                                    @change="handleChangeProductLineOne"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.productLineOne">
                                <el-option
                                        v-for="item in optionList.productLineOneList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="二级产品线">
                            <el-select
                                    :disabled="queryData.productLineOne == ''"
                                    @change="handleChangeProductLineTwo"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.productLineTwo">
                                <el-option
                                        v-for="item in optionList.productLineTwoList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="三级产品线">
                            <el-select
                                    :disabled="queryData.productLineTwo == ''"
                                    @change="handleChangeProductLineTree"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.productLineThree">
                                <el-option
                                        v-for="item in optionList.productLineThreeList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="四级产品线">
                            <el-select
                                    :disabled="queryData.productLineThree == ''"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.productLineFour">
                                <el-option
                                        v-for="item in optionList.productLineFourList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.developmentType">
                                <el-option
                                        v-for="item in optionList.developmentTypeList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
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
                :otherHeight="['el-tabs__header']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :cellStyle="cellStyle"
                :showSearch="showSearch">
        </ComTableInfo>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getPreDateRange
    } from '../../../../../api/common/date_format'

    import {
        getProductLineList
    } from '../../../../../api/common/index'



    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},


                queryData: {
                    date: [],
                    productLineOne: '',
                    productLineTwo: '',
                    productLineThree: '',
                    productLineFour: '',
                    developmentType: ''
                },
                optionList: {
                    productLineOneList: [],
                    productLineTwoList: [],
                    productLineThreeList: [],
                    productLineFourList: [],
                    developmentTypeList: []
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],
                //保存开发类型
                saveDevType: '',
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'developerLineNumberCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetDeveloperLineNumberCountInfo',
            ]),
            getPreDateRange,
            getProductLineList,


            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    date: this.saveDefaultDate,
                    productLineOne: '',
                    productLineTwo: '',
                    productLineThree: '',
                    productLineFour: '',
                    developmentType: ''
                }
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['developer_line_number_statistics']);
                }
                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    product_line_one: this.queryData.productLineOne,
                    product_line_two: this.queryData.productLineTwo,
                    product_line_three: this.queryData.productLineThree,
                    product_line_four: this.queryData.productLineFour,
                    develop_type: this.queryData.developmentType,
                };

                obj = Object.assign(obj || {}, params);

                this.GetDeveloperLineNumberCountInfo(obj).then(({ data}) => {
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

            //获取产品线
            handleChangeProductLineOne(val) {
                if (!this.queryData.productLineOne || val) {
                    this.queryData.productLineTwo = '';
                    this.queryData.productLineThree = '';
                    this.queryData.productLineFour = '';
                }
                this.getProductLineList({
                    product_line_one: val
                }).then(({ data }) => {
                    this.optionList.productLineTwoList = data.list;
                    this.handleSaveOptionList();
                })
            },
            handleChangeProductLineTwo(val) {
                if (!this.queryData.productLineTwo || val) {
                    this.queryData.productLineThree = '';
                    this.queryData.productLineFour = '';
                }
                this.getProductLineList({
                    product_line_one: this.queryData.productLineOne,
                    product_line_two: val
                }).then(({ data }) => {
                    this.optionList.productLineThreeList = data.list;
                    this.handleSaveOptionList();
                })
            },
            handleChangeProductLineTree(val) {
                if (!this.queryData.productLineThree || val) this.queryData.productLineFour = '';
                this.getProductLineList({
                    product_line_one: this.queryData.productLineOne,
                    product_line_two: this.queryData.productLineTwo,
                    product_line_three: val
                }).then(({ data }) => {
                    this.optionList.productLineFourList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'line_count',
                    value: this.optionList
                })
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

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                }, true)
            },

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.category_name_level_1 === '小计'|| row.row.category_name_level_2 === '小计'||
                    row.row.category_name_level_3 === '小计'|| row.row.category_name_level_4 === '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'developer_line_number_statistics',
                    value: JSON.stringify(this.queryData)
                });

                this.optionList.productLineOneList = data.list.group_one;
                this.optionList.developmentTypeList = data.list.develop_type;

                //数据渲染

                this.tableKey = data.list.key;
                this.tableData = data.list.value;

                let props = [];
                if(this.tableKey.indexOf('二级产品线') > -1) props = ['category_name_level_2'];
                if(this.tableKey.indexOf('三级产品线') > -1) props = ['category_name_level_2','category_name_level_3'];
                if(this.tableKey.indexOf('四级产品线') > -1) props = ['category_name_level_2','category_name_level_3','category_name_level_4'];
                this.tableProps = ['category_name_level_1', ...props, 'develop_num','inspection_num','copywriting_num','photo_num','art_design_num','tort_audit_num','final_instance_num'];
            }
        },
        created(){
            this.thisVm = this;
            try{
                this.getPreDateRange().then((data) => {
                    this.saveDefaultDate = [data.start, data.end];
                    if (JSON.stringify(this.developerLineNumberCountInfo) === '{}') {
                        this.queryData.date = this.saveDefaultDate;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['developer_line_number_statistics']);
                        this.handleQueryInfoCallBack(this.developerLineNumberCountInfo);
                        if(this.comOptions['line_count']) this.optionList = this.comOptions['line_count'];
                    }
                })
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

</style>
