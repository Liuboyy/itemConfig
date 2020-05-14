<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <!--<div class="ui-search-area" v-if="showSearch">-->
            <!--<ul class="ui-main-module-search clearFix">-->

            <!--</ul>-->
            <!--<FilterBtn refTable="tableArea" :query-fn="handleQueryInfo" :reset-fn="handleResetQueryInfo"-->
            <!--:params="{}"></FilterBtn>-->
            <!--</div>-->
        </transition>
        <div class="ui-fn-module">
            <!--<span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>-->
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
                :tableWidth="tableWidth"
                :showSearch="showSearch"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData">
            <template slot="operation" slot-scope="scope">
                <!--<ComPermitButton label="新增" permit="add" @click="handleAddSqlInfo(scope.row)"></ComPermitButton>-->
                <ComPermitButton label="编辑" permit="modify" @click="handleModifySqlInfo(scope.row)"></ComPermitButton>
                <ComPermitButton label="删除" permit="delete" @click="handleDeleteSqlInfo(scope.row)"></ComPermitButton>
            </template>
        </ComTableInfo>

        <!--<div class="ui-main-module-page">-->
        <!--<el-pagination-->
        <!--@size-change="handleSizeChange"-->
        <!--@current-change="handleCurrentChange"-->
        <!--:current-page="pageData.currentPage"-->
        <!--:page-sizes="pageSizes"-->
        <!--:page-size="pageData.currentList"-->
        <!--layout="total, sizes, prev, pager, next, jumper"-->
        <!--:total="pageData.currentTotal">-->
        <!--</el-pagination>-->
        <!--</div>-->

        <el-dialog
                top="4vh"
                width="1000px"
                title="新增"
                class="ui-layout_edit-dialog"
                :visible.sync="isAddShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @closed="handleCloseInfo">
            <el-form labelWidth="100px">
                <el-form-item label="菜单名称">
                    <el-input v-model="configObj.title" style="width: 800px" placeholder="请输入" size="small"></el-input>
                </el-form-item>
                <el-form-item label="初始SQL">
                    <el-input type="textarea" :rows="28" resize="none" v-model="configObj.ini_sql"
                              style="width: 800px" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer">
                <el-button size="small" @click="handleCloseInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmInfo">确定</el-button>
            </div>
        </el-dialog>

        <el-dialog
                top="4vh"
                width="1300px"
                :title="modifyTitle"
                class="ui-edit_layout_big"
                :visible.sync="isModifyShow"
                :close-on-click-modal="false"
                :close-on-press-escape="false"
                @closed="handleCloseInfo">
            <el-form labelWidth="100px">
                <el-form-item label="初始SQL">
                    <el-input type="textarea" :rows="29" resize="none" v-model="configObj.ini_sql"
                              style="width: 500px" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="变更后SQL">
                    <el-input type="textarea" :rows="29" resize="none" v-model="configObj.optimize_sql"
                              style="width: 500px" placeholder="请输入"></el-input>
                </el-form-item>
            </el-form>
            <div class="ui-sql__bottom">
                <span>创建人：{{saveDetailsInfo.user_name}}</span>
                <span>创建时间：{{saveDetailsInfo.create_time}}</span>
            </div>
            <div slot="footer">
                <el-button size="small" @click="handleCloseInfo">取消</el-button>
                <el-button size="small" type="primary" @click="handleConfirmInfo">确定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx,
        getDefaultTime,
        changeTableInfoProps,
        goToNewPage,
        getThirtyDayDateRange
    } from '@/services/index';
    import {
        mapActions,
        mapGetters
    } from 'vuex';

    import {
        getPreDateRange,
        getCurrentDateRange,
        validTime
    } from '@/api/common/date_format'

    import {
        getSQLListInfo,
        getSQLDetailsInfo,
        getAddSQLInfo,
        getDeleteSQLInfo,
        getModifySQLInfo
    } from '@/api/sql_module/sql_common'


    // 组件名称，用于keep-alive和权限（要跟路由保持一致）
    const component_name = 'plan_module_sql';

    export default {
        name: component_name,
        data () {
            return {

                thisVm: {},

                // 搜索缩进
                showSearch: true,

                queryData: {

                },


                optionList: {

                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth: [],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //新增
                isAddShow: false,
                isModifyShow: false,
                modifyTitle: '',
                configObj: {
                    ini_sql: '',
                    optimize_sql: '',
                    title: ''
                },
                saveRowData: {},
                saveDetailsInfo: {}


            };
        },
        computed: {
            ...mapGetters([
                'queryParamsInfo',
                'loginInfo'
            ]),
            buttonList() {
                return config.AUTHORITY_BUTTON[component_name].buttonList;
            }
        },
        methods: {
            ...mapActions([]),
            autoAddTableInx,
            getDefaultTime,
            goToNewPage,
            getSQLListInfo,

            // 列表信息查询
            handleQueryInfo (params, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['plan_module_sql']);
                }

                let obj = {
                    sys_model_id: '10',
                    ...params,
                };

                this.getSQLListInfo(obj).then(({data}) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                });
            },

            // 查询重置
            handleResetQueryInfo () {},


            //新增
            handleAddSqlInfo() {
                this.isAddShow = true;
            },
            //编辑
            handleModifySqlInfo(row) {
                this.isModifyShow = true;
                this.saveRowData = row;
                this.modifyTitle = '编辑——' + `${row.title}`;
                getSQLDetailsInfo({ id: row.id }).then(({ data }) => {
                    this.configObj.ini_sql = data.datadict.ini_sql;
                    this.configObj.optimize_sql = data.datadict.optimize_sql;
                    this.saveDetailsInfo = data.datadict;
                })
            },

            //取消
            handleCloseInfo() {
                this.isAddShow = false;
                this.isModifyShow = false;
                this.configObj.ini_sql = '';
                this.configObj.optimize_sql = '';
                this.configObj.title = '';
            },
            //确定
            handleConfirmInfo() {
                let obj = {
                    ini_sql: this.configObj.ini_sql,
                    optimize_sql: this.configObj.optimize_sql,
                };
                if(this.isAddShow) {
                    if(!this.configObj.title || !this.configObj.ini_sql) {
                        this.$message.warning('请填写完整信息后提交！');
                        return;
                    }
                    obj.sys_model_id = '10';
                    obj.sys_model_name = '计划模块';
                    obj.title = this.configObj.title;
                    getAddSQLInfo(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }else {
                    obj.id = this.saveRowData.id;
                    obj.title = this.saveRowData.title;
                    getModifySQLInfo(obj).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }
            },

            //删除
            handleDeleteSqlInfo(row) {
                this.$confirm('是否确认删除该数据', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    getDeleteSQLInfo({ id: row.id }).then(({ data }) => {
                        this.handleOperationCallBack(data);
                    })
                }).catch(() => {});
            },


            // 分页条数切换
            handleSizeChange (val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true);
            },

            // 跳转页数切换
            handleCurrentChange (val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true);
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1,
                }, true)
            },

            // 操作回调
            handleOperationCallBack (data, successFn, errorFn) {
                if (data.status) {
                    this.$message.success('操作成功！');
                    if(this.isAddShow) this.isAddShow = false;
                    if(this.isModifyShow) this.isModifyShow = false;
                    this.handleQueryInfo({limit: this.pageData.currentList});
                    successFn && successFn();
                } else {
                    this.$message.error(data.errorMess || '操作失败！');
                    errorFn && errorFn();
                }
            },


            //查询回调
            handleQueryInfoCallBack (data) {

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'plan_module_sql',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = ['模块名称','菜单名称','操作'];
                this.tableProps = ['sys_model_name', 'title', 'operation'];
                this.tableData.splice(0);
                this.$nextTick().then(() => {
                    this.tableData = data.datalist;
                });

                //分页
//                this.pageData.currentList = data.page_data.limit * 1;
//                this.pageData.currentPage = data.page_data.offset * 1;
//                this.pageData.currentTotal = data.page_data.total * 1;
            },
        },
        created () {
            this.thisVm = this;
            try {
                this.handleQueryInfo();
            } catch (e) {
                console.log(e);
            }
        },
    };
</script>

<style lang="less" scoped>
    .ui-input__tree {
        .ui-base--area {
            max-height: 400px;
            overflow: auto;
        }

        .ui-tree__btn {
            padding-left: 20px;
            border-top: 1px solid #e6e6e6;
        }
    }

    /deep/.el-tabs--card > .el-tabs__header .el-tabs__nav {
        margin-top: 0!important;
    }
    /deep/.el-tabs--card>.el-tabs__header {
        border-bottom: 0!important;
    }

    .ui-fn-module .ui-summary_area {
        float: right;
        font-size: 12px;
        color: #333333;
        margin-top: 10px;

        span:not(:last-child) {
            margin-right: 5px;
        }
    }

</style>
