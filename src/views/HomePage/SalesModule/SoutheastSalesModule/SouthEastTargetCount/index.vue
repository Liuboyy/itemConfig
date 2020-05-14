
<template>
    <div class="ui-tabs_box">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="小组报表" name="group_report">
                <GroupReport v-if="activeName == 'group_report'"></GroupReport>
            </el-tab-pane>
            <el-tab-pane label="账号报表" name="account_report">
                <AccountReport v-if="activeName == 'account_report'"></AccountReport>
            </el-tab-pane>
            <el-tab-pane label="目标录入" name="target_entry" v-if="buttonList['target_entry'].permit(thisVm)">
                <TargetEntry v-if="activeName == 'target_entry'"></TargetEntry>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>
<script>
    import AccountReport from './AccountReport'
    import GroupReport from './GroupReport'
    import TargetEntry from './TargetEntry'

    import {mapGetters} from "vuex";

    export default {
        components: {
            GroupReport,
            AccountReport,
            TargetEntry,

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
                activeName: 'account_report',
            }
        },

        methods: {},
        created () {
            this.thisVm = this;
            this.activeName = this.$store.state.south_ease_target.activeShow || 'group_report';
        },
        watch: {
            activeName(val) {
                this.$store.state.south_ease_target.activeShow = val;
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