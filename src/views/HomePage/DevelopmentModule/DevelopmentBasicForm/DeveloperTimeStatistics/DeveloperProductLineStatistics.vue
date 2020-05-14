<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="统计时间"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="一级产品线">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.productLine">
                                <el-option
                                        v-for="item in optionList.productLineList"
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
        getPreDateRange,
        validTime
    } from '../../../../../api/common/date_format'



    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},


                queryData: {
                    createTime: [],
                    productLine: '',
                    developmentType: '1'
                },
                optionList: {
                    productLineList: [],
                    developmentTypeList: []
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'developerProductLineCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetDeveloperProductLineCountInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.productLine = '';
                this.queryData.developmentType = '1';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['developer_product_line_statistics']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.createTime && this.queryData.createTime[0],
                    end_date: this.queryData.createTime && this.queryData.createTime[1],
                    product_line: this.queryData.productLine,
                    develop_type: this.queryData.developmentType,
                };

                obj = Object.assign(obj || {}, params);

                this.GetDeveloperProductLineCountInfo(obj).then(({ data}) => {
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

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.category_name_level_1 == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'developer_product_line_statistics',
                    value: JSON.stringify(this.queryData)
                });

                this.optionList.productLineList = data.list.group_one;
                this.optionList.developmentTypeList = data.list.develop_type;

                //数据渲染
                this.tableKey = data.list.key;
                this.tableData = data.list.value;

                switch (this.queryData.developmentType) {
                    case '1':
                        this.tableProps = ['category_name_level_1','avg_develop','avg_inspection','avg_copywriting','avg_photo','avg_art_design1','avg_art_design2','avg_tort_audit','avg_final_instance'];
                        break;
                    case '2':
                        this.tableProps = ['category_name_level_1','avg_develop','avg_copywriting','avg_photo','avg_art_design2','avg_tort_audit','avg_final_instance'];
                        break;
                    case '4':
                        this.tableProps = ['category_name_level_1','avg_develop','avg_copywriting','avg_art_design2','avg_tort_audit','avg_final_instance'];
                        break;
                    case '':
                        this.tableProps = ['category_name_level_1','avg_develop','avg_inspection','avg_copywriting','avg_photo','avg_art_design1','avg_art_design2','avg_tort_audit','avg_final_instance'];
                        break;
                }
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.developerProductLineCountInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['developer_product_line_statistics']);
                        this.handleQueryInfoCallBack(this.developerProductLineCountInfo);
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

</style>
