
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="团队报表" name="team_report">
                <TargetTeamReport v-if="activeName == 'team_report'"></TargetTeamReport>
            </el-tab-pane>
            <el-tab-pane label="小组报表" name="group_report">
                <TargetGroupReport v-if="activeName == 'group_report'"></TargetGroupReport>
            </el-tab-pane>
            <el-tab-pane label="目标录入" name="entry_report" v-if="buttonList['entry_report'].permit(thisVm)">
                <TargetEntryPage v-if="activeName == 'entry_report'"></TargetEntryPage>
            </el-tab-pane>
        </el-tabs>
        <!--<div class="ui-not_authority-txt" v-if="!(buttonList['team_report'].permit(thisVm) && buttonList['group_report'].permit(thisVm) && buttonList['entry_report'].permit(thisVm))">-->
            <!--<img src="../../../../assets/image/empty2.png" alt="">-->
            <!--<p>无访问权限</p>-->
        <!--</div>-->
    </div>
</template>
<script>
    import TargetGroupReport from './TargetGroupReport'
    import TargetTeamReport from './TargetTeamReport'
    import TargetEntryPage from './TargetEntryPage'

    import {mapGetters} from "vuex";

    export default {
        components: {
            TargetTeamReport,
            TargetGroupReport,
            TargetEntryPage,

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
            ])
        },
        data () {
            return {
                thisVm: {},
                activeName: 'team_report',
            }
        },

        methods: {},
        created () {
            this.thisVm = this;
            this.activeName = this.$store.state.target_complete.activeShow || 'team_report';
        },
        watch: {
            activeName(val) {
                this.$store.state.target_complete.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">
    /deep/.ui-not_authority-txt {
        position: absolute;
        left: 50%;
        top: 30%;
    }
</style>