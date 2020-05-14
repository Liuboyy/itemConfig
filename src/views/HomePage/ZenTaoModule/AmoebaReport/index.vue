
<template>
    <div class="ui-tabs_box" v-if="!flag">
        <el-tabs v-model="activeName" type="card">
            <el-tab-pane label="研发工时统计" name="summary" v-if="buttonList['summary'] && buttonList['summary'].permit(thisVm)">
                <AmoebaSummary v-if="activeName === 'summary'"></AmoebaSummary>
            </el-tab-pane>
            <el-tab-pane label="需求明细" name="detail" v-if="buttonList['detail'] && buttonList['detail'].permit(thisVm)">
                <AmoebaDetails v-if="activeName === 'detail'"></AmoebaDetails>
            </el-tab-pane>
            <el-tab-pane label="配置" name="config" v-if="buttonList['config'] && buttonList['config'].permit(thisVm)">
                <AmoebaConfig v-if="activeName === 'config'"></AmoebaConfig>
            </el-tab-pane>
        </el-tabs>
    </div>
    <div v-else>
        <NotData></NotData>
    </div>

</template>
<script>
    import AmoebaSummary from './AmoebaSummary'
    import AmoebaDetails from './AmoebaDetails'
    import AmoebaConfig from './AmoebaConfig'

    import {mapGetters} from "vuex";

    export default {
        components: {
            AmoebaSummary,
            AmoebaDetails,
            AmoebaConfig,
        },
        computed: {...mapGetters([ 'queryParamsInfo', 'buttonList'])},
        data () {
            return {
                activeName: '',
                thisVm: {},
                firstTag: '',
                flag: false,
            }
        },

        methods: {},
        created () {
            this.flag = !(this.buttonList['summary'].permit(this.thisVm) || this.buttonList['detail'].permit(this.thisVm)||
            this.buttonList['config'].permit(this.thisVm));
            const queryModule = ['config','detail','summary',];
            for (let i = 0; i < queryModule.length; i++) {
                if (this.buttonList[queryModule[i]].permit(this.thisVm)) {
                    this.firstTag = queryModule[i];
                }
            }

            this.thisVm = this;
            this.activeName = this.$store.state.amoeba_report.activeShow || this.firstTag;
        },
        watch: {
            activeName(val) {
                this.$store.state.amoeba_report.activeShow = val;
            }
        }

    }
</script>
<style scoped lang="less">

    /deep/.ui-not_data-txt {
        margin-top: 18%;
        color: #909399;
        font-size: 12px;
    }


</style>