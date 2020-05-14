<template>
    <el-table  ref="myTable" highlight-current-row  border stripe
               :data="tableData"  :cell-style="cellStyle" :height="tableHeight">
        <el-table-column label="产品线" prop="linelist_cn_name" fixed width="100"></el-table-column>
        <el-table-column label="总计">
            <el-table-column label="总计">
                <span slot slot-scope="scope">{{scope.row.total.day || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
            <el-table-column label="国内+FBA">
                <span slot slot-scope="scope">{{scope.row.total.site || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
            <el-table-column label="海外">
                <span slot slot-scope="scope">{{scope.row.total.oversea || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
            <el-table-column label="代销">
                <span slot slot-scope="scope">{{scope.row.total.sale || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
        </el-table-column>
        <el-table-column
                v-for="(item, key, index) in tableKey"
                :key="index"
                :label="item">
            <el-table-column label="小计">
                <span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].day) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
            <el-table-column label="国内+FBA">
                <span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].site) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
            <el-table-column label="海外">
                <span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].oversea) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
            <el-table-column label="代销">
                <span slot slot-scope="scope">{{(scope.row[key] && scope.row[key].sale) || (scope.row.total.sele == 1 ? '0.0' : '0.00')}}</span>
            </el-table-column>
        </el-table-column>
        <template slot="empty">
            <div><NotData v-show="!tableData.length"></NotData></div>
        </template>
    </el-table>
</template>
<script>
    import config from '@/assets/js/config';
    export default{
        name: 'TableIndex',
        props: {
            tableData: {
                type: Array,
                default() {
                    return []
                }
            },
            tableKey: {
                type: [Array, Object],
                default() {
                    return [[], {}]
                }
            },
            tableHeight: {
                type: String,
                default: ''
            },
            //指定行样式
//            cellStyle: {
//                type: Function,
//                default () {
//                    return () => {};
//                }
//            },
            showSearch: {
                type: Boolean,
                default: true
            },
        },
        data(){
            return {}
        },
        computed: {},
        methods: {
            //小计底纹
            cellStyle(row, column, rowIndex, columnIndex) {
                if(row.row.linelist_cn_name == '小计') {
                    return 'background: #f3f6fa'
                }
            },
        },
        created() {},
    }
</script>
<style scope lang="less">
</style>