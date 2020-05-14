<!--各成本区间SKU开发数-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="产品线" name="product">
                <CostNumberSkuProductLine v-if="activeName == 'product'"></CostNumberSkuProductLine>
            </el-tab-pane>
            <el-tab-pane label="开发小组" name="group">
                <CostNumberSkuDevGroup v-if="activeName == 'group'"></CostNumberSkuDevGroup>
            </el-tab-pane>
            <el-tab-pane label="开发人员" name="staff">
                <CostNumberSkuDeveloper v-if="activeName == 'staff'"></CostNumberSkuDeveloper>
            </el-tab-pane>
            <el-tab-pane label="开发类型" name="type">
                <CostNumberSkuDevType v-if="activeName == 'type'"></CostNumberSkuDevType>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import CostNumberSkuDevGroup from './CostNumberSkuDevGroup'
    import CostNumberSkuDeveloper from './CostNumberSkuDeveloper'
    import CostNumberSkuDevType from './CostNumberSkuDevType'
    import CostNumberSkuProductLine from './CostNumberSkuProductLine'

    import {mapGetters} from "vuex";

    export default {
        components: {
            CostNumberSkuDevGroup,
            CostNumberSkuDeveloper,
            CostNumberSkuDevType,
            CostNumberSkuProductLine,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'product',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.cost_development_number_sku.activeShow || 'product';
        },
        watch: {
            activeName(val) {
                this.$store.state.cost_development_number_sku.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>