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
                    <li>
                        <SearchRequirement label="美工人员">
                            <el-select filterable v-filter size="small" v-model="queryData.artistStaff">
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
                    <el-button @click="handleResetQueryInfo(1)" size="small" icon="icon-zhongzhi">重置</el-button>
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

        <TableIndex :tableData="tableData" :tableProps="tableProps" :tableKey="tableKey" :showSearch="showSearch" :tableWidth="tableWidth"
                    @click="handleSpuDetailsInfo" @staffClick="handleStaffDetailInfo">
            <template slot="user_name" slot-scope="scope">
                <span :class="buttonList['preview'].permit(thisVm) && scope.row.user_name != '小计' ? 'ui-link': ''"
                      @click="handleStaffDetailInfo(scope.row)">{{scope.row.user_name}}</span>
            </template>
        </TableIndex>

        <ComDialogPreview
                isPage
                isButton
                :title="dialogTitle"
                :visible.sync="isShowDetails"
                :tableKey="dialogKey"
                :tableProps="dialogProps"
                :tableWidth="dialogWidth"
                :tableData="dialogData"
                :dialogPageData="dialogPageData"
                @dialogPageChange="handleDetailsPageChange"
                @export="handleExportDetailsInfo({is_excel: 1},saveExportType)"></ComDialogPreview>

        <el-dialog
                top="5vh"
                width="1200px"
                :title="dialogTitle"
                :visible.sync="isShowStaff"
                class="ui-layout_edit-dialog">
            <el-button size="small"
                       type="primary"
                       style="margin-bottom: 10px"
                       v-if="buttonList['export'].permit(thisVm)"
                       @click="handleExportDetailsInfo({is_excel: 1},saveExportType)">导出</el-button>
            <div class="ui-main-module-table">
                <el-table height="600px" :data="dialogStaffData" border stripe :cellStyle="cellStyle" highlight-current-row>
                    <el-table-column label="任务类型" prop="type_name" width="78px"></el-table-column>
                    <el-table-column label="总任务数">
                        <el-table-column label="SPU" prop="all_spu_cnt" width="70px"></el-table-column>
                        <el-table-column label="SKU" prop="all_sku_cnt" width="70px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="已分配任务数">
                        <el-table-column prop="distribute_spu_cnt" label="SPU" width="55px"></el-table-column>
                        <el-table-column prop="distribute_sku_cnt" label="SKU" width="55px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="未分配任务数">
                        <el-table-column prop="undistribute_spu_cnt" label="SPU" width="50px"></el-table-column>
                        <el-table-column prop="undistribute_sku_cnt" label="SKU" width="50px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="完成数">
                        <el-table-column label="SPU" prop="finish_spu_cnt" width="60px"></el-table-column>
                        <el-table-column label="SKU" prop="finish_sku_cnt" width="60px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="完成占比(SKU)" prop="finish_spu_rate" width="70px"></el-table-column>
                    <el-table-column label="未完成数">
                        <el-table-column label="SPU" prop="unfinish_spu_cnt" width="50px"></el-table-column>
                        <el-table-column label="SKU" prop="unfinish_sku_cnt" width="50px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="未完成占比(SKU)" prop="unfinish_spu_rate" width="80px"></el-table-column>
                    <el-table-column label="超时数">
                        <el-table-column label="SPU" prop="overtime_spu_cnt" width="50px"></el-table-column>
                        <el-table-column label="SKU" prop="overtime_sku_cnt" width="50px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="超时占比(SKU)" prop="overtime_spu_rate" width="70px"></el-table-column>
                    <el-table-column label="返工数">
                        <el-table-column label="SPU" prop="reject_spu_cnt" width="60px"></el-table-column>
                        <el-table-column label="SKU" prop="reject_sku_cnt" width="60px"></el-table-column>
                    </el-table-column>
                    <el-table-column label="返工占比(SKU)" prop="reject_spu_rate" width="70px"></el-table-column>
                    <template slot="empty">
                        <div><NotData v-show="!tableData.length"></NotData></div>
                    </template>
                </el-table>
            </div>
        </el-dialog>

        <el-dialog
                top="5vh"
                width="1000px"
                title="图片张数明细"
                :visible.sync="isShowPictureNum"
                class="ui-layout_edit-dialog"
                @close="handleResetQueryInfo(2)">
            <div class="ui-search-area">
                <ul class="ui-main-module-search clearFix ui-search">
                    <li>
                        <SearchRequirement label="统计日期" template="daterange" v-model="pictureObj.date"> </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="美工人员">
                            <el-select filterable v-filter size="small" v-model="pictureObj.artistStaff">
                                <el-option
                                        v-for="item in optionList.artistStaffList"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li class="ui-filter-btn" style="margin: 0">
                        <el-button @click="handleResetQueryInfo(2)" size="small" icon="icon-zhongzhi">重置</el-button>
                        <el-button size="small" type="primary" @click="handleQueryPictureInfo()" icon="icon-chaxun">查询</el-button>
                    </li>
                    <li style="float: right">
                        <el-button size="small" type="primary" @click="handleDialogExportInfo">导出</el-button>
                    </li>
                </ul>
                <div class="ui-main-module-table">
                    <el-table border :data="dialogPictureData" height="600px" stripe :cellStyle="cellStyle" highlight-current-row>
                        <el-table-column
                                v-for="(item, index) in dialogPictureKey"
                                :key="index"
                                :label="item"
                                :prop="dialogPictureProps[index]">
                        </el-table-column>
                        <template slot="empty">
                            <div> <NotData v-show="!dialogPictureData.length"></NotData> </div>
                        </template>
                    </el-table>
                </div>
            </div>
        </el-dialog>

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
        getSpuOvertimeDetailsInfo,
        getSpuRejectWorkDetailsInfo,
        getStaffDetailsInfo,
        getPictureNumberDetailsInfo
    } from '../../../../../api/design_module/boutique_work_report'

    import TableIndex from './TableIndex.vue'

    export default {
        components: {TableIndex},
        data() {
            return {

                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    artistStaff: '',
                    taskType: '',
                },
                optionList: {
                    artistStaffList: [],
                    taskTypeList: []
                },

                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],

                //保存日期
                saveDefaultDate: [],
                //保存查询日期
                saveQueryStartDate: '',
                saveQueryEndDate: '',

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

                //人员明细
                isShowStaff: false,
                dialogStaffData: [],

                //图片张数明细
                isShowPictureNum: false,
                dialogPictureData: [],
                dialogPictureKey: [],
                dialogPictureProps: [],
                dialogPictureWidth: [],
                pictureObj: {
                    date: [],
                    artistStaff: '',
                },

                //导出类型
                saveExportType: '',

            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'boutiqueDetailsReportInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetBoutiqueDetailsReportInfo',
            ]),
            getPreDateRange,
            getSpuOvertimeDetailsInfo,
            getSpuRejectWorkDetailsInfo,
            getStaffDetailsInfo,
            getPictureNumberDetailsInfo,

            // 重置
            handleResetQueryInfo(type){
                if(type == 1) {
                    this.queryData.artistStaff = '';
                    this.queryData.taskType = '';
                    this.handleGetDateRange();
                }else {
                    this.pictureObj.date = [this.saveQueryStartDate, this.saveQueryEndDate];
                    this.pictureObj.artistStaff = '';
                }
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['boutique_details_report']);
                }

                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.date[0],
                    end_date: this.queryData.date[1],
                    user_id: this.queryData.artistStaff,
                    task_type: this.queryData.taskType,
                };

                obj = Object.assign(obj || {}, params);

                this.GetBoutiqueDetailsReportInfo(obj).then(({ data}) => {
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

            //图片张数明细
            handlePictureNumberInfo() {
                this.isShowPictureNum = true;
                this.pictureObj.date = [this.saveQueryStartDate, this.saveQueryEndDate];
                this.handleDialogQueryCallBackInfo({
                    start_date: this.saveQueryStartDate,
                    end_date: this.saveQueryEndDate,
                });
            },
            handleQueryPictureInfo(params) {
                this.handleDialogQueryCallBackInfo({
                    start_date: this.pictureObj.date[0],
                    end_date: this.pictureObj.date[1],
                    user_id: this.pictureObj.artistStaff,
                    ...params,
                })
            },
            handleDialogQueryCallBackInfo(obj) {
                this.getPictureNumberDetailsInfo(obj).then(({ data }) => {
                    if(data.status === 2) return;
                    if(data.status) {
                        this.dialogPictureData = data.data.value;
                        this.dialogPictureKey = data.data.key;
                        this.dialogPictureProps = ['user_name','image_total_cnt','image_cnt_1','image_cnt_2','image_cnt_3'];
                    }else {
                        this.$message.error(data.errorMess || '操作失败')
                    }
                })
            },
            //图片张数导出
            handleDialogExportInfo() {
                this.handleQueryPictureInfo({ is_excel: 1 });
            },

            //人员明细
            handleStaffDetailInfo(row) {
                if(!row.create_user || !this.buttonList['preview'].permit(this.thisVm)) return;
                this.dialogTitle = `${row.user_name || ''}`+ ' - 任务明细';
                this.isShowStaff = true;
                this.saveRowData = row;
                this.saveExportType = 'user';
                this.getStaffDetailsInfo({
                    user_id: row.create_user,
                    start_date: row.start_date,
                    end_date: row.end_date
                }).then(({ data }) => {
                    if(data.status) {
                        this.dialogStaffData = data.data.value;
                    }
                })
            },

            //SPU明细
            handleSpuDetailsInfo(row, type, params) {
                if(!row.create_user) return;
                this.saveRowData = row;
                this.saveType = type;
                let obj = {
                    user_id: row.create_user === '-' ? '' : row.create_user,
                    start_date: row.start_date,
                    end_date: row.end_date,
                    task_type: row.task_type,
                    ...params
                };
                if(type == 1) {
                    if(row.overtime_spu_cnt <= 0 || !this.buttonList['overtime_num'].permit(this.thisVm)) return;
                    this.saveExportType = 'overtime';
                    this.dialogTitle = `${row.user_name || ''}`+ '超时明细';
                    this.getSpuOvertimeDetailsInfo(obj).then(({ data }) => {
                        if(data.status) {
                            this.dialogData = data.data.value;
                            this.dialogKey = ['序号',...data.data.key];
                            this.dialogProps = ['index','spu','product_onelevel_name','user_name','start_design_time','end_design_time','overdue_time'];
                            this.dialogPageData.limit = data.data.page.limit * 1 ;
                            this.dialogPageData.offset = data.data.page.offset * 1 ;
                            this.dialogPageData.total = data.data.page.total_qty * 1 ;
                        }
                    })
                }else {
                    if(row.reject_spu_cnt <= 0 || !this.buttonList['reject_num'].permit(this.thisVm)) return;
                    this.saveExportType = 'reject';
                    this.dialogTitle = `${row.user_name || ''}`+ '返工明细';
                    this.getSpuRejectWorkDetailsInfo(obj).then(({ data }) => {
                        if(data.status) {
                            this.dialogData = data.data.value;
                            this.dialogKey = ['序号',...data.data.key];
                            this.dialogProps = ['index','spu','product_onelevel_name','design_user_name','reject_time','reject_user_name','reject_type_text','setting_introduce'];
                            this.dialogWidth = ['60','spu','90','120','140','120','reject_type_text','setting_introduce'];
                            this.dialogPageData.limit = data.data.page.limit * 1 ;
                            this.dialogPageData.offset = data.data.page.offset * 1 ;
                            this.dialogPageData.total = data.data.page.total_qty * 1 ;
                        }
                    })
                }
                this.isShowDetails = true;
            },

            //明细导出
            handleExportDetailsInfo(params, type) {

                let obj = {
                    ...params,
                    user_id: this.saveRowData.create_user === '-' ? '' : this.saveRowData.create_user,
                    start_date: this.saveRowData.start_date,
                    end_date: this.saveRowData.end_date,
                    task_type: this.saveRowData.task_type
                };
                if(type == 'user') obj.user_name = this.saveRowData.user_name;

                obj = Object.assign(obj || {}, params);

                let str = '?';
                for (let key in obj) {
                    str = `${str}&${key}=${obj[key] || ''}`;
                }
                switch (type) {
                    case 'user':
                        window.open('/design/Bout_work_report/getPersonDetailData' + str, '_self');
                        break;
                    case 'overtime':
                        window.open('/design/Bout_work_report/getOverdueDetail' + str, '_self');
                        break;
                    case 'reject':
                        window.open('/design/Bout_work_report/getReworkDetail' + str, '_self');
                        break;
                }
            },
            //弹框分页
            handleDetailsPageChange({offset,limit}) {
                this.handleSpuDetailsInfo(this.saveRowData, this.saveType, {offset, limit})
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


            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.user_name == '小计'|| row.row.type_name == '小计'|| row.row.type_name == '小计') {
                    return 'background: #f3f6fa'
                }
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
                    key: 'boutique_details_report',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let keys = [...data.data.key];
                let flag = keys.indexOf('任务类型') > -1;

                keys.splice(data.data.key.indexOf('总任务数') , keys.length);
                this.tableKey = keys;
                this.tableProps = flag ? ['type_name', 'user_name'] : ['user_name'];
                if(data.data.value) {
                    this.tableData = data.data.value.map(item => {
                        return {
                            ...item,
                            start_date: this.queryData.date[0],
                            end_date: this.queryData.date[1],
                            task_type: this.queryData.taskType
                        }
                    });
                }
                this.tableWidth = this.tableProps.map(item => {
                    if(item === 'user_name') return '120';
                    return '80';
                });

                this.saveQueryStartDate = this.queryData.date[0];
                this.saveQueryEndDate = this.queryData.date[1];

                this.optionList.artistStaffList = data.data.group_list;
                this.optionList.taskTypeList = data.data.stuff_list;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.boutiqueDetailsReportInfo) === '{}') {
                        this.queryData.date = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['boutique_details_report']);
                        this.handleQueryInfoCallBack(this.boutiqueDetailsReportInfo);
                    }
                });
            }catch (e) {
                console.log(e);
            }
        },
    }
</script>
<style lang="less" scoped>
    /deep/.ui-layout_edit-dialog {
        .ui-search-area {
            border-top: 1px #e6e6e6 solid!important;
        }
        .ui-search {
            margin-bottom: 10px;
        }
    }
</style>
