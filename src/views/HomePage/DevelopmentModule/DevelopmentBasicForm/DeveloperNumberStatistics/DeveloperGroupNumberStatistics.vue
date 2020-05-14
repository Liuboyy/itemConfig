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
                        <SearchRequirement label="开发一级小组">
                            <el-select
                                    @change="handleChangeGetGroup"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.oneTeam">
                                <el-option
                                        v-for="item in optionList.oneTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发二级小组">
                            <el-select
                                    @change="handleChangeGetStaff"
                                    :disabled="queryData.oneTeam == ''"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.secondTeam">
                                <el-option
                                        v-for="item in optionList.secondTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发人员">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.developer"
                                    :disabled="queryData.oneTeam == '' || queryData.secondTeam == ''">
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
                :tableWidth="tableWidth"
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
        getComSecondGroupByOneGroup,
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'



    export default {
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: '',
                    oneTeam: '',
                    secondTeam: '',
                    developer: '',
                    developmentType: ''
                },
                optionList: {
                    oneTeamList: [],
                    secondTeamList: [],
                    developerList: [],
                    developmentTypeList: []
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //合并
                spanArr: [],
                position: 0,
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'developerGroupNumberCountInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetDeveloperGroupNumberCountInfo',
            ]),
            getPreDateRange,
            getComSecondGroupByOneGroup,
            getComDeveloperBySecondGroup,


            // 重置
            handleResetQueryInfo(){
                this.queryData = {
                    date: this.saveDefaultDate,
                    oneTeam: '',
                    secondTeam: '',
                    developer: '',
                    developmentType: ''
                }
            },

            //获取二级小组
            handleChangeGetGroup(val) {
                if (!this.queryData.oneTeam || val) {
                    this.queryData.secondTeam = '';
                    this.queryData.developer = '';
                }
                this.getComSecondGroupByOneGroup({
                    group_type: 1,
                    group_id: val,
                }).then(({ data }) => {
                    if(data.status) {
                        this.optionList.secondTeamList = data.list;
                        this.handleSaveOptionList();
                    }
                })
            },

            //获取开发人员
            handleChangeGetStaff(val) {
                if (!this.queryData.secondTeam || val) this.queryData.developer = '';
                this.getComDeveloperBySecondGroup({
                    group_type: 1,
                    group_level: 2,
                    group_id: val,
                }).then(({ data }) => {
                    this.optionList.developerList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'dev_count',
                    value: this.optionList
                })
            },

            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['developer_number_statistics']);
                }
                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    group_one_id: this.queryData.oneTeam,
                    group_two_id: this.queryData.secondTeam,
                    develop_user: this.queryData.developer,
                    develop_type: this.queryData.developmentType,
                };

                obj = Object.assign(obj || {}, params);

                this.GetDeveloperGroupNumberCountInfo(obj).then(({ data}) => {
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

            handleRowSpan(data) {
                this.spanArr = [];
                this.position = 0;
                data.forEach((item, index) => {
                    if(index === 0) {
                        this.spanArr.push(1);
                        this.position = 0
                    }else {
                        const name_level_one = data[index].name_level_one === data[index-1].name_level_one;
                        if(name_level_one) {
                            this.spanArr[this.position] += 1;
                            this.spanArr.push(0);
                        }else {
                            this.spanArr.push(1);
                            this.position = index;
                        }
                    }
                });
            },

            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.name_level_one == '小计'|| row.row.name_level_two == '小计'|| row.row.user_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'developer_number_statistics',
                    value: JSON.stringify(this.queryData)
                });

                this.optionList.oneTeamList = data.list.group_one;
                this.optionList.developmentTypeList = data.list.develop_type;

                //数据渲染

                this.saveDevType = this.queryData.developmentType;

                this.tableKey = data.list.key;
                this.tableData = data.list.value;

                let props = [];
                if(this.tableKey.indexOf('开发二级小组') > -1) props = ['name_level_two'];
                if(this.tableKey.indexOf('开发人员') > -1)  props = ['name_level_two','user_name'];
                this.tableProps = ['name_level_one', ...props, 'develop_num','inspection_num','copywriting_num','photo_num','art_design_num','tort_audit_num','final_instance_num','avg_final_instance'];
            }
        },
        created(){
            this.thisVm = this;
            try{
                this.getPreDateRange().then((data) => {
                    this.saveDefaultDate = [data.start, data.end];
                    if (JSON.stringify(this.developerGroupNumberCountInfo) === '{}') {
                        this.queryData.date = this.saveDefaultDate;
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['developer_number_statistics']);
                        this.handleQueryInfoCallBack(this.developerGroupNumberCountInfo);
                        if(this.comOptions['dev_count']) this.optionList = this.comOptions['dev_count'];
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
