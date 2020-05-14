<!--开发目标完成统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="开发小组" name="group">
                <DevelopmentGroupCountPage v-if="activeName == 'group'"></DevelopmentGroupCountPage>
            </el-tab-pane>
            <el-tab-pane label="开发人员" name="staff">
                <DeveloperCountPage v-if="activeName == 'staff'"></DeveloperCountPage>
            </el-tab-pane>
            <el-tab-pane label="开发类型" name="type">
                <DevelopmentTypeCountPage v-if="activeName == 'type'"></DevelopmentTypeCountPage>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="product">
                <ProductLineCountPage v-if="activeName == 'product'"></ProductLineCountPage>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DevelopmentGroupCountPage from './DevelopmentGroupCountPage'
    import DeveloperCountPage from './DeveloperCountPage'
    import DevelopmentTypeCountPage from './DevelopmentTypeCountPage'
    import ProductLineCountPage from './ProductLineCountPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DevelopmentGroupCountPage,
            DeveloperCountPage,
            DevelopmentTypeCountPage,
            ProductLineCountPage,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {

        },
        created () {
            this.activeName = this.$store.state.development_goal_statistics.activeShow || 'group';
        },


        watch: {
            activeName(val) {
                this.$store.state.development_goal_statistics.activeShow = val;
            }
        },
    }

</script>
<style scoped lang="less">


</style>