<template>
    <div>
        <li v-for="(item, index) in option"
            :key="index"
            :class="`
                ${(item.isBlock && 'ui-com_edit--content--item--layout')}
                ${(item.isLabelLayout && 'ui-form--label_layout')}`">
            <el-form-item :prop="item[propData.key]" :label="item[propData.label]" :label-width="labelWidth">
                <el-input :disabled="!!item.disabled" v-if="!item.type || item.type === 'input'" v-model="formModel[item.key]" :size="size"></el-input>
                <el-select v-else-if="item.type === 'select'"
                           v-model="formModel[item.key]"
                           size="small" :disabled="!!item.disabled" filterable>
                    <el-option
                            v-for="(list, value) in item.options"
                            :label="list.label"
                            :key="list.value"
                            :value="list.value"></el-option>
                </el-select>
            </el-form-item>
        </li>
    </div>
</template>

<script>
/**
 *  ===>开发中
 *  该组件用于有动态表单选项时，可使用该组件进行配置
 *  props ->
 *      option
 * */
export default {
    model: {
        prop: 'model',
        event: 'changes'
    },
    name: 'ComFormItem',
    props: {
        model: {
            type: [Object, Array],
            default () {
                return {};
            }
        },
        option: {
            type: Array,
            default () {
                return [];
            }
        },
        labelWidth: {
            type: String,
            default: ''
        },
        size: {
            type: String,
            default: 'small'
        },
        prop: {
            type: Object,
            default () {
                return {
                    key: 'key',
                    label: 'label'
                };
            }
        }
    },
    data () {
        return {
            formModel: {},
            propData: {
                key: 'key',
                label: 'label'
            }
        };
    },
    created () {
        this.formModel = {...this.model};
        this.propData = {
            ...this.propData,
            ...this.prop
        };
    },
    watch: {
        formModel: {
            handler (val) {
                this.$emit('changes', val);
            },
            deep: true
        }
    }
};
</script>

<style scoped>

</style>
