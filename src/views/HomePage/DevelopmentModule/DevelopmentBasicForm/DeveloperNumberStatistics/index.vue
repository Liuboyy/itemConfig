<!--开发平均数量统计-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="开发小组" name="group">
                <DeveloperGroupNumberStatistics v-if="activeName == 'group'"></DeveloperGroupNumberStatistics>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="product">
                <DeveloperLineNumberStatistics v-if="activeName == 'product'"></DeveloperLineNumberStatistics>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import DeveloperGroupNumberStatistics from './DeveloperGroupNumberStatistics'
    import DeveloperLineNumberStatistics from './DeveloperLineNumberStatistics'

    import {mapGetters} from "vuex";

    export default {
        components: {
            DeveloperGroupNumberStatistics,
            DeveloperLineNumberStatistics,

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
            this.activeName = this.$store.state.developer_time_statistics.activeShow || 'group';
        },


        watch: {
            activeName(val) {
                this.$store.state.developer_time_statistics.activeShow = val;
            }
        },
    }

</script>
<style scoped lang="less">


</style>