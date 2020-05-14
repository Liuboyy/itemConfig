<!--各成本区间SPU开发数-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="开发小组" name="group">
                <DevelopmentGroupPage v-if="activeName == 'group'"></DevelopmentGroupPage>
            </el-tab-pane>
            <el-tab-pane label="开发人员" name="staff">
                <DeveloperPage v-if="activeName == 'staff'"></DeveloperPage>
            </el-tab-pane>
            <el-tab-pane label="开发类型" name="type">
                <DevelopmentTypePage v-if="activeName == 'type'"></DevelopmentTypePage>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="product">
                <ProductLinePage v-if="activeName == 'product'"></ProductLinePage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DevelopmentGroupPage from './DevelopmentGroupPage'
    import DeveloperPage from './DeveloperPage'
    import DevelopmentTypePage from './DevelopmentTypePage'
    import ProductLinePage from './ProductLinePage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DevelopmentGroupPage,
            DeveloperPage,
            DevelopmentTypePage,
            ProductLinePage,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.cost_development_number.activeShow || 'group';
        },
        watch: {
            activeName(val) {
                this.$store.state.cost_development_number.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>