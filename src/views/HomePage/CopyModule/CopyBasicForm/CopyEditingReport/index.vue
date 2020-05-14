<!--文案编辑报表-->
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="文案小组" name="team">
                <CopyGroupTeam v-if="activeName == 'team'"></CopyGroupTeam>
            </el-tab-pane>
            <el-tab-pane label="文案组员" name="member">
                <CopyGroupMember v-if="activeName == 'member'"></CopyGroupMember>
            </el-tab-pane>
            <el-tab-pane label="产品线" name="productLine">
                <CopyGroupProductLine v-if="activeName == 'productLine'"></CopyGroupProductLine>
            </el-tab-pane>
            <el-tab-pane label="开发类型" name="deveType">
                <CopyGroupDeveType v-if="activeName == 'deveType'"></CopyGroupDeveType>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import CopyGroupTeam from './CopyGroupTeam'
    import CopyGroupMember from './CopyGroupMember'
    import CopyGroupProductLine from './CopyGroupProductLine'
    import CopyGroupDeveType from './CopyGroupDeveType'
    
    import {mapGetters} from "vuex";

    export default {
        components: {
          CopyGroupTeam,
          CopyGroupMember,
          CopyGroupProductLine,
          CopyGroupDeveType
        },
        computed: {...mapGetters([ 'queryParamsInfo'])},
        data () {
            return {
                activeName: 'team',
            }
        },

        methods: {},
        created () {
            this.activeName = this.$store.state.copy_editing_report.activeShow || 'team';
        },
        watch: {
            activeName(val) {
                this.$store.state.copy_editing_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">


</style>