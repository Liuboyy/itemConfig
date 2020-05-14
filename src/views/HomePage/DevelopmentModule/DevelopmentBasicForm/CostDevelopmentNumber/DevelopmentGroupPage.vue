<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <!--<SearchRequirement-->
                                <!--label="创建日期"-->
                                <!--template="daterange"-->
                                <!--v-model="queryData.createTime">-->
                        <!--</SearchRequirement>-->
                        <SearchRequirement
                                label="创建日期"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发一级小组">
                            <el-select
                                    size="small"
                                    v-model="queryData.oneTeam"
                                    @change="handleChangeGetGroup"
                                    filterable
                                    v-filter>
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
                                    size="small"
                                    v-model="queryData.secondTeam"
                                    @change="handleChangeGetStaff"
                                    :disabled="queryData.oneTeam == ''"
                                    filterable
                                    v-filter>
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
                                    size="small"
                                    :disabled="queryData.oneTeam == '' || queryData.secondTeam == ''"
                                    v-model="queryData.developer"
                                    filterable
                                    v-filter>
                                <el-option
                                        v-for="item in optionList.developerList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <FilterBtn refTable="tableArea"  :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"></FilterBtn>
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

        <TableIndex :tableData="tableData" :tableKey="tableKey" :tableProps="tableProps" :showSearch="showSearch"></TableIndex>
    </div>
</template>
<script>
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getComSecondGroupByOneGroup,
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'

    import {
        getPreDateRange,
        validTime
    } from '../../../../../api/common/date_format'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    createTime: [],
                    oneTeam: '',
                    secondTeam: '',
                    developer: '',
                    date1: '',
                    date2: ''
                },
                optionList: {
                    oneTeamList: {},
                    secondTeamList: [],
                    developerList: [],
                },
                tableData: [],
                tableKey: [],
                tableProps: [],
                tableHeight: '100px',

                //保存日期
                saveDefaultDate: [],
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'costDevelopmentGroupInfo',
                'comOptions',
            ]),
        },
        methods: {
            ...mapActions([
                'GetCostDevelopmentGroupInfo',
            ]),
            getComSecondGroupByOneGroup,
            getComDeveloperBySecondGroup,

            // 重置
            handleResetQueryInfo(){
                this.queryData.oneTeam = '';
                this.queryData.secondTeam = '';
                this.queryData.developer = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['cost_development_group']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.createTime[0] || '',
                    end_date: this.queryData.createTime[1] || '',
                    group_id1: this.queryData.oneTeam,
                    group_id2: this.queryData.secondTeam,
                    user_id: this.queryData.developer,
                };

                obj = Object.assign(obj || {}, params);

                this.GetCostDevelopmentGroupInfo(obj).then(({ data}) => {
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
                        this.handleOptionList();
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
                    this.handleOptionList();
                })
            },

            //保存下拉
            handleOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'cost_group',
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
                    is_excel: 1,
                }, true)
            },

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.createTime = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'cost_development_group',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.oneTeamList = data.data.group_list;

                let keyList = [...data.data.key];
                keyList.splice(data.data.key.indexOf('合计') + 1 , keyList.length);
                this.tableKey = keyList;

                const isSecondTeam = this.tableKey.indexOf('开发二级小组') > -1;
                const isDeveloper = this.tableKey.indexOf('开发员') > -1;

                if (isDeveloper) {
                    this.tableProps = ['group_name1','group_name2','user_name','total'];
                }else if (isSecondTeam) {
                    this.tableProps = ['group_name1','group_name2','total'];
                }else {
                    this.tableProps = ['group_name1','total'];
                }
                this.tableData = data.data.value;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.costDevelopmentGroupInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['cost_development_group']);
                        this.handleQueryInfoCallBack(this.costDevelopmentGroupInfo);
                        if(this.comOptions['cost_group']) this.optionList = this.comOptions['cost_group'];
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
