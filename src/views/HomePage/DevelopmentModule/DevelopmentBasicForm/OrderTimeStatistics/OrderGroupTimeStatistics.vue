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
                :tableRowClassName="tableRowClassName"
                :cellMouseLeave="cellMouseLeave"
                :cellMouseEnter="cellMouseEnter"
                :spanMethod="handleSpanMethod"
                :otherHeight="['el-tabs__header']"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :cellStyle="cellStyle"
                :stripe="false"
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
                    createTime: [],
                    oneTeam: '',
                    secondTeam: '',
                    developer: '',
                },
                optionList: {
                    oneTeamList: [],
                    secondTeamList: [],
                    developerList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //判断是否出现二级小组
                isTeam: false,
                //判断是否出现开发人员
                isStaff: false,

                rowIndex: '-1',
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'orderGroupTimeCountInfo',
                'comOptions'
            ]),
        },
        methods: {
            ...mapActions([
                'GetOrderGroupTimeCountInfo',
            ]),
            getPreDateRange,
            getComSecondGroupByOneGroup,
            getComDeveloperBySecondGroup,


            // 重置
            handleResetQueryInfo(){
                this.queryData.oneTeam = '';
                this.queryData.secondTeam = '';
                this.queryData.developer = '';
                this.handleGetDateRange();
            },

            //获取二级小组
            handleChangeGetGroup(val) {
                if (!this.queryData.oneTeam || val) {
                    this.queryData.secondTeam = '';
                    this.queryData.developer = '';
                }
                this.queryData.secondTeam = '';
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
                    key: 'order_group',
                    value: this.optionList
                })
            },


            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['order_group_statistics']);
                }
                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                let obj = {
                    start_date: this.queryData.createTime[0],
                    end_date: this.queryData.createTime[1],
                    group_one_id: this.queryData.oneTeam,
                    group_two_id: this.queryData.secondTeam,
                    develop_user: this.queryData.developer,
                };

                obj = Object.assign(obj || {}, params);

                this.GetOrderGroupTimeCountInfo(obj).then(({ data}) => {
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

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (!columnIndex || (this.isTeam && columnIndex  == 1) ||(this.isStaff  && columnIndex  == 2)) {
                    return {
                        rowspan: row.spanLength ? row.spanLength : 0,
                        colspan: 1
                    }
                }
            },

            //处理合并行悬浮问题
            cellMouseEnter(row) {
                this.rowIndex = row.rowIndex;
                this.$nextTick().then(() => {
                    if (document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])')) {
                        document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])').style.backgroundColor = '#fdfdfd';
                    }
                })
            },
            cellMouseLeave() {
                this.rowIndex = '';
                const rowLists = document.querySelectorAll('.el-table__body tr td:not([rowspan="1"])');
                rowLists.forEach(_e => {
                    _e.style.backgroundColor = '#FFF';
                });
            },
            tableRowClassName({row}) {
                return row.rowIndex === this.rowIndex && 'cell-row'
            },


            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.sample_type_cn == '小计') {
                    return 'background: #f3f6fa'
                }
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'order_group_statistics',
                    value: JSON.stringify(this.queryData)
                });

                this.optionList.oneTeamList = data.list.group_one;

                //数据渲染
                let arr = [];
                if(data.list.value) {
                    data.list.value.forEach((item, index) => {
                        item.forEach((_v, _i) => {
                            if(!_i) {
                                arr.push({  ..._v, spanLength: item.length, rowIndex: index});
                            }else {
                                arr.push({..._v, rowIndex: index});
                            }
                        });
                    });
                }
                this.tableData = [...arr];
                this.tableKey = data.list.key;

                let props = [];
                if(this.tableKey.indexOf('开发二级小组') > -1) {
                    props = ['name_level_two',];
                    this.isTeam = true;
                }else {
                    this.isTeam = false;
                }
                if(this.tableKey.indexOf('开发员') > -1) {
                    props = ['name_level_two','user_name'];
                    this.isStaff = true;
                }else {
                    this.isStaff = false;
                }
                this.tableProps = ['name_level_one', ...props, 'sample_type_cn','avg_create','avg_pay','avg_send','avg_arrive','avg_return'];
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.orderGroupTimeCountInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['order_group_statistics']);
                        this.handleQueryInfoCallBack(this.orderGroupTimeCountInfo);
                        if (this.comOptions['order_group']) this.optionList = this.comOptions['order_group'];
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>

.current-row {
    background: #fdfdfd;
}

</style>
