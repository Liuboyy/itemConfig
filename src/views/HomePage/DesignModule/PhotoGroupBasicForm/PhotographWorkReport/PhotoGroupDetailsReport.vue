<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="摄影小组">
                            <el-select
                                    @change="handleChangeGetStaff"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.photoTeam">
                                <el-option
                                        v-for="item in optionList.photoTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="摄影人员">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    :disabled="queryData.photoTeam == ''"
                                    v-model="queryData.photoStaff">
                                <el-option
                                        v-for="item in optionList.photoStaffList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="任务类型">
                            <el-select filterable v-filter size="small" v-model="queryData.taskType">
                                <el-option
                                        v-for="item in optionList.taskTypeList"
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

        <TableIndex :tableData="tableData" :tableProps="tableProps" :tableKey="tableKey" :tableWidth="tableWidth" :showSearch="showSearch"
                    @click="handleSpuDetailsInfo"></TableIndex>

        <ComDialogPreview
                isButton
                isPage
                :title="dialogTitle"
                :visible.sync="isShowDetails"
                :tableKey="dialogKey"
                :tableProps="dialogProps"
                :tableWidth="dialogWidth"
                :tableData="dialogData"
                :dialogPageData="dialogPageData"
                @dialogPageChange="handleDialogPageData"
                @export="handleExportDetailsInfo(saveExportType)"></ComDialogPreview>
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
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'

    import {
        getSpuOvertimeDetailsInfo,
        getSpuRejectWorkDetailsInfo
    } from '../../../../../api/design_module/photograph_work_report'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    photoTeam: '',
                    photoStaff: '',
                    taskType: '',
                },
                optionList: {
                    photoTeamList: [],
                    photoStaffList: [],
                    taskTypeList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],

                //保存行数据
                saveRowData: {},
                saveType: '',

                //SPU明细
                isShowDetails: false,
                dialogTitle: '',
                dialogKey: [],
                dialogProps: [],
                dialogData: [],
                dialogWidth: [],
                dialogPageData: {
                    offset: 1,
                    limit: 20,
                    total: 0
                }
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'photoGroupDetailsReportInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetPhotoGroupDetailsReportInfo',
            ]),
            getComDeveloperBySecondGroup,
            getSpuOvertimeDetailsInfo,
            getSpuRejectWorkDetailsInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.photoTeam = '';
                this.queryData.photoStaff = '';
                this.queryData.taskType = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['photo_group_details']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date && this.queryData.date[0],
                    end_date: this.queryData.date && this.queryData.date[1],
                    group_id: this.queryData.photoTeam,
                    user_id: this.queryData.photoStaff,
                    task_type: this.queryData.taskType,
                };

                obj = Object.assign(obj || {}, params);

                this.GetPhotoGroupDetailsReportInfo(obj).then(({ data}) => {
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

            //获取摄影人员
            handleChangeGetStaff(val) {
                if(!this.queryData.photoTeam || val) this.queryData.photoStaff = '';
                this.getComDeveloperBySecondGroup({
                    group_level: 2,
                    group_type: 4,
                    group_id: val,
                    shift_flag: ''
                }).then(({ data }) => {
                    this.optionList.photoStaffList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'photo_group',
                    value: this.optionList
                })
            },

            //SPU超时明细
            handleSpuDetailsInfo(row, type, params) {
                if(!row.user_id) return;
                this.saveRowData = row;
                this.saveType = type;
                let obj = {
                    start_date: row.start_date,
                    end_date: row.end_date,
                    user_id: row.user_id === '-' ? '' : row.user_id,
                    group_id: row.group_id,
                    task_type: row.task_type,
                    ...params
                };
                if(type == 1) {
                    if(row.overtime_spu_cnt <= 0 || !this.buttonList['overtime_num'].permit(this.thisVm)) return;
                    this.dialogTitle = `${row.user_name || ''}`+ '超时明细';
                    this.saveExportType = 'overtime';
                    this.getSpuOvertimeDetailsInfo(obj).then(({ data }) => {
                        if(data.status) {
                            this.dialogData = data.data.value;
                            this.dialogKey = ['序号', ...data.data.key];
                            this.dialogProps = ['index','spu','p_line_name','user_name','start_time','end_time','overtime'];
                            this.dialogPageData.limit = data.data.page.limit * 1;
                            this.dialogPageData.offset = data.data.page.offset * 1;
                            this.dialogPageData.total = data.data.page.total_qty * 1;
                        }
                    })
                }else {
                    if(row.reject_spu_cnt <= 0 || !this.buttonList['reject_num'].permit(this.thisVm)) return;
                    this.dialogTitle = `${row.user_name || ''}`+ '返工明细';
                    this.saveExportType = 'reject';
                    this.getSpuRejectWorkDetailsInfo(obj).then(({ data }) => {
                       if(data.status) {
                           this.dialogData = data.data.value;
                           this.dialogKey = ['序号', ...data.data.key];
                           this.dialogProps = ['index','spu','p_line_name','user_name','reject_time','reject_user_name','reject_type_text', 'setting_introduce'];
                           this.dialogWidth = ['60','130','90','120','140','120','', ''];
                           this.dialogPageData.limit = data.data.page.limit * 1;
                           this.dialogPageData.offset = data.data.page.offset * 1;
                           this.dialogPageData.total = data.data.page.total_qty * 1;
                       }
                    })
                }
                this.isShowDetails = true;
            },

            //明细导出
            handleExportDetailsInfo(type) {

                let obj = {
                    is_excel: 1,
                    user_id: this.saveRowData.user_id === '-' ? '' : this.saveRowData.user_id,
                    start_date: this.saveRowData.start_date,
                    end_date: this.saveRowData.end_date,
                    user_name: this.saveRowData.user_name,
                    group_id: this.saveRowData.group_id,
                    task_type: this.saveRowData.task_type,
                };

                let str = '?';
                for (let key in obj) {
                    str = `${str}&${key}=${obj[key] || ''}`;
                }
                switch (type) {
                    case 'overtime':
                        window.open('/design/Photo_work_report/getSpuOvertimeData' + str, '_self');
                        break;
                    case 'reject':
                        window.open('/design/Photo_work_report/getSpuReworkData' + str, '_self');
                        break;
                }
            },
            //弹框分页
            handleDialogPageData({limit, offset}) {
                this.handleSpuDetailsInfo(this.saveRowData, this.saveType, {limit, offset});
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
                    this.queryData.date = [data.start, data.end];
                });
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'photo_group_details',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let keyList = [...data.data.key];
                keyList.splice(data.data.key.indexOf('总任务数') , keyList.length);
                this.tableKey = keyList;

                let flag = this.tableKey.indexOf('摄影人员') > -1;
                this.tableProps = flag ? ['group_name','user_name'] : ['group_name'];

                let arr = [];
                data.data.value.forEach(item => {
                    arr.push({
                        ...item,
                        start_date: this.queryData.date[0],
                        end_date: this.queryData.date[1],
                        group_id: this.queryData.photoTeam,
                        task_type: this.queryData.taskType
                    })
                });
                this.tableData = [...arr];

                this.tableWidth = this.tableProps.map(item => {
                    if(item === 'user_name'|| item === 'group_name') return '120';
                    return '';
                });

                this.optionList.photoTeamList = data.data.group_list;
                this.optionList.taskTypeList = data.data.task_type_list;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.photoGroupDetailsReportInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['photo_group_details']);
                        this.handleQueryInfoCallBack(this.photoGroupDetailsReportInfo);
                        if(this.queryData.photoTeam) this.handleChangeGetStaff(this.queryData.photoTeam);
                        if(this.comOptions['photo_group']) this.optionList = this.comOptions['photo_group'];
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
