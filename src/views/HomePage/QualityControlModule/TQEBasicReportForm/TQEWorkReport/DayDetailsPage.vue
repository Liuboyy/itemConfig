<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="统计日期"
                                template="splitDate"
                                v-model="queryData.createTime">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="质检人员">
                            <el-select filterable v-filter size="small" v-model="queryData.qualityMan">
                                <el-option
                                        v-for="item in optionList.qualityManList"
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
        </div>
        <ComTableInfo
                :stripe="false"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableMinWidth="tableMinWidth"
                :tableFixed="[true, true]"
                :showSearch="showSearch"
                :spanMethod="handleSpanMethod"
                :tableRowClassName="tableRowClassName"
                :cellMouseLeave="cellMouseLeave"
                :cellMouseEnter="cellMouseEnter"
                :otherHeight="['el-tabs__header']">
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
                    qualityMan: '',
                },
                optionList: {
                    qualityManList: [],
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableMinWidth: [],

                //保存日期
                saveDefaultDate: [],

                //合并行索引
                rowIndex: '-1',
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'dayDetailsInfo'
            ]),
        },
        methods: {
            ...mapActions([
                'GetTqeDayDetailInfo',
            ]),

            // 重置
            handleResetQueryInfo(){
                this.queryData.qualityMan = '';
                this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['tqe_day_detail']);
                }

                if(!validTime(this.queryData.createTime[0], this.queryData.createTime[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }

                let obj = {
                    start_date: this.queryData.createTime[0] || '',
                    end_date: this.queryData.createTime[1] || '',
                    user_id: this.queryData.qualityMan,
                };

                obj = Object.assign(obj || {}, params);

                this.GetTqeDayDetailInfo(obj).then(({ data}) => {
                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    this.handleQueryInfoCallBack(data);
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

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (!columnIndex) {
                    return {
                        rowspan: row.spanLength ? row.spanLength : 0,
                        colspan: 1
                    }
                }
            },

            //处理合并行悬浮问题
            cellMouseEnter(row,cell) {
                this.rowIndex = row.rowIndex;
                this.$nextTick().then(() => {
                    if (document.querySelector('.el-table__body tr.cell-row td.is-hidden:not([rowspan="1"])')) {
                        document.querySelector('.el-table__body tr.cell-row td.is-hidden:not([rowspan="1"])').style.backgroundColor = '#fdfdfd';
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
                    key: 'tqe_day_detail',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                let arr = [];
                if(data.data.value) {
                    data.data.value.forEach((value, index) => {
                        value.forEach((_v, _i) => {
                            if (!_i) {
                                arr.push({ ..._v, spanLength: value.length, rowIndex: index });
                            } else {
                                arr.push({ ..._v, rowIndex: index });
                            }
                        })
                    });
                }
                this.tableData = [...arr];
                this.tableKey = data.data.key;
                let props = [...data.data.key];
                props.splice(0,2);
                this.tableProps = ['user_name','type_name', ...props];
                this.tableMinWidth = this.tableProps.map(item => {
                    if(item == 'type_name') return '100';
                    return '90';
                });
                this.optionList.qualityManList = data.data.user_list;
            }
        },
        created(){
            this.thisVm = this;
            try{
                getPreDateRange().then((data) => {
                    if (JSON.stringify(this.dayDetailsInfo) === '{}') {
                        this.queryData.createTime = [data.start, data.end];
                        this.handleQueryInfo();
                    } else {
                        // 获取保存的查询参数
                        this.queryData = JSON.parse(this.queryParamsInfo['tqe_day_detail']);
                        this.handleQueryInfoCallBack(this.dayDetailsInfo);
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
