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
                        <SearchRequirement label="美工小组">
                            <el-select
                                    @change="handleChangeGetStaff"
                                    filterable
                                    v-filter
                                    size="small"
                                    v-model="queryData.artistTeam">
                                <el-option
                                        v-for="item in optionList.artistTeamList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="美工人员">
                            <el-select
                                    filterable
                                    v-filter
                                    size="small"
                                    :disabled="queryData.artistTeam == ''"
                                    v-model="queryData.artistStaff">
                                <el-option
                                        v-for="item in optionList.artistStaffList"
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
                @dialogPageChange="handleDetailsPageChange"
                @export="handleExportDetailsInfo({isExcel: 1})"></ComDialogPreview>
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
    } from '@/api/common/date_format'

    import {
        getComDeveloperBySecondGroup
    } from '../../../../../api/common/index'

    import {
        getArtistSpuDetailsInfo
    } from '../../../../../api/design_module/artist_work_report'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    artistTeam: '',
                    artistStaff: '',
                },
                optionList: {
                    artistTeamList: [],
                    artistStaffList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                tableHeight: '100px',

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
                    limit: 20,
                    offset: 1,
                    total: 0
                },
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'comOptions',
                'artistGroupDetailsReportInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetArtistGroupDetailsReportInfo',
            ]),
            getComDeveloperBySecondGroup,
            getArtistSpuDetailsInfo,

            // 重置
            handleResetQueryInfo(){
                this.queryData.artistTeam = '';
                this.queryData.artistStaff = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['artist_group_details']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    art_group_id: this.queryData.artistTeam,
                    art_user_id: this.queryData.artistStaff,
                };

                obj = Object.assign(obj || {}, params);

                this.GetArtistGroupDetailsReportInfo(obj).then(({ data}) => {
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

            //获取美工人员
            handleChangeGetStaff(val) {
                if(!this.queryData.artistStaff || val) this.queryData.artistStaff = '';
                this.getComDeveloperBySecondGroup({
                    group_level: 2,
                    group_type: 5,
                    group_id: val,
                    shift_flag: '',
                }).then(({ data }) => {
                    this.optionList.artistStaffList = data.list;
                    this.handleSaveOptionList();
                })
            },

            //保存下拉
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'artist_group',
                    value: this.optionList
                })
            },

            //SPU明细
            handleSpuDetailsInfo(row, type, params) {
                if(!row.art_user_id) return;
                if(type == 1) {
                    if(row.overtime_spu_num <= 0 || !this.buttonList['overtime_num'].permit(this.thisVm)) return;
                    this.dialogTitle = `${row.user_name || ''}`+ '超时明细';
                    this.dialogWidth = [];
                }else {
                    if(row.rejected_spu_num <= 0 || !this.buttonList['reject_num'].permit(this.thisVm)) return;
                    this.dialogTitle = `${row.user_name || ''}`+ '返工明细';
                    this.dialogWidth = ['60','120','90','120','140','120','', ''];
                }
                this.isShowDetails = true;
                this.saveRowData = row;
                this.saveType = type;

                let obj = {
                    start_date: row.start_date,
                    end_date: row.end_date,
                    group_id: row.group_id,
                    art_user_id: row.art_user_id == '-' ? '' : row.art_user_id,
                    detail_type: type,
                    ...params
                };
                this.getArtistSpuDetailsInfo(obj).then(({ data }) => {
                    if(data.status) {
                        this.dialogData = data.list.value;
                        this.dialogKey = data.list.key;
                        if(type == 1) this.dialogProps = ['index','spu','product_onelevel_name','create_user_name','start_time','end_time','overdue_time'];
                        if(type == 2) {
                            this.dialogProps = ['index','spu','product_onelevel_name','art_user_name','rejected_time','rejected_user_name','rejected_type_text', 'setting_introduce'];
                        }

                        this.dialogPageData.limit = data.list.page.limit * 1 ;
                        this.dialogPageData.offset = data.list.page.offset * 1 ;
                        this.dialogPageData.total = data.list.page.total * 1 ;
                    }
                });
            },

            //明细导出
            handleExportDetailsInfo(params) {
                let obj = {
                    ...params,
                    start_date: this.saveRowData.start_date,
                    end_date: this.saveRowData.end_date,
                    art_user_id: this.saveRowData.art_user_id === '-' ? '' : this.saveRowData.art_user_id,
                    group_id: this.saveRowData.group_id,
                    detail_type: this.saveType,
                };
                if (obj.isExcel) {
                    let str = '?';
                    for (let key in obj) {
                        str = `${str}&${key}=${obj[key] || ''}`;
                    }
                    window.open('/design/Art_workreport/getArtUserDetail' + str, '_self');
                }
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel : 1,
//                    total: this.pageData.currentTotal
                }, true)
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


            //弹框分页
            handleDetailsPageChange({offset,limit}) {
                this.handleSpuDetailsInfo(this.saveRowData, this.saveType, {offset, limit})
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
                    key: 'artist_group_details',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.optionList.artistTeamList = data.list.group_list;

                let keyList = [...data.list.key];
                keyList.splice(data.list.key.indexOf('总任务数') , keyList.length);
                this.tableKey = keyList;

                let flag = this.tableKey.indexOf('美工人员') > -1;
                this.tableProps = flag ? ['name_level_two','user_name'] : ['name_level_two'];

                let arr = [];
                data.list.value.forEach(item => {
                    arr.push({
                        ...item,
                        start_date: this.queryData.date[0],
                        end_date: this.queryData.date[1],
                        group_id: this.queryData.artistTeam
                    })
                });
                this.tableData = [...arr];

                this.tableWidth = this.tableProps.map(item => {
                    if(item === 'name_level_two') return '150';
                    if(item === 'user_name') return '120';
                    return ''
                })
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.artistGroupDetailsReportInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['artist_group_details']);
                        this.handleQueryInfoCallBack(this.artistGroupDetailsReportInfo);
                        if(this.queryData.artistTeam) this.handleChangeGetStaff(this.queryData.artistTeam);
                        if(this.comOptions['artist_group']) this.optionList = this.comOptions['artist_group'];
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
