<!--样品审核报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="开发小组" name="group">
                <SampleDevelopmentGroup v-if="activeName == 'group'"></SampleDevelopmentGroup>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="productLine">
                <SampleProductLine v-if="activeName == 'productLine'"></SampleProductLine>
            </el-tab-pane>
            <el-tab-pane label="TQE" name="tqe">
                <SampleTqeReport v-if="activeName == 'tqe'"></SampleTqeReport>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import SampleDevelopmentGroup from './SampleDevelopmentGroup.vue'
    import SampleProductLine from './SampleProductLine.vue'
    import SampleTqeReport from './SampleTqeReport.vue'

    import {mapGetters} from "vuex";

    export default {
        components: {
            SampleDevelopmentGroup,
            SampleProductLine,
            SampleTqeReport,
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'group',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.sample_audit_report.activeShow || 'group';
        },
        watch: {
            activeName(val) {
                this.$store.state.sample_audit_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>