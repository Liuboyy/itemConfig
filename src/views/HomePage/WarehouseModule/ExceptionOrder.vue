<template>
    <div  class="ui-main-module">
        <transition name="slide-fade">
            <div class="ui-search-area" v-show="showSearch">
                <ul class="ui-main-module-search clearFix">
                    <li>
                        <SearchRequirement
                                label="日期"
                                template="splitDate"
                                v-model="queryData.date">
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="平台">
                            <el-select
                                    filterable
                                    v-filter
                                    clearable
                                    multiple
                                    collapse-tags
                                    v-model="queryData.platform_code_list"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="(label, value) in optionList.platformCodeList"
                                        :key="value"
                                        :label="label"
                                        :value="value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="大仓">
                            <el-select filterable v-filter clearable multiple collapse-tags
                                       v-model="queryData.warehouse_category_list"
                                       placeholder="请选择"
                                       size="small">
                                <el-option
                                        v-for="(label, value) in optionList.warehouseCategoryList"
                                        :key="value"
                                        :label="label"
                                        :value="value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="仓库">
                            <el-select
                                    filterable
                                    v-filter
                                    clearable
                                    multiple
                                    collapse-tags
                                    v-model="queryData.warehouse_id_list"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="(label, value) in optionList.warehouseCodeList"
                                        :key="value"
                                        :label="label"
                                        :value="value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="异常类型">
                            <el-select
                                    filterable
                                    v-filter
                                    clearable
                                    multiple
                                    collapse-tags
                                    v-model="queryData.abnormity_superclass_list"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="(label, value) in optionList.abnormityList"
                                        :key="value"
                                        :label="label"
                                        :value="value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                    <li>
                        <SearchRequirement label="部门">
                            <el-select
                                    filterable
                                    v-filter
                                    clearable
                                    multiple
                                    collapse-tags
                                    v-model="queryData.department"
                                    placeholder="请选择"
                                    size="small">
                                <el-option
                                        v-for="(label, value) in optionList.departmentList"
                                        :key="value"
                                        :label="label"
                                        :value="value">
                                </el-option>
                            </el-select>
                        </SearchRequirement>
                    </li>
                </ul>
                <div class="ui-filter-btn">
                    <el-button @click="handleResetQueryInfo()" size="small" icon="icon-zhongzhi">重置</el-button>
                    <el-button size="small" type="primary" @click="handleQueryInfo()" icon="icon-chaxun" >查询</el-button>
                </div>
            </div>
        </transition>
        <div class="ui-fn-module">
            <span class="ui-top_i" @click="showSearch = !showSearch"><ComIcon :name="showSearch ? 'shrink_up' : 'shrink_down'"></ComIcon></span>
            <el-button size="small" type="text" icon="icon-daochu icon-main" @click="handleExportInfo">导出</el-button>
            <el-popover
                    placement="right-start"
                    width="320"
                    trigger="hover">
                <div style="font-size: 12px">异常订单总量=进入相应类目下的总订单量(选择时间段内的)</div>
                <el-button slot="reference" type="text" icon="el-icon-info">名词解释</el-button>
            </el-popover>
        </div>
        <ComTableInfo
                :tableKey="tableKey"
                :tableProps="tableProps"
                :tableData="tableData"
                :tableWidth="tableWidth"
                :tableMinWidth="tableMinWidth"
                :showSearch="showSearch">
            <template v-if="index > 2 && index < 24" v-for="(item, index) in tableProps" :slot="item" slot-scope="scope">
                <span class = "ui-link" @click="handlePreviewDetailInfo({ abnormity_superclass: item, platform_code: scope.row.platform_code})">{{scope.row[item]}}</span>
            </template>
        </ComTableInfo>

        <!--<div class="ui-main-module-page">-->
            <!--<el-pagination-->
                    <!--@size-change="handleSizeChange"-->
                    <!--@current-change="handleCurrentChange"-->
                    <!--:current-page="pageData.currentPage"-->
                    <!--:page-sizes="pageSizes"-->
                    <!--size="small"-->
                    <!--:page-size="pageData.currentList"-->
                    <!--layout="total, sizes, prev, pager, next, jumper"-->
                    <!--:total="pageData.currentTotal">-->
            <!--</el-pagination>-->
        <!--</div>-->

        <div class="ui-dialog">
            <ComDialogPreview
                    isPage
                    isButton
                    title="查看详情"
                    width="1200px"
                    :visible.sync="isShowDetails"
                    :tableKey="detailInfo.key"
                    :tableProps="detailInfo.props"
                    :tableData="detailInfo.data"
                    :tableWidth="detailInfo.width"
                    :dialogPageData="detailInfo.page"
                    @dialogPageChange="handleDetailPageChange"
                    @export="handleDialogExportInfo">
                <!--<template>-->
                    <!--<div class="ui-search-area ui-dialog_search">-->
                        <!--<ul class="ui-main-module-search clearFix">-->
                            <!--<li>-->
                                <!--<SearchRequirement label="大仓">-->
                                    <!--<el-select filterable v-filter clearable multiple collapse-tags-->
                                            <!--v-model="dialog.warehouse_category_list"-->
                                            <!--placeholder="请选择"-->
                                            <!--size="small">-->
                                        <!--<el-option-->
                                                <!--v-for="(label, value) in optionList.warehouseList"-->
                                                <!--:key="value"-->
                                                <!--:label="label"-->
                                                <!--:value="value">-->
                                        <!--</el-option>-->
                                    <!--</el-select>-->
                                <!--</SearchRequirement>-->
                            <!--</li>-->
                            <!--<li class="ui-filter-btn ui-dialog_btn">-->
                                <!--<el-button size="small" icon="icon-zhongzhi" @click="dialog.warehouse_category_list = ''">重置</el-button>-->
                                <!--<el-button size="small" type="primary" icon="icon-chaxun" @click="handleQueryDetailInfo">查询</el-button>-->
                                <!--&lt;!&ndash;<el-button size="small" type="primary" icon="icon-chaxun">导出</el-button>&ndash;&gt;-->
                            <!--</li>-->
                        <!--</ul>-->
                    <!--</div>-->
                <!--</template>-->
            </ComDialogPreview>

        </div>
    </div>
</template>

<script>
    import config from '@/assets/js/config';
    import {
        autoAddTableInx
    } from '@/services';
    import {
        mapActions,
        mapGetters
    } from "vuex";
    import {
        getExceptionOrderInfo,
        getDetailInfo
    } from '@/api/warehouse_module/exception_order';

    import {
        getCountDate,
        validTime
    } from '@/api/common/date_format'

    const component_name = 'exception_order'
    export default {
        name: component_name,
        data() {
            return {

                // 初始化实例对象
                thisVm: {},

                //搜索缩进
                showSearch: true,

                queryData: {
                    date: [],
                    platform_code_list: [],
                    warehouse_id_list: [],
                    abnormity_superclass_list: [],
                    department: [],
                    warehouse_category_list: [],
                },
                queryDetailData: {
                    sku: '',
                },
                dialog: {
                    warehouse_category_list: []
                },
                optionList: {
                    platformCodeList: {
                        "JD": "JD",
                        "EB": "Ebay",
                        "ALI": "Aliexpress",
                        "WISH": "Wish",
                        "AMAZON": "Amazon",
                        "LAZADA": "LAZADA",
                        "SHOPEE": "SHOPEE",
                        "CDISCOUNT": "CDISCOUNT",
                        "WALMART": "WALMART",
                        "MALL": "MALL",
                        "PF": "私下批发",
                        "BB": "Alibaba",
                        "JOOM": "JOOM",
                        "DDP": "大单批发",
                        "STR": "11street",
                        "JUM": "jumia",
                        "JET": "JET",
                        "GRO": "Groupon",
                        "DIS": "分销",
                        "SPH": "自发头程备货",
                        "INW": "独立网站",
                        "JOL": "jollychic",
                        "SOU": "Souq",
                        "PM": "priceminister",
                        "WADI": "Wadi",
                        "OBERLO": "oberlo",
                        "WJFX": "旺集分销",
                        "ALIXX": "速卖通线下订单",
                        "BORROW": "借用领用订单",
                        "NEWEGG": "newegg",
                        "VOVA": "vova",
                        "TOP": "tophatter",
                        "KiKUU": "KiKUU",
                        "JDTH": "JDTH",
                        "NOON": "NOON",
                        "WYLFX": "WYLFX",
                        "CAT": "CAT",
                        "FNAC": "FNAC",
                        "MERC": "MercadoLibre",
                        "DAR": "daraz",
                        "RAKUTEN": "rakuten",
                        "GE": "GoogleExpress",
                        "ALLEGRO": "ALLEGRO"
                    },
                    warehouseCodeList: {
                        "274": "亚马逊MCO5美国仓（33897）",
                        "275": "亚马逊SDF1美国仓（42718）",
                        "276": "亚马逊TPA1美国仓（33570）",
                        "277": "亚马逊MIA5美国仓（33182）",
                        "278": "亚马逊CMH2美国仓（43125-9016）",
                        "279": "亚马逊MSP1美国仓（55379）",
                        "280": "亚马逊LGB4美国仓（92374）",
                        "281": "亚马逊MDW7美国仓（60449）",
                        "282": "亚马逊HOU2美国仓（77090）",
                        "283": "亚马逊JAX2美国仓（32218）",
                        "284": "亚马逊MKC6美国仓（66102）",
                        "285": "亚马逊TEB3美国仓（08085）",
                        "286": "亚马逊MDT2美国仓（21901）",
                        "287": "亚马逊CLN2美国仓（28214-8082）",
                        "288": "亚马逊DET1美国仓（48150）",
                        "289": "亚马逊SMF1美国仓（95837）",
                        "290": "亚马逊DTM1德国仓（59368）",
                        "291": "亚马逊YYZ1加拿大仓（L5N 1L8）",
                        "292": "亚马逊YYZ2加拿大仓（L9T0K1）",
                        "293": "亚马逊YYZ3加拿大仓（ONL6Y5Z4）",
                        "294": "亚马逊YYZ4加拿大仓（L6Y0C9）",
                        "295": "亚马逊YVR2加拿大仓（V3M5Y9）",
                        "296": "亚马逊YVR3加拿大仓（V3L5H4）",
                        "297": "亚马逊NRT5日本仓（350-1182）",
                        "298": "亚马逊HND3日本仓（350-0195）",
                        "299": "亚马逊KIX1日本仓（590-8589）",
                        "300": "亚马逊KIX2日本仓（574-8531）",
                        "301": "亚马逊HSG1日本仓（841-8505）",
                        "302": "亚马逊FSZ1日本仓（250-8560）",
                        "303": "亚马逊NRT1日本仓（272-0193）",
                        "304": "亚马逊NRT2日本仓（276-8525）",
                        "305": "亚马逊NGO2日本仓（507-8585）",
                        "306": "亚马逊KIX4日本仓（583-8533）",
                        "307": "亚马逊MEX2墨西哥（54769）",
                        "308": "万邑通澳洲悉尼存储仓",
                        "309": "万邑通英国存储仓",
                        "310": "万邑通美南仓-USTX（EBAY）",
                        "311": "CD-虚拟仓",
                        "312": "亚马逊MEL1澳洲仓（3175）",
                        "313": "亚马逊LTN1英国仓（MK43）",
                        "314": "万邑通德国存储仓",
                        "315": "亚马逊-虚拟仓",
                        "316": "FBA虚拟仓_塘厦",
                        "317": "FBA精品仓_塘厦",
                        "318": "lazada马来西亚仓",
                        "319": "海外虚拟仓_塘厦",
                        "320": "亚马逊FBA加拿大仓",
                        "321": "FBA退税仓_塘厦",
                        "322": "万邑通英国UKGF仓库（Kevin）",
                        "323": "FBA汇总仓(显示FBA销售量）",
                        "324": "FBL虚拟仓",
                        "325": "谷仓捷克仓",
                        "326": "万邑通德国存储仓（eBay）",
                        "327": "万邑通德国存储仓（wish）",
                        "328": "万邑通德国存储仓（亚马逊）",
                        "329": "万邑通德国存储仓（Aliexpress）",
                        "330": "万邑通英国存储仓（Ebay）",
                        "331": "万邑通英国存储仓（wish）",
                        "1": "小包仓_塘厦",
                        "2": "中转仓_虎门",
                        "30": "亚马逊FBA美国仓",
                        "33": "中转仓_慈溪",
                        "35": "万邑通德国仓(DE Warehouse)",
                        "36": "万邑通澳洲悉尼仓",
                        "38": "万邑通英仓-UK Warehouse",
                        "40": "出口易英国仓",
                        "41": "出口易德国仓",
                        "42": "出口易澳洲仓",
                        "43": "出口易美仓-旧金山仓",
                        "44": "万邑通英仓-UKGF ",
                        "45": "递四方英国伦敦仓库（亚马逊FBA退货上架）",
                        "46": "递四方德国法兰克福仓库",
                        "47": "万邑通美东仓-USKYN",
                        "48": "易佰美国仓",
                        "49": "谷仓美国西仓",
                        "50": "谷仓美国东仓",
                        "51": "英法虚拟仓",
                        "53": " MBB(新易贸德国仓)",
                        "54": "出口易美仓-安大略仓",
                        "55": "出口易美仓-新泽西仓",
                        "58": "万邑通美西仓-USWC",
                        "59": "万邑通美南仓-USTX",
                        "60": "代销仓库",
                        "61": "旺集莫斯科仓",
                        "62": "递四方西班牙仓",
                        "64": "代销仓库（灯）",
                        "65": "LAZADA代发货仓库",
                        "66": "执御虚拟仓",
                        "67": "中美虚拟仓-沃尔玛",
                        "68": "中美虚拟仓-eBay",
                        "69": "谷仓美国西仓(ebay)",
                        "70": "谷仓美国东仓(ebay)",
                        "72": "谷仓美国西仓(Walmart)",
                        "73": "谷仓美国东仓(Walmart)",
                        "74": "谷仓美国东仓(wish)",
                        "75": "谷仓美国西仓(wish)",
                        "76": "谷仓美国东仓(亚马逊)",
                        "77": "谷仓美国西仓(亚马逊)",
                        "78": " 万邑通美西仓-USWC(wish)",
                        "79": "万邑通美东仓-USKYN(wish)",
                        "80": "万邑通美东仓-USKYN(ebay)",
                        "81": "万邑通美西仓-USWC(ebay)",
                        "82": "万邑通美西仓-USWC(亚马逊)",
                        "83": "万邑通美东仓-USKYN(亚马逊)",
                        "84": "万邑通美东仓-USKYN(Walmart)",
                        "85": "万邑通美西仓-USWC(Walmart)",
                        "86": "递四方德国仓（捷克布拉格仓）",
                        "87": "谷仓英国仓（Kevin）",
                        "88": "谷仓英国仓",
                        "89": "谷仓美国东仓（KEVIN）",
                        "90": "谷仓美国西仓（KEVIN）",
                        "91": "万邑通澳洲悉尼仓(wish)",
                        "92": "万邑通澳洲悉尼仓(eBay)",
                        "93": "万邑通澳洲悉尼仓(亚马逊)",
                        "94": "万邑通德国仓（wish）",
                        "95": "万邑通德国仓（eBay）",
                        "96": "万邑通德国仓（亚马逊）",
                        "97": "万邑通英国仓（eBay）",
                        "98": "万邑通英国仓（wish）",
                        "99": "万邑通英国仓（亚马逊）",
                        "100": "出口易英国仓（Kevin）",
                        "101": "万邑通英国UKMA仓库（Kevin）",
                        "102": " 万邑通英国UKGF仓库",
                        "103": "万邑通英国仓（Kevin）",
                        "104": "亚马逊ONT2美国仓（92408）",
                        "105": "亚马逊CLT2美国仓（28214-8082）",
                        "106": "亚马逊FTW1美国仓（75241-7203）",
                        "107": "亚马逊SAT1美国仓（78154-1461）",
                        "108": "亚马逊ONT8美国仓（92551）",
                        "109": "亚马逊BFI3美国仓（98327）",
                        "110": "FBS沙特仓",
                        "111": "亚马逊SJC7美国仓（95391）",
                        "112": "谷仓美国仓（Kevin）",
                        "113": "亚马逊ONT5美国仓（ 92408-2606）",
                        "114": "亚马逊ONT6美国仓（92551）",
                        "115": "亚马逊ONT8美国仓（92551）",
                        "116": "亚马逊ONT9美国仓（92374）",
                        "117": "亚马逊SNA4美国仓（92376-3009）",
                        "118": "亚马逊BOS5美国仓（ 02072-4744）",
                        "119": "亚马逊BOS7美国仓（02722）",
                        "120": "亚马逊BFI7美国仓（98390）",
                        "121": "亚马逊BFI3美国仓（98327）",
                        "122": "亚马逊BFI4美国仓（98032）",
                        "123": "亚马逊SAT1美国仓（78154-1461）",
                        "124": "亚马逊SAT2美国仓（78666-8969）",
                        "125": "亚马逊CLT2美国仓（28214-8082）",
                        "126": "亚马逊CLT5美国仓（28027）",
                        "127": "亚马逊CVG1美国仓（41048）",
                        "128": "亚马逊CVG2美国仓（41048）",
                        "129": "亚马逊CVG3美国仓（41048）",
                        "130": "亚马逊CVG5美国仓（ 41048-8435）",
                        "131": "亚马逊CVG7美国仓（ 41048-8435）",
                        "132": "亚马逊CVG8美国仓（41042）",
                        "133": "亚马逊FTW1美国仓（75241-7203）",
                        "134": "亚马逊SEA6美国仓（98004）",
                        "135": "亚马逊SEA8美国仓（98004）",
                        "136": "亚马逊CAE1美国仓（29172）",
                        "137": "亚马逊GSP1美国仓（29303）",
                        "138": "亚马逊CHA1美国仓（37416-1757）",
                        "139": "亚马逊LAS2美国仓（89030）",
                        "140": "亚马逊PHX3美国仓（85043）",
                        "141": "亚马逊PHX5美国仓（85338）",
                        "142": "亚马逊PHX6美国仓（85043）",
                        "143": "亚马逊PHX7美国仓（85043）",
                        "144": "亚马逊TFC1美国仓（85043）",
                        "145": "亚马逊OAK3美国仓（ 95363-8876）",
                        "146": "亚马逊OAK4美国仓（95304-9370）",
                        "147": "亚马逊SJC7美国仓（95391）",
                        "148": "亚马逊OAK5美国仓（94560）",
                        "149": "亚马逊RNO1美国仓（89408）",
                        "150": "亚马逊RNO2美国仓（85906）",
                        "151": "亚马逊RNO4美国仓（89506）",
                        "152": "亚马逊ABE8美国仓（8518）",
                        "153": "亚马逊EWR4美国仓（08691-2350）",
                        "154": "亚马逊EWR6美国仓（08085）",
                        "155": "亚马逊ABE2美国仓（18031）",
                        "156": "亚马逊ABE3美国仓（18031）",
                        "157": "亚马逊ABE4美国仓（18045）",
                        "158": "亚马逊ABE5美国仓（17112）",
                        "159": "亚马逊AVP1美国仓（18202）",
                        "160": "亚马逊BWI1美国仓（21224）",
                        "161": "亚马逊BWI2美国仓（21224）",
                        "162": "亚马逊BWI5美国仓（21224）",
                        "163": "亚马逊EWR5美国仓（07001）",
                        "164": "亚马逊EWR7美国仓（07001）",
                        "165": "亚马逊EWR9美国仓（07008-3529）",
                        "166": "亚马逊MDT1美国仓（17015）",
                        "167": "亚马逊PHL1美国仓（19720）",
                        "168": "亚马逊PHL3美国仓（19720）",
                        "169": "亚马逊PHL4美国仓（17015）",
                        "170": "亚马逊PHL5美国仓（17339）",
                        "171": "亚马逊PHL6美国仓（17015）",
                        "172": "亚马逊PHL7美国仓（19709）",
                        "173": "亚马逊PHL9美国仓（17015）",
                        "174": "亚马逊XUSC美国仓（17013）",
                        "175": "亚马逊AVP3美国仓（18424-9492）",
                        "176": "亚马逊PIT5美国仓（15205）",
                        "177": "亚马逊RIC1美国仓（23803）",
                        "178": "亚马逊RIC2美国仓（23836）",
                        "179": "亚马逊RIC3美国仓（23836）",
                        "180": "亚马逊LGB8美国仓（91748）",
                        "181": "亚马逊IVSB美国仓（41018）",
                        "182": "亚马逊IVSA美国仓（41018）",
                        "183": "亚马逊MDW6美国仓（91103）",
                        "184": "亚马逊SDF8美国仓（47130）",
                        "185": "亚马逊DFW6美国仓（TX 75019-4424）",
                        "186": "亚马逊MDW9美国仓（60502）",
                        "187": "亚马逊DEN2美国仓（80019）",
                        "188": "亚马逊MDW2美国仓（60433-9642）",
                        "189": "亚马逊LAS6美国仓（89115）",
                        "190": "亚马逊CMH1美国仓（43018）",
                        "191": "亚马逊JAX3美国仓（32221）",
                        "192": "亚马逊MGE3美国仓（30549）",
                        "193": "亚马逊YYZ4美国仓（42718）",
                        "194": "万邑通波兰仓",
                        "195": "亚马逊LTN2英国仓（HP27LF）",
                        "196": "亚马逊EDI4英国仓（KY118ST）",
                        "197": "亚马逊EUK5英国仓（PE29EN）",
                        "198": "亚马逊BHX1英国仓（WS151LX）",
                        "199": "亚马逊BHX2英国仓（LE671GQ）",
                        "200": "亚马逊MAN1英国仓（M905AA）",
                        "201": "亚马逊LTN4英国仓（LU54FE）",
                        "202": "亚马逊XUKD英国仓（NN11 8LR）",
                        "203": "亚马逊GLA1英国仓（PA191BQ）",
                        "204": "亚马逊CWL1英国仓（SA18QX）",
                        "205": "亚马逊LBA1英国仓（DN45JS）",
                        "206": "亚马逊LCY2英国仓（RM187AN）",
                        "207": "亚马逊MAN2英国仓（WA53XA）",
                        "208": "亚马逊LBA2英国仓（DN110BG）",
                        "209": "亚马逊BER3德国仓（14656）",
                        "210": "亚马逊CGN1德国仓（56330）",
                        "211": "亚马逊DUS2德国仓（47495）",
                        "212": "亚马逊DTM2德国仓（44145）",
                        "213": "亚马逊DTM2德国仓（44146）",
                        "214": "亚马逊DTM2德国仓（44147）",
                        "215": "亚马逊FRA1德国仓（36251）",
                        "216": "亚马逊DTM2德国仓（44149）",
                        "217": "亚马逊HAM2德国仓（21423）",
                        "218": "亚马逊DTM2德国仓（44151）",
                        "219": "亚马逊LEJ1德国仓（04347)",
                        "220": "亚马逊DTM2德国仓（44153）",
                        "221": "亚马逊PRG2德国仓（16515）",
                        "222": "亚马逊STR1德国仓（75177）",
                        "223": "亚马逊WRO1德国仓（16515）",
                        "224": "亚马逊WRO2德国仓（16515）",
                        "225": "亚马逊ORY1法国仓（45770）",
                        "226": "亚马逊LIL1法国仓（59553）",
                        "227": "亚马逊MRS1法国仓（26200）",
                        "228": "亚马逊DTM2德国仓（44161）",
                        "229": "亚马逊XFRG法国仓（45410）",
                        "230": "亚马逊BVA1法国仓（80440）",
                        "231": "亚马逊MXP5意大利仓（29015）",
                        "232": "亚马逊XITC意大利仓（20080）",
                        "233": "亚马逊FCO1意大利仓（02032）",
                        "234": "亚马逊MXP3意大利仓（13100）",
                        "235": "亚马逊MAD4西班牙仓（28830）",
                        "236": "亚马逊XESA西班牙仓（19208）",
                        "237": "亚马逊DTM2德国仓（44170）",
                        "238": "亚马逊BCN1西班牙仓（08820）",
                        "239": "亚马逊BCN2西班牙仓（08107）",
                        "240": "FBC法国仓（33610）",
                        "241": "亚马逊STL4美国仓（62025-2815）",
                        "242": "亚马逊BOS1美国仓（3063）",
                        "243": "亚马逊MCI5美国仓（66219）",
                        "244": "亚马逊MKC4美国仓（66021-9588）",
                        "245": "亚马逊DFW7美国仓（76177-4513）",
                        "246": "亚马逊DFW8美国仓（75261）",
                        "247": "亚马逊FTW2美国仓（76051）",
                        "248": "亚马逊HOU1美国仓（77338）",
                        "249": "亚马逊LEX1美国仓（40511）",
                        "250": "亚马逊LEX2美国仓（40511）",
                        "251": "亚马逊TUL1美国仓（67337）",
                        "252": "亚马逊BNA1美国仓（37090）",
                        "253": "亚马逊BNA2美国仓（37090）",
                        "254": "亚马逊BNA3美国仓（37127）",
                        "255": "亚马逊IND1美国仓（46075）",
                        "256": "亚马逊IND2美国仓（46168）",
                        "257": "亚马逊IND3美国仓（46168）",
                        "258": "亚马逊IND4美国仓（46231）",
                        "259": "亚马逊IND5美国仓（46168）",
                        "260": "亚马逊XUSE美国仓（46075）",
                        "261": "亚马逊SDF2美国仓（40218）",
                        "262": "亚马逊SDF4美国仓（40165）",
                        "263": "亚马逊SDF6美国仓（40165）",
                        "264": "亚马逊SDF7美国仓（40165）",
                        "265": "亚马逊SDF9美国仓（40165）",
                        "266": "亚马逊MKE1美国仓（53144）",
                        "267": "亚马逊MKE5美国仓（53144）",
                        "268": "亚马逊BNA5美国仓（37217）",
                        "269": "亚马逊ATL6美国仓（30344）",
                        "270": "亚马逊ATL8美国仓（30122-3895）",
                        "271": "亚马逊CHA2美国仓（37310）",
                        "272": "亚马逊TPA2美国仓（33811）",
                        "273": "亚马逊LAL1美国仓（33811）",
                        "332": "万邑通英国存储仓（Amazon）",
                        "333": "递四方美东纽约仓",
                        "334": "Jumia尼日利亚仓",
                        "335": "亚马逊HOU3美国仓（77423）",
                        "336": "亚马逊TEB6美国仓（08512）",
                        "337": "亚马逊MEX1墨西哥（54715）",
                        "338": "亚马逊MEX3墨西哥（54607）",
                        "339": "递四方美西洛杉矶仓",
                        "340": "谷仓法国仓",
                        "341": "谷仓捷克仓（亚马逊）",
                        "342": "谷仓捷克仓（wish）",
                        "343": "谷仓捷克仓（ebay）",
                        "344": "谷仓英国仓（亚马逊）",
                        "345": "谷仓英国仓（wish）",
                        "346": "谷仓英国仓（eBay）",
                        "347": "亚马逊LGB3美国仓（91752-5087）",
                        "348": "谷仓法国仓(CD)",
                        "349": "递四方加拿大仓",
                        "350": "亚马逊HND8日本仓（192-8560）",
                        "351": "亚马逊BHX4英国仓（CV5-9DQ）",
                        "352": "谷仓澳洲仓",
                        "353": "万邑通澳洲墨尔本仓",
                        "354": "亚马逊FBA英国仓",
                        "355": "test",
                        "356": "亚马逊FBA法国仓",
                        "357": "亚马逊FBA德国仓",
                        "358": "亚马逊FBA西班牙仓",
                        "359": "亚马逊FBA意大利仓",
                        "360": "亚马逊FBA墨西哥仓",
                        "361": "亚马逊FBA欧洲仓",
                        "362": "亚马逊FBA日本仓",
                        "363": "亚马逊FBA澳洲仓",
                        "364": "亚马逊FBA印度仓",
                        "365": "物料仓_塘厦",
                        "366": "万邑通澳洲悉尼存储仓（wish）",
                        "367": "万邑通澳洲悉尼存储仓（eBay）",
                        "368": "万邑通澳洲悉尼存储仓（亚马逊）",
                        "369": "万邑通英国UKMA仓库",
                        "370": "谷仓捷克仓（Kevin）",
                        "371": "塘厦FBM虚拟仓",
                        "372": "MALL-FBM仓",
                        "373": "万邑通英国UKGF仓库",
                        "374": "亚马逊FBA美国仓",
                        "375": "亚马逊LGB6美国仓（92518-1513）",
                        "376": "亚马逊FBA中转仓",
                        "377": "亚马逊IVSC美国仓（08066-1743）",
                        "378": "谷仓澳洲仓（eBay）",
                        "379": "谷仓澳洲仓（wish）",
                        "380": "谷仓澳洲仓（亚马逊）",
                        "381": "亚马逊MAN3英国仓（BL5 1BT）",
                        "382": "亚马逊YYC1加拿大仓（T0M 0E0）",
                        "383": "亚马逊BWI4美国仓（22624-1568）",
                        "384": "样品仓",
                        "385": "万邑通澳洲墨尔本仓（ebay）",
                        "386": "万邑通澳洲墨尔本仓（wish）",
                        "387": "万邑通澳洲墨尔本仓（亚马逊）",
                        "388": "亚马逊IVSE美国仓",
                        "389": "旺集俄罗斯3号仓",
                        "390": "亚马逊BWU1澳大利亚仓(2170 )",
                        "391": "亚马逊IVSF美国仓（89115-3477）",
                        "392": "亚马逊FAT1美国仓（98032-2423）",
                        "393": "亚马逊SMF3 美国仓（95206-8202）",
                        "394": "亚马逊 ITX2美国仓（77040-1437）",
                        "395": "亚马逊EDEA德国仓（44145）",
                        "396": "退税仓",
                        "397": "亚马逊IVSD美国仓（08085-2502）",
                        "398": "亚马逊ONT2美国仓（92408-0123）",
                        "399": "亚马逊SLC1 美国仓（84116）",
                        "400": "亚马逊ITX1美国仓（77064-3329）",
                        "401": "亚马逊JFK8美国仓（10314）",
                        "402": "亚马逊FTW6美国仓（75261-4034）",
                        "403": "亚马逊ACY1美国仓（08066）",
                        "404": "中东NOON迪拜仓库",
                        "405": "亚马逊DTW1美国仓（48174）",
                        "406": "亚马逊MEM1美国仓38118-8102",
                        "407": "亚马逊TPF3日本仓（569-0823）",
                        "408": "亚马逊EUKA英国仓（PE2 6UG）",
                        "409": "亚马逊HND9日本仓（213-8517）",
                        "410": "亚马逊MDW4美国仓（60433-3281）",
                        "411": "亚马逊KIX3日本仓（567-8507）",
                        "412": "WISH-FBW爱沙尼亚仓",
                        "413": "亚马逊EUKD英国仓（WA8 8YN）",
                        "414": "亚马逊BDL2美国仓（06095-2144）",
                        "415": "亚马逊EUKB英国仓（PE2 6TE）",
                        "416": "递四方德国法兰克福二仓",
                        "417": "星邮德国仓",
                        "418": "星邮英国仓",
                        "419": "星邮美国芝加哥仓",
                        "420": "星邮美国洛杉矶仓",
                        "421": "递四方法国巴黎仓",
                        "422": "平台头程虚拟仓_塘厦",
                        "423": "亚马逊CLT3美国仓（518000）",
                        "424": "亚马逊DCA1美国仓（21219）",
                        "425": "FBA在途备货仓",
                        "426": " 海外在途备货仓",
                        "427": "亚马逊FRA7德国仓",
                        "428": "亚马逊MIA1美国仓（33054）",
                        "429": "WISH-FBW美国LAX仓",
                        "430": "亚马逊PDX9美国仓（97060）",
                        "431": "亚马逊DEN3美国仓（80023-6622）",
                        "432": "FBW汇总仓（显示FBW销售量）",
                        "433": "小平台在途仓",
                        "434": "出口易意大利仓",
                        "435": "亚马逊MCO1 美国仓（32824）",
                        "436": "wish-FBW美国ORD仓",
                        "437": "塘厦虚拟仓",
                        "438": "亚马逊TPF6（270-1389）",
                        "439": "亚马逊CLE2美国仓（44128）",
                        "440": "deliverr美国PA仓",
                        "441": "deliverr美国OH仓",
                        "442": "deliverr美国CA仓",
                        "443": "递四方日本大阪仓",
                        "444": "递四方澳大利亚悉尼仓（亚马逊FBA退货上架）",
                        "445": "递四方捷克布拉格仓（亚马逊FBA退货上架）",
                        "446": "亚马逊MAD6西班牙仓（45200 ）",
                        "447": "香港中转仓库（退运）",
                        "448": "小包仓_慈溪",
                        "449": "递四方英国路腾仓",
                        "450": "WISH-FBW荷兰AMS仓",
                        "451": "亚马逊DET2美国仓（48317-1318）",
                        "452": "VINE专用仓库（虚拟仓）",
                        "453": "deliverr美国KY仓",
                        "454": "物料仓_慈溪",
                        "455": "宝仓马来西亚仓",
                        "456": "deliverr美国GA仓",
                        "460": "塘厦AM精品退税仓",
                        "473": "tms_test02",
                        "474": "塘厦AM精品退税仓",
                        "475": "慈溪退税仓",
                        "476": "慈溪海外虚拟仓",
                        "477": "慈溪fba虚拟仓",
                        "478": "小包仓_虎门",
                        "479": "物料仓_虎门",
                        "480": "虎门退税仓",
                        "481": "海外虚拟仓_虎门",
                        "482": "虎门fba虚拟仓",
                        "483": "亚马逊LAS7美国仓（89115-1935）",
                        "484": "亚马逊YOW1加拿大仓（K4B0L3）",
                        "485": "FBC法国仓（33613）",
                        "486": "Daraz平台代发货仓",
                        "487": "亚马逊TRN1意大利仓（10037）",
                        "488": "亚马逊CMH3美国仓（45050-1848）",
                        "489": "亚马逊LGB7美国仓（92376-2427）",
                        "490": "亚马逊TYO1日本仓（332-8503）",
                        "491": "亚马逊BRS1英国仓（BS35 4DJ）",
                        "492": "deliverr美国NV仓",
                        "493": "deliverr美国IL仓（60490）",
                        "494": "FBC法国仓（33614）",
                        "495": "国内转海外虚拟仓-虎门仓",
                        "496": "沃尔玛平台Deliverr仓",
                        "497": "亚马逊DXB3阿联酋仓",
                        "512": "亚马逊EMA1英国仓（DE74 2BB）",
                        "513": "亚马逊MAN4英国仓（S43 4PZ）",
                        "498": "亚马逊STL8美国仓（63376-3447）",
                        "499": "中转仓_虎门退税仓",
                        "500": "中转仓_慈溪退税仓",
                        "501": "亚马逊SAV3美国仓",
                        "510": "FBML墨西哥CP仓",
                        "511": "亚马逊LAX9美国仓（92337-7441）",
                        "514": "亚马逊ORY4法国仓（91220）"
                    },
                    abnormityList: {
                        '1': "留言待处理",
                        '2': "地址错误",
                        '3': "商品未知",
                        '4': "无法分配仓库",
                        '5': "邮寄方式错误",
                        '66': "一买家多订单",
                        '9': "需人工审核",
                        '11': "付款金额错误",
                        '12': "仓库发货异常",
                        '15': "仓库属性异常",
                        '18': "利润异常一级审核订单",
                        '19': "利润异常二级审核订单",
                        '20': "利润异常驳回订单",
                        '21': "订单组扣件异常",
                        '22': "CD平台拉单超时异常",
                        '120': "荷呗订单异常",
//                        '6': "一买家多订单",
                        '16': "实际无库存",
                        '14': "接口问题",
                        '111': "申请跟踪号异常",
                        '23': "payple异常",
                        '13': "买家取消订单异常",
                        '110': "其他异常"
                    },
                    departmentList: {
                        "11": '客服部门',
                        "12": '销售部门',
                        "13": '订单组',
                        "8": 'WISH销售部门'
                    },
                    warehouseCategoryList: {
                        "1": "国内仓",
                        "2": "美国仓",
                        "3": "澳洲仓",
                        "4": "英国仓",
                        "5": "德国仓",
                        "6": "美国虚拟仓",
                        "7": "澳洲虚拟仓",
                        "8": "英国虚拟仓",
                        "9": "德国虚拟仓",
                        "10": "西班牙虚拟仓",
                        "11": "法国虚拟仓",
                        "12": "意大利虚拟仓",
                        "13": "西班牙仓",
                        "14": "德国存储仓",
                        "15": "英国存储仓",
                        "16": "澳洲存储仓",
                        "17": "美国存储仓",
                        "18": "比利时仓",
                        "19": "法国仓",
                        "20": "俄罗斯仓",
                        "21": "加拿大仓",
                        "22": "意大利仓",
                        "23": "日本仓"
                    }
                },

                tableData: [],
                tableKey: [],
                tableProps: [],
                tableWidth:[],
                tableMinWidth:[],

                //分页
                pageSizes: config.pageData.pageSizes,
                pageData: {
                    currentPage: 1,
                    currentList: 20,
                    currentTotal: 0,
                },

                //查看sku详情
                skuQuery: {
                    sku: '',
                },
                isShowDetails: false,
                detailInfo: {
                    key: [],
                    data: [],
                    props: [],
                    width: [],
                    page: {
                        limit: 20,
                        offset: 1,
                        total: 0
                    },
                    params: {
                        abnormity_superclass: '',
                        platform_code: '',
                    }
                },

                //保存默认时间
                saveDefaultDate: [],

                //名词解释
                isPointShow: false
            }

        },
        computed: {
            ...mapGetters([
                'buttonList',
                'loginInfo',
                'queryParamsInfo',
                'statisticalReport'
            ])
        },
        methods: {
            ...mapActions([
                'GetStatiscalReportInfo'
            ]),
            autoAddTableInx,
            getExceptionOrderInfo,

            // 列表信息查询
            handleQueryInfo(params = {}, isFn) {

                // 判断是否为功能参数
                if (isFn) {
                    // 获取保存的查询参数
                    this.queryData = JSON.parse(this.queryParamsInfo['exception']);
                }
                if(!validTime(this.queryData.date[0], this.queryData.date[1])) {
                    this.$message.warning('结束时间不能小于开始时间，请重新选择');
                    return;
                }
                let obj = {
                    ...params,
                    ...this.queryData,
                    start_time: this.queryData.date[0] || '',
                    end_time: this.queryData.date[1] || '',
                };
                this.getExceptionOrderInfo(obj).then(({ data }) => {
                    if (data.status === 2) return;
                    if (data.status) {
                        this.handleQueryInfoCallBack(data);
                    }else {
                        this.$message.error(data.errorMess || '查询失败')
                    }
                })
            },

            // 查询重置
            handleResetQueryInfo() {
                this.queryData.date = [getCountDate(-7), getCountDate(-1)];
                this.queryData.platform_code_list = [];
                this.queryData.warehouse_id_list = [];
                this.queryData.abnormity_superclass_list = [];
                this.queryData.department = [];
                this.queryData.warehouse_category_list = [];
            },


            //名词解释
            handleClickPoint() {
                console.log(113131)
                this.isPointShow = true;
            },


            // 分页条数切换
            handleSizeChange(val) {
                this.handleQueryInfo({
                    limit: val,
                    offset: 1
                }, true)
            },

            // 跳转页数切换
            handleCurrentChange(val) {
                this.handleQueryInfo({
                    limit: this.pageData.currentList,
                    offset: val
                }, true)
            },

            //导出
            handleExportInfo() {
                this.handleQueryInfo({
                    isExcel: 1
                }, true)
            },


            //点击sku详情
            handlePreviewDetailInfo(params = {}){
                this.handleQueryDetailInfo(params);
            },

            //弹框sku查询
            handleQueryDetailInfo(params = {}) {

                // 获取保存的查询参数
                this.queryData = JSON.parse(this.queryParamsInfo['exception']);
                let obj = {
                    ...this.queryData,
                    start_time: this.queryData.date[0] || '',
                    end_time: this.queryData.date[1] || '',
//                    warehouse_category_list: this.dialog.warehouse_category_list,
                    ...params
                };
                this.detailInfo.params = {
                    abnormity_superclass: params.abnormity_superclass,
                    platform_code: params.platform_code,
                }
                getDetailInfo(obj).then(({ data }) => {
                    this.isShowDetails = true;
                    this.handleSkuQueryCallBack(data);
                })
            },
            handleSkuQueryCallBack(data) {
                this.detailInfo.data = data.value;
                this.detailInfo.key = ['序号', ...data.key];
                this.detailInfo.props = ['index', 'platform_code', 'order_id', 'platform_order_id', 'reason','buyer_id','account_name', 'paytime', 'site', 'warehouse_name', 'bigwarehouse'];
                this.detailInfo.width = ['50','80','140','140', '150','100','100', '90', '80', '', '80'];
                this.detailInfo.page.limit = data.count * 1;
                this.detailInfo.page.offset = data.offset * 1;
                this.detailInfo.page.total = data.total_count * 1;
            },

            //弹框导出
            handleDialogExportInfo() {
                let obj = {
                    ...this.queryData,
                    start_time: this.queryData.date[0] || '',
                    end_time: this.queryData.date[1] || '',
                    abnormity_superclass: this.detailInfo.params.abnormity_superclass,
                    platform_code: this.detailInfo.params.platform_code,
                };
                let str = '?';
                for (let key in obj) {
                    str = `${str}&${key}=${obj[key] || ''}`;
                }
                // window.open(`${config.BI_PATH}/yibai/zhiku/order/abnormal/count_statistics_detail/down/` + str, '_self');
                window.open(`${config.BI_PATH2}/yibai/zhiku/order/abnormal/count_statistics_detail/down/` + str, '_self');
            },

            //弹框分页
            handleDetailPageChange({offset,limit}) {
                this.handleQueryDetailInfo({page: offset, count: limit, ...this.detailInfo.params})
            },

            // 查询回调
            handleQueryInfoCallBack(data) {
                // 保存查询参数
                this.$store.commit('SAVE_QUERY_PARAMS_INFO', {
                    key: 'exception',
                    value: JSON.stringify(this.queryData)
                });

                //渲染数据
                let propsArr = [...data.key];
                let props = propsArr.slice(2, 23);
                let keys = props.map(item => {
                    return this.optionList.abnormityList[item];
                });
                this.tableKey = ['序号', '仓库', '平台',  ...keys, '总订单量'];
                this.tableProps = ['index', 'warehouse_name', 'platform_name', ...props, 'total_count'];
                this.tableData = data.value;
                this.tableMinWidth = this.tableProps.map(item => {
                    if (item === 'index') return '60';
                    if (item === '22') return '90';
                    if (item === '111') return '110';
                    if (item === 'warehouse_name') return '150';
                    return '100'
                })

//                this.tableWidth = ['50', '100', '', '', '', '', '90', '90', '90', '90', '90', '90', '90', '', '', '', '', '90', '90']

                // this.pageData.currentTotal = data.list.page.total * 1 ;
                // this.pageData.currentList = data.list.page.limit * 1 ;
                // this.pageData.currentPage = data.list.page.page * 1 ;

            }

        },
        created() {
            this.thisVm = this;
//            this.saveDefaultDate = [getCountDate(-7), getCountDate(-1)];
            this.queryData.date = [getCountDate(-7), getCountDate(-1)];
            this.handleQueryInfo();
        },
    }
</script>

<style scoped lang="less">

    /deep/.ui-dialog_search {
        border: 0!important;
        padding: 0 0 10px 0;
        .ui-search_label {
            width: 45px!important;
        }
        .ui-search_input {
            margin-left: 45px!important;
        }
    }
    .ui-dialog_btn {
        margin: 0 20px!important;
    }

    /deep/.el-button [class*=el-icon-]+span {
        margin-left: 0!important;
    }
    /deep/.el-popover--plain {
        padding: 10px 20px!important;
    }

</style>
