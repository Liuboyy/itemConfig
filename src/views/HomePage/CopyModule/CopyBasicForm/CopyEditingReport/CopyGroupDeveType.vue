<template>
    <div class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-if="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement label="展示类型">
                            <el-select
                                    filterable
                                    v-filter
                                    collapseTags
                                    size="small"
                                    @change="handleChangeType"
                                    v-model="queryData.view_type">
                                <el-option
                                        v-for="item in Object.entries(optionList.view_type)"
                                        :key="item[0]"
                                        :value="item[0]"
                                        :label="item[1]"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.view_type === 'd'">
                        <SearchRequirement label="统计日期" :pickerOptions="pickerOptions" template="splitDate" v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.view_type === 'm'">
                        <SearchRequirement label="统计月份" :pickerOptions="pickerOptions" template="splitMonth" v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li v-if="queryData.view_type === 'y'">
                        <SearchRequirement label="统计年份">
                            <el-date-picker
                                :picker-options="pickerOptions"
                                v-model="statYear"
                                :clearable="false"
                                size="small"
                                type="year"
                                format="yyyy"
                                value-format="yyyy"
                                placeholder="选择年">
                            </el-date-picker>
                            <el-date-picker
                                :picker-options="pickerOptions"
                                v-model="endYear"
                                :clearable="false"
                                size="small"
                                type="year"
                                format="yyyy"
                                value-format="yyyy"
                                placeholder="选择年">
                            </el-date-picker>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="产品线" >
                            <el-select
                                    filterable
                                    v-filter
                                    multiple
                                    collapseTags
                                    size="small"
                                    v-model="queryData.product_line">
                                <el-option
                                        v-for="item in optionList.product_line"
                                        :key="item.category_id_level_1"
                                        :value="item.category_id_level_1"
                                        :label="item.category_name_level_1"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="开发类型">
                            <el-select
                                    filterable
                                    v-filter
                                    multiple
                                    collapseTags
                                    size="small"
                                    v-model="queryData.develop_type">
                                <el-option
                                        v-for="item in Object.entries(optionList.develop_type)"
                                        :key="item[0]"
                                        :value="item[0]"
                                        :label="item[1]"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="文案小组">
                            <el-select
                                    @change="handleChangeGetStaff"
                                    filterable
                                    v-filter
                                    multiple
                                    collapseTags
                                    size="small"
                                    v-model="queryData.group_list">
                                <el-option
                                        v-for="item in optionList.group_list"
                                        :key="item.value"
                                        :value="item.value"
                                        :label="item.label"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="文案人员">
                            <el-select
                                    filterable
                                    v-filter
                                    multiple
                                    collapseTags
                                    size="small"
                                    :disabled="queryData.group_list == ''"
                                    v-model="queryData.copyStaff">
                                <el-option
                                        v-for="item in optionList.copyStaffList"
                                        :key="item.user_staff_id"
                                        :value="item.user_staff_id"
                                        :label="item.user_name"></el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun">查询</el-button>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button
                    v-if="item.method && item.permit(thisVm) && item.icon"
                    v-for="item in buttonList"
                    size="small"
                    :type="item.type"
                    :key="item.value"
                    :icon="item.icon"
                    @click="item.action(thisVm, item.method)">{{item.name}}</el-button>
        </div>
        <div class="ui-charts_box">
            <div class="radioBox">
                <el-radio-group class="radio" @change="changeEchart" v-model="radio" size="small">
                    <el-radio-button label="编辑数"></el-radio-button>
                    <el-radio-button label="平均数"></el-radio-button>
                </el-radio-group>
                <p v-if="echartTitle" class="echartTitle">{{echartName}}</p>
            </div>
            <div ref="myMap" class="ui-charts_bar"></div>
           
        </div>
        <ComTableInfo
                :otherHeight="['el-tabs__header','ui-charts_box']"
                ref="tableArea"
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :tableFixed="tableFixed"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch"
                :tableRowClassName="tableRowClassName"
                :cellMouseLeave="cellMouseLeave"
                :cellMouseEnter="cellMouseEnter"
        >
        </ComTableInfo>
    </div>
</template>
<script>
    import echarts from 'echarts'
    import {
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '@/assets/js/config';

    import {
        getPreDateRange,
        getMonthRange,
        getYearRange,
        validTime1
    } from '@/api/common/date_format'

    import {
        getProductLineList
    } from '@/api/copy_module/copy_editing_report'
    import {
        getGroupMember
    } from '../../../../../api/common/index'
    export default {
        data() {
            return {
                pickerOptions: {
                    disabledDate(time) {
                        return time.getTime() > Date.now();
                    },
                },
                option:{
                    color:['#5196fe','#f56c6c', '#8f88e5', '#45c8dc', '#67c23a', '#FA91A7','#e6a23c','#ffbeaf', '#bda29a', '#c0c4cc','#C0504D', '#FBDAFD', '#276A7C','#632523','#254061'],
                    tooltip : {
                        trigger: 'axis',
                        axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                            type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                        },
                        confine:true,
                    },
                    legend: {
                        data:[],
                        bottom:10,
                        // height:'150'
                    },
                    grid: {
                        left: '3%',
                        right: '1%',
                        bottom: '16%',
                        containLabel: true
                    },
                    xAxis : [
                        {
                            type : 'category',
                            data : [],
                            // axisTick:{
                            //     show:false
                            // },
                            // axisLabel:{
                            //     interval:0
                            // }
                        }
                    ],
                    yAxis : [
                        {
                            type : 'value'
                        }
                    ],
                    series : [
                        
                    ]
                },
                radio:'编辑数',
                echartType:'2',
                echartTitle:'',
                echartName:'',
                ECharts: {},
                showSearch: true,
                thisVm: {},

                queryData: {
                    date: [],
                    view_type:'d',
                    product_line:[],
                    group_list:[],
                    develop_type:[],
                    type:'1',
                    copyStaff:[],
                },
                statYear:'',
                endYear:'',
                optionList: {
                    product_line:[],//产品线
                    group_list: [],//文案小组
                    develop_type: [],//开发类型
                    view_type: [],//展示类型
                    copyStaffList:[],//组员列表
                },
                tableKey: [],
                tableProps: [],
                tableData: [],
                tableWidth: [],
                tableMinWidth:[],
                tableFixed:[
                    true
                ],
               
                //保存日期
                saveDefaultDate: [],
                saveDefaultMonth: [],
                saveDefaultYear: [],
                rowIndex: '-1',

                //判断是否查询产品线
                // isQueryLine: false,
            }
        },
        computed: {
            ...mapGetters([
                'buttonList',
                'queryParamsInfo',
                'copyGroupDeveTypeInfo',
                'comOptions'
            ]),
        },
        watch: {
           
            statYear(val){
                this.queryData.date[0]=val;
                if(!validTime1(this.statYear, this.endYear)) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
            },
            endYear(val){
                this.queryData.date[1]=val;
                if(!validTime1(this.statYear, this.endYear)) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
            }
        },
        methods: {
            ...mapActions([
                'GetCopyGroupDeveTypeInfo',
            ]),
            getGroupMember,
            init(option,val) {
                this.$nextTick(() => {
                    this.ECharts = echarts.init(this.$refs.myMap);
                    this.ECharts.setOption(option);
                })
            },
            //切换类型
            handleChangeType(val) {
                switch (val) {
                    case 'd':
                        this.queryData.date = this.saveDefaultDate;
                        break;
                    case 'm':
                        this.queryData.date = this.saveDefaultMonth;
                        break;
                    case 'y':
                        this.queryData.date = this.saveDefaultYear;
                        this.statYear=this.queryData.date[0].toString();
                        this.endYear=this.queryData.date[1].toString();
                        break;
                }
            },
            // 重置
            handleResetQueryInfo(){
                this.queryData.product_line= [];
                this.queryData.group_list= [];
                this.queryData.develop_type= [];
                this.queryData.copyStaff= [];
                this.queryData.view_type='d';
                this.handleChangeType(this.queryData.view_type)
                // this.handleGetDateRange();
            },
            // 查询
            handleQueryInfo(params, isFn) {
                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['copy_group_deveType']);
                }

                if(!validTime1(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                this.EchartOption(this.echartType)
                let obj = {
                    date_start: this.queryData.date[0],
                    date_end: this.queryData.date[1],
                    view_type:this.queryData.view_type,
                    product_line:this.queryData.product_line.length?this.queryData.product_line.join(','):'',
                    develop_type:this.queryData.develop_type.length?this.queryData.develop_type.join(','):'',
                    group:this.queryData.group_list.length?this.queryData.group_list.join(','):'',
                    group_member: this.queryData.copyStaff.length ? this.queryData.copyStaff.join(','):'',
                    type:this.queryData.type,
                };

                obj = Object.assign(obj || {}, params);
                this.GetCopyGroupDeveTypeInfo(obj).then(({ data}) => {
                    // 导出
                    if (data.status === 2) return;

                    if (data.status) {
                       this.handleQueryInfoCallBack(data);
                    }else {
                       this.$message.error(data.errorMess || '查询失败！');
                    }
                }).catch(err => {
                    console.log(err);
                })
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    is_excel: 1
                }, true)
            },

            //操作回调
            handleOperationCallBack(data) {
                if(data.status) {
                    this.$message.success('操作成功');
                    this.handleQueryInfo({limit: this.pageData.currentList});
                }else {
                    this.$message.error(data.errorMess || '操作失败')
                }
            },

            // 分页
            handleSizeChange(size) {
                this.handleQueryInfo({
                    limit: size,
                    offset: 1
                }, true);
            },
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            // 表格合并
            handleSpanMethod({ row, column, rowIndex, columnIndex }) {
                if (!columnIndex && this.isQueryLine) {
                    return {
                        rowspan: row.spanLength ? row.spanLength : 0,
                        colspan: 1
                    }
                }
            },

            //处理合并行悬浮问题
            cellMouseEnter(row) {
                this.rowIndex = row.rowIndex;
                this.$nextTick().then(() => {
                    if (document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])')) {
                        document.querySelector('.el-table__body tr.cell-row td:not([rowspan="1"])').style.backgroundColor = '#fdfdfd';
                    }
                })
            },
            cellMouseLeave() {
                this.rowIndex = '';
                const rowLists = document.querySelectorAll('.el-table__body tr td:not([rowspan="1"])');
                rowLists.forEach(_e => {
                    _e.style.backgroundColor = '#FFF';
                });
            },
            tableRowClassName({row}) {
                return row.rowIndex === this.rowIndex && 'cell-row'
            },

            //默认时间
            handleGetDateRange() {
                getPreDateRange().then((data) => {
                    this.queryData.date = [data.start, data.end];
                });
            },
            //获取小组人员
            handleChangeGetStaff(val) {
                if(!this.queryData.group_list || val) this.queryData.copyStaff = '';
                if(val) {
                    this.getGroupMember({
                        group_id: val?val.join(','):'',
                    }).then(({ data }) => {
                        this.optionList.copyStaffList = data.data;
                        this.handleSaveOptionList();
                    })
                }
            },

            //保存小组人员
            handleSaveOptionList() {
                this.$store.commit('SAVE_OPTION_LIST_INFO', {
                    key: 'copy_deveType',
                    value: this.optionList
                })
            },

            //查询回调
            handleQueryInfoCallBack(data){

                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'copy_group_deveType',
                    value: JSON.stringify(this.queryData)
                });

                //数据渲染
                this.tableKey = data.title;
                this.tableData = data.data;
                let props=[];
                this.tableKey.forEach((item,index)=>{
                    this.tableMinWidth.push('90');
                    if(index==0){
                        props.push('devp_type_name')
                    }else if(index==this.tableKey.length-1){
                        props.push('avg')
                    }else if(index==this.tableKey.length-2){
                        props.push('sum')
                    }else{
                        props.push(item)
                    }
                })
                this.tableProps = props;
                // this.isQueryLine = flag;
            },
            EchartOption(type){
                let obj = {
                    date_start: this.queryData.date[0],
                    date_end: this.queryData.date[1],
                    view_type:this.queryData.view_type,
                    product_line:this.queryData.product_line.length?this.queryData.product_line.join(','):'',
                    develop_type:this.queryData.develop_type.length?this.queryData.develop_type.join(','):'',
                    group:this.queryData.group_list.length?this.queryData.group_list.join(','):'',
                    group_member:this.queryData.copyStaff.length?this.queryData.copyStaff.join(','):'',
                    type:type,
                };
                this.GetCopyGroupDeveTypeInfo(obj).then(({ data}) => {
                    // 导出
                    if (!data.status) {
                        this.$message.error(data.errorMess || '查询失败！');
                        return;
                    }
                    if(type=='2'){
                        this.setEchar(data)
                    }else if(type=='3'){
                        this.echartName=this.queryData.view_type=='d'?'日均数量':this.queryData.view_type=='m'?'月均数量':'年均数量';
                        this.ECharts.dispose && this.ECharts.dispose();
                        if(data.data.length){
                            var xAxisData=[
                                {
                                    type : 'category',
                                    data : [],
                                    axisTick: {
                                        alignWithLabel: true
                                    },
                                    axisLabel:{  
                                        interval:0,//横轴信息全部显示  
                                        rotate:32,//-15度角倾斜显示  
                                    },
                                }
                            ];
                            var serieslist=[
                                    { 
                                        name:'值',
                                        type:'bar',
                                        data:[],
                                        itemStyle: {        //上方显示数值
                                            normal: {
                                                label: {
                                                    show: true, //开启显示
                                                    position: 'top', //在上方显示
                                                    textStyle: { //数值样式
                                                        color: 'black',
                                                        fontSize: 16
                                                    }
                                                }
                                            }
                                        }
                                    }
                                ];
                            data.data.forEach(item=>{
                                serieslist[0].data.push(item.avg)
                                xAxisData[0].data.push(item.devp_type_name)
                            })
                            this.option.xAxis=xAxisData;
                            this.option.series=JSON.parse(JSON.stringify(serieslist));
                            this.option.legend.data.length=0;
                            this.$nextTick().then(() => {
                                this.init(this.option);
                            })
                            
                        }else{
                            this.option.xAxis=[];
                            this.option.series=[];
                            this.option.legend.data.length=0;
                            // this.$nextTick().then(() => {
                            //         this.init(this.option);
                            //     })
                        }
                        
                    }
                    
                }).catch(err => {
                    console.log(err);
                })
            },
            setEchar(data){
                var vm=this;
                
                this.ECharts.dispose && this.ECharts.dispose();
                if(data.data.length){
                    var datalist=data.data;
                    var datearry=[
                        {
                            type : 'category',
                            data : [],
                            axisTick: {
                                alignWithLabel: true//刻度与标签对齐
                            },
                            axisLabel:{  
                                interval:0,//横轴信息全部显示  
                                rotate:32,//-15度角倾斜显示  
                            },
                        }
                    ];
                    var series=[];
                    var seriesarry=[];
                    var legend=[];
                    datalist.forEach(item=>{
                        datearry[0].data.push(item.date)
                        series.push(item.list)
                    })
                    series.forEach((item,ind)=>{
                        item.forEach((it,i)=>{
                            if(ind==0){
                                seriesarry.push(it)
                                legend.push(it.site)
                                vm.$set(seriesarry[i],'name','');
                                vm.$set(seriesarry[i],'type','');
                                vm.$set(seriesarry[i],'stack','');
                                vm.$set(seriesarry[i],'data',[]);
                                seriesarry[i].name=it.site;
                                seriesarry[i].type='bar';
                                seriesarry[i].stack='总量';
                            }
                            if(seriesarry[i].name==it.site){
                                seriesarry[i].data.push(it.count_spu)
                            }
                        })
                    })
                    seriesarry[0].type='line';
                    seriesarry[0].stack='';
                    vm.$set(seriesarry[0],'itemStyle',{});
                    vm.$set(seriesarry[0].itemStyle,'normal',{});
                    vm.$set(seriesarry[0].itemStyle.normal,'label',{});
                    seriesarry[0].itemStyle.normal.label.show=true;
                    this.option.xAxis=datearry;
                    this.option.series=JSON.parse(JSON.stringify(seriesarry));
                   this.option.legend.data=legend;
                   this.init(this.option);
                    
                }else{
                    this.option.xAxis=[];
                    this.option.series.length=0;
                    this.option.legend.length=0;
                    // this.init(this.option);
                }
                
            },
            changeEchart(val){
                if(val=='编辑数'){
                    this.echartType='2'
                    this.EchartOption('2')
                    this.echartTitle=false
                }else if(val=='平均数'){
                    this.echartType='3'
                    this.EchartOption('3')
                    this.echartTitle=true
                }
            },
            
        },
        created(){
            this.thisVm = this;
            try{
                getProductLineList().then(({ data }) => {
                    this.optionList.product_line = data.data.product_line;
                    this.optionList.group_list = data.data.group_list.list;
                    this.optionList.develop_type = data.data.develop_type;
                    this.optionList.view_type = data.data.view_type;
                });
                getYearRange().then(( data ) => {
                    this.saveDefaultYear = [data.start, data.end];
                    getMonthRange().then(( data ) => {
                        this.saveDefaultMonth = [data.start, data.end];
                        getPreDateRange().then((data) => {
                            this.saveDefaultDate = [data.start, data.end];
                             this.queryData.date = [data.start, data.end];
                            if (JSON.stringify(this.copyGroupDeveTypeInfo.tables) === '{}') {
                               
                                this.handleQueryInfo();
                            } else {
                                // 获取保存的查询参数
                                this.queryData = JSON.parse(this.queryParamsInfo['copy_group_deveType']);
                                this.handleChangeGetStaff(this.queryData.group_list);
                                this.handleQueryInfoCallBack(this.copyGroupDeveTypeInfo.tables);
                                this.setEchar(this.copyGroupDeveTypeInfo.echart1)
                                this.statYear=this.queryData.date[0].toString();
                                this.endYear=this.queryData.date[1].toString();
                                if (this.comOptions['copy_deveType']) this.optionList = this.comOptions['copy_deveType'];
                            }
                        });
                    })
                })
            }catch (e) {
                console.log(e);
            }
        },
        mounted() {
            this.ECharts.dispose && this.ECharts.dispose();
            this.$nextTick(() => {
                this.init(this.option);
            })
            
        },
    }
</script>
<style lang="less" scoped>
.ui-charts_bar{
    height: 400px!important;
    width: 97%!important;
}
.radioBox{
  display: flex;
  z-index: 999;
  justify-content: center;
  position: relative;
  .radio{
      position: absolute;
      top: 10px;
      left: 8%;
  }
  .echartTitle{
      position: absolute;
      top: 10px;
  }
}
</style>
