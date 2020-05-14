<template>
    <div class="ui-search_require clearFix" :style="{ width: areaWidth }">
        <label class="ui-search_label" :style="{ width: width }">{{ label }}</label>
        <div class="ui-search_input" :style="{ marginLeft: width }" :class="isTwo && 'ui-search_input-two'">
            <slot>
                <el-date-picker
                        :clearable="clearable"
                        v-if="template === 'daterange'"
                        v-model="modelForm"
                        type="daterange"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :size="size"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker
                        :clearable="clearable"
                        v-if="template === 'date'"
                        v-model="modelForm"
                        type="date"
                        placeholder="选择日期"
                        format="yyyy-MM-dd"
                        value-format="yyyy-MM-dd"
                        :size="size"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <el-date-picker
                        :clearable="clearable"
                        v-if="template === 'daterangeym'"
                        v-model="modelForm"
                        type="monthrange"
                        range-separator="至"
                        start-placeholder="开始月份"
                        end-placeholder="结束月份"
                        format="yyyy-MM"
                        value-format="yyyy-MM"
                        :size="size"
                        :picker-options="pickerOptions">
                </el-date-picker>
                <el-cascader
                        clearable
                        v-if="template === 'cascader'"
                        filterable
                        v-filter
                        change-on-select
                        v-model="modelForm"
                        :size="size"
                        placeholder="请选择"
                        :props="props"
                        :options="cascaderOption"
                        @change="change"
                ></el-cascader>
                <el-select v-model="modelForm" :size="size" v-if="template === 'select'" :multiple="multiple" collapse-tags>
                    <el-option v-for="(label, value) in options" :label="label" :value="value" :key="value"></el-option>
                </el-select>

                <el-select :disabled="isDisabled" clearable v-if="template === 'search'" v-model="modelForm" filterable v-filter
                           placeholder="请选择"
                           @change="searchChange">
                    <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                    </el-option>
                </el-select>

                <!--单框时间区间-->
                <el-row v-if="template === 'splitDate'">
                    <el-col :span="11">
                        <el-date-picker :clearable="clearable" v-model="modelForm[0]" type="date" placeholder="选择日期"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2"> - </el-col>
                    <el-col :span="11">
                        <el-date-picker :clearable="clearable" v-model="modelForm[1]" type="date" placeholder="选择日期"
                                        format="yyyy-MM-dd" value-format="yyyy-MM-dd" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                </el-row>

                 <!--单框月区间-->
                <el-row v-if="template === 'splitMonth'">
                    <el-col :span="11">
                        <el-date-picker :clearable="clearable" v-model="modelForm[0]" type="month" placeholder="选择月份"
                                        format="yyyy-MM" value-format="yyyy-MM" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                    <el-col :span="2"> - </el-col>
                    <el-col :span="11">
                        <el-date-picker :clearable="clearable" v-model="modelForm[1]" type="month" placeholder="选择月份"
                                        format="yyyy-MM" value-format="yyyy-MM" :picker-options="pickerOptions">
                        </el-date-picker>
                    </el-col>
                </el-row>

                <!--输入区间-->
                <el-row v-if="template === 'inputInterval'">
                    <el-col :span="11">
                        <el-input size="small" placeholder="请输入" v-model="modelForm[0]"></el-input>
                    </el-col>
                    <el-col :span="2"> - </el-col>
                    <el-col :span="11">
                        <el-input size="small" placeholder="请输入" v-model="modelForm[1]"></el-input>
                    </el-col>
                </el-row>

            </slot>
        </div>
    </div>
</template>

<script>

    import {
        getQuickTime,
        getCurrentMonthStartDate,
        getCurrentMonthEndDate,
        getLastMonthStartDate,
        getLastMonthEndDate,
        validTime,
        validTime1
    } from '../api/common/date_format'

    import CONFIG from '../assets/js/config'

    const disableDate = {
        disabledDate(time) {
            return time.getTime() > Date.now();
        },
    }

    /**
     *  头部查询组件 > 简便头部书写，自适应宽度
     * */
    export default {
        name: 'SearchRequirement',
        model: {
            prop: 'model',
            event: 'changes'
        },
        props: {
            template: {
                type: String,
                default: ''
            },
            model: '',
            label: {
                type: String,
                default: ''
            },
            width: {
                type: String,
                default: '100px'
            },
            fixedWidth: {
                type: String,
                default: ''
            },
            isTwo: {
                type: Boolean,
                default: false
            },
            props: {
                type: Object,
                default() {
                    return {value: 'city_code', label: 'city_name'};
                }
            },
            multiple: {
                type: Boolean,
                default: false
            },
            options: {
                type: [Array, Object],
                default() {
                    return [];
                }
            },
            isDisabled: {
                type: Boolean,
                default: false
            },
            isDisableDate: {
                type: Boolean,
                default: false
            },
            pickerOptions: {
                type: Object,
                default() {
                    return {}
                }
            },
            isOption: {
                type: Boolean,
                default: true
            },
            clearable: {
                type: Boolean,
                default: false
            },
            isRemove60: {//移除过去60天
                type: Boolean,
                default: false
            },
            isCurrentDay: {//加上当天
                type: Boolean,
                default: false
            },
            datePickerOptions: {
                type: Object,
                default() {
                    if (!this.isOption) {
                        return {}
                    }
                    if(this.isRemove60) {
                        return {
                            disabledDate(time) {
                                return time.getTime() > Date.now();
                            },
                            shortcuts: [
                                CONFIG.DATE_SHORTCUT.lastDay,
                                CONFIG.DATE_SHORTCUT.lastWeek,
                                CONFIG.DATE_SHORTCUT.currentWeek,
                                CONFIG.DATE_SHORTCUT.lastMonth,
                                CONFIG.DATE_SHORTCUT.currentMonth,
                                CONFIG.DATE_SHORTCUT.lastDay_7,
                                CONFIG.DATE_SHORTCUT.lastDay_30,
                            ]
                        }
                    }
                    if(this.isCurrentDay) {
                        return {
                            disabledDate(time) {
                                return time.getTime() > Date.now();
                            },
                            shortcuts: [
                                CONFIG.DATE_SHORTCUT.lastDay,
                                CONFIG.DATE_SHORTCUT.currentDay,
                                CONFIG.DATE_SHORTCUT.lastWeek,
                                CONFIG.DATE_SHORTCUT.currentWeek,
                                CONFIG.DATE_SHORTCUT.lastMonth,
                                CONFIG.DATE_SHORTCUT.currentMonth,
                                CONFIG.DATE_SHORTCUT.lastDay_7,
                                CONFIG.DATE_SHORTCUT.lastDay_30,
                                CONFIG.DATE_SHORTCUT.lastDay_60,
                            ]
                        }
                    }
                    return {
                        disabledDate(time) {
                            return time.getTime() > Date.now();
                        },
                        shortcuts: [
                            CONFIG.DATE_SHORTCUT.lastDay,
                            CONFIG.DATE_SHORTCUT.lastWeek,
                            CONFIG.DATE_SHORTCUT.currentWeek,
                            CONFIG.DATE_SHORTCUT.lastMonth,
                            CONFIG.DATE_SHORTCUT.currentMonth,
                            CONFIG.DATE_SHORTCUT.lastDay_7,
                            CONFIG.DATE_SHORTCUT.lastDay_30,
                            CONFIG.DATE_SHORTCUT.lastDay_60,
                        ]
                    }
                }
            },
        },
        data() {
            return {
                areaWidth: '',
                minWidth: 298,
                modelForm: this.model,
                size: 'small',
                cascaderOption: [],
                lastMonthStart: '',
                lastMonthEnd: '',
            };
        },
        created() {
            if (this.template === 'cascader') {
                setTimeout(() => {
                    if (this.options && this.options.length > 0) {
                        this.cascaderOption = [...this.options];
                        this.handleTreeCallBackChange(this.cascaderOption);
                    }
                }, 500);
            }
        },
        mounted() {

            this.$nextTick(() => {
                if (getEleAttr('.ui-search-area')) {
                    let areaWidth = (getEleAttr('.ui-search-area').offsetWidth - 60) / 5;
                    this.areaWidth = (areaWidth || this.minWidth) + 'px';
                }
            });

        },
        methods: {
            getQuickTime,
            getCurrentMonthStartDate,
            getCurrentMonthEndDate,
            getLastMonthStartDate,
            getLastMonthEndDate,

            // 重构树形结构
            handleTreeCallBackChange(arr) {
                for (let i = 0; i < arr.length; i++) {
                    if (arr[i].son_id && arr[i].son_id.length) {
                        this.handleTreeCallBackChange(arr[i].son_id);
                    } else {
                        delete arr[i].son_id;
                    }
                }
            },
            change(val) {
                this.$emit('change', val);
            },
            searchChange() {
                this.$emit('searchChange');
            },
    },
        watch: {
            modelForm(val) {
//                if (JSON.stringify(newval) === JSON.stringify(oldval)) return;
                if(this.template === 'splitDate') {
                    if(!validTime(val && val[0], val && val[1])) {
                        this.$message.warning('结束时间不能小于开始时间，请重新选择');
                        return;
                    }
                }else if(this.template === 'splitMonth'){
                    if(!validTime1(val && val[0], val && val[1])) {
                        this.$message.warning('结束时间不能小于开始时间，请重新选择');
                        return;
                    }
                }
                this.$emit('changes', val);
            },
            model() {
                this.modelForm = this.model;
//                if (Array.isArray(this.modelForm)) {
//                    this.modelForm = [...this.model];
//                } else {
//                    this.modelForm = this.model;
//                }
            },

        }
    };
</script>

<style scoped lang="less">
    .ui-search_require {
        .ui-search_label {
            display: block;
            float: left;
            line-height: 32px;
            padding-right: 12px;
            box-sizing: border-box;
            text-align: right;
            font-size: 12px;
            color: #333333;
        }

        .ui-search_input {
            line-height: 32px;

            .el-select {
                width: 100%;
            }

            /deep/ .el-input--suffix .el-input__inner {
                height: 32px !important;
                line-height: 32px;
            }

        }

        .ui-search_input-two {
            .el-input {
                width: 42% !important;
            }
        }

        .el-cascader {
            width: 100%;
        }
    }

    /deep/.el-row {
        .el-input--prefix .el-input__inner {
            padding-left: 10px!important;
        }
        .el-input--suffix .el-input__inner {
            padding-right: 0!important;
        }
        .el-input__prefix {
            display: none!important;
        }
        .el-input__suffix {
            top: -3px!important;
        }
    }
</style>
