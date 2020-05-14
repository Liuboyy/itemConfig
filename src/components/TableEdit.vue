<template>
    <div
            :class="'ui-table_' + type">
        <div :class="isAdd ? 'ui-table_add' : ''">
            <el-table
                    :data="tableData"
                    border>
                <el-table-column :label="item" v-for="(item, inx) in tableKey" :key="inx"
                                 :width="types[inx] === 'index' && !tableWidth[inx] ? '80px' : tableWidth[inx]">
                    <template slot-scope="scope">
                        <div v-if="!propsTemp[inx]">
                            <span v-if="types[inx] && types[inx] === 'index'" class="ui-table_edit--number">{{autoAddTableInx(scope.$index)}}</span>
                            <input type="text" class="el-input__inner" v-model="tableData[scope.$index][inx]"
                                   v-else-if="!types[inx] || types[inx] === 'input'">
                            <el-select v-model="tableData[scope.$index][inx]" v-else-if="types[inx] === 'select'" filterable v-filter>
                                <el-option
                                        v-for="(value, key, index) in optionList[inx]"
                                        :key="index"
                                        :value="key"
                                        :label="value"></el-option>
                            </el-select>
                            <el-select v-model="tableData[scope.$index][inx]" v-else-if="types[inx] === 'selects'"
                                       multiple collapse-tags filterable v-filter>
                                <el-option
                                        v-for="(value, key) in optionList[inx]"
                                        :key="key"
                                        :value="key"
                                        :label="value"></el-option>
                            </el-select>
                            <el-date-picker
                                    v-else-if="types[inx] === 'daterange'"
                                    size="medium"
                                    v-model="tableData[scope.$index][inx]"
                                    type="daterange"
                                    :editable="false"
                                    :clearable="false"
                                    range-separator="至"
                                    start-placeholder="开始日期"
                                    end-placeholder="结束日期"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd">
                            </el-date-picker>
                            <el-date-picker
                                    v-else-if="types[inx] === 'date'"
                                    v-model="tableData[scope.$index][inx]"
                                    type="date"
                                    format="yyyy-MM-dd"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择日期">
                            </el-date-picker>
                            <el-date-picker
                                    v-else-if="types[inx] === 'datetime'"
                                    v-model="tableData[scope.$index][inx]"
                                    type="datetime"
                                    format="yyyy-MM-dd HH:mm:ss"
                                    value-format="yyyy-MM-dd HH:mm:ss">
                            </el-date-picker>
                            <el-date-picker
                                    v-else-if="types[inx] === 'month'"
                                    v-model="tableData[scope.$index][inx]"
                                    type="month"
                                    placeholder="选择月"
                                    format="yyyy-MM"
                                    value-format="yyyy-MM">
                            </el-date-picker>
                            <el-time-picker
                                    v-else-if="types[inx] === 'time'"
                                    v-model="tableData[scope.$index][inx]"
                                    type="time"
                                    format="HH:mm:ss"
                                    value-format="HH:mm:ss">
                            </el-time-picker>
                            <el-input v-model="tableData[scope.$index][inx]" v-else-if="types[inx] === 'txtinput'">
                                <template slot="append"><span>月</span></template>
                            </el-input>
                            <el-input v-model="tableData[scope.$index][inx]" v-else-if="types[inx] === 'disinput'" readonly></el-input>
                            <el-input v-number v-model="tableData[scope.$index][inx]" v-if="types[inx] === 'number'"
                                      style="width: 100%!important;"></el-input>
                            <el-input v-floatNumber v-model="tableData[scope.$index][inx]" v-if="types[inx] === 'floatNumber'"
                                      style="width: 100%!important;"></el-input>
                            <!--<el-input v-model="tableData[scope.$index][inx]" v-if="tableData[scope.$index][inx] === 'input'"></el-input>-->
                        </div>
                        <div v-if="propsTemp[inx]">
                            <slot :name="propsTemp[inx]" :scope="[scope.$index, inx]"></slot>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <div :class="'ui-operation_btn-' + type" v-if="isAdd">
                <span @click="handleDelList()" v-if="tableData.length > 1"><i class="icon-shanjian"></i></span>
                <span @click="handleAddList" v-if="tableData.length < maxLength || !maxLength"><i class="icon-zengjia"></i></span>
            </div>
        </div>
    </div>
</template>

<script>
    /**
     * tableKey   表头        ['名称', '性别'];
     * props      额外配置    ['name', 'sex', 'id']
     * itemLength 默认行数    1
     * dataList   渲染数据    [{name: '小白', sex: '男'}}]
     * type       类型        table:表格类型   form:表单类型
     * types      输入类型    ['select', 'date', 'daterange', '']
     * optionList 下拉列表    [{value: 1, label: '人类'}]
     * isAdd      是否有新增  false
     * isRefresh  刷新表格    false
     * propsTemp  使用slot插槽 ['slotName']
     * tableWidth 指定宽度
     * */
    import {
        mapGetters
    } from 'vuex';
    import { autoAddTableInx } from '@/services'
    export default {
        name: "TableEdit",
        props: {
            tableKey: {
                type: Array,
                default() {
                    return []
                }
            },
            props: {
                type: Array,
                default() {
                    return []
                }
            },
            itemLength: {
                type: Number,
                default: 1
            },
            dataList: {
                type: Array,
                default() {
                    return []
                }
            },
            type: {
                type: String,
                default: 'table'
            },
            types: {
                type: Array,
                default() {
                    return []
                }
            },
            optionList: {
                type: Array,
                default() {
                    return []
                }
            },
            isAdd: {
                type: Boolean,
                default: false
            },
            isRefresh: {
                type: Boolean,
                default: false
            },
            maxLength: {
                type: Number,
                default: 0
            },
            propsTemp: {
                type: Array,
                default() {
                    return []
                }
            },
            tableWidth: {
                type: Array,
                default() {
                    return []
                }
            }
        },
        data() {
            return {
                tableData: []
            }
        },
        computed: {
            ...mapGetters(['isAddOrModify'])
        },
        methods: {
            autoAddTableInx,
            handleAddList() {
                this.tableData.push(new Array(this.tableKey.length));
            },
            handleDelList(inx) {
                if (this.tableData.length === 1) return;
                if (inx || inx === 0) {
                    let arr = [];

                    this.tableData.forEach((value, index) => {
                        if (index !== inx) {
                            arr.push(value)
                        }
                    });
                    this.tableData = JSON.parse(JSON.stringify(arr));
                } else {
                    this.tableData.pop();
                }

                this.handleBackData();
            },

            //刷新组件 type :: staff 员工编辑框
            handleRefreshTableData(changeData, type = 'com') {
                if (type === 'com'){
                    let arr = [];
                    if (changeData && changeData.length) {
                        let length = this.itemLength >= changeData.length ? this.itemLength: changeData.length;
                        for (let i = 0; i < length; i++) {
                            let valArr = [];
                            for (let j = 0; j < this.props.length; j++) {
                                if (changeData[i]) {
                                    valArr.push(changeData[i][this.props[j]]);
                                } else {
                                    valArr.push('');
                                }
                            }
                            arr.push(valArr);
                        }
                    } else {
                        for (let i = 0; i < this.itemLength; i++) {
                            let boxArr = new Array(this.tableKey.length);
                            arr.push(boxArr);
                        }
                    }

                    this.tableData = arr;
                } else {
                    let arr = [];
                    if (changeData && changeData.length) {
                        if (!this.tableData.length) {
                            this.tableData = Array.from(changeData);
                        } else {
                            for (let i = 0; i < changeData.length; i++) {
                                if (!changeData[i] || !changeData[i].length) continue;
                                for (let j = 0; j < changeData[i].length; j++) {
                                    if (changeData[i][j]) {
                                        this.tableData[i].splice(j, 1, changeData[i][j]);
                                    }
                                }
                            }
                        }
                    } else {
                        for (let i = 0; i < this.itemLength; i++) {
                            if (!this.dataList || !this.dataList.length) {
                                let boxArr = new Array(this.tableKey.length);
                                arr.push(boxArr);
                            } else {
                                let valArr = [];
                                for (let j = 0; j < this.props.length; j++) {
                                    if (!this.dataList[i]) break;
                                    valArr.push(this.dataList[i][this.props[j]]);
                                }
                                arr.push(valArr);
                            }
                        }
                        this.tableData = arr;
                    }
                }
            },

            // 输入框点击搜索
            handleClickSearch(finx, cinx) {
                this.$emit('srinput', { finx, cinx })
            },

            // 回调数据
            handleBackData() {
                this.$emit('tableEvent', this.tableData)
            }
        },
        created() {
            this.handleRefreshTableData();
        },
        watch: {
            tableData: {
                handler(val) {
                    this.$emit('backData', val)
                },
                deep: true
            },
            isRefresh(val) {
                if (!val) {
                    this.tableData = [];
                } else {
                    this.handleRefreshTableData();
                }
            },
            dataList() {
                this.handleRefreshTableData();
            }
        }
    }
</script>

<style scoped lang="less">
    .ui-table_add {
        margin-right: 50px;
    }
    .ui-operation_btn-table {
        position: absolute;
        /* bottom: 30px; */
        right: 0;
        margin-top: -28px;
        width: 60px;
        span {
            float: left;
            cursor: pointer;
        }
    }

    .ui-operation_btn-form {
        position: absolute;
        /*bottom: 52px;*/
        right: 0;
        width: 60px;
        margin-top: -43px;
        span {
            float: left;
            cursor: pointer;
        }
    }

    /deep/.el-table {
        text-align: left;

    }
    /deep/.el-table th {
        background: #fafafa;
        font-weight: bold;
        font-size: 12px;
        color: #666666;
    }
    /deep/.el-table th, .el-table td {
        padding: 0;
    }
    /deep/.el-table .cell {
        padding: 5px;
    }

    /deep/.el-input, .el-select {
        width: 100%!important;
    }
</style>
