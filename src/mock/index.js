import Mock from 'mockjs';

let Random = Mock.Random;

Random.datetime('yyyy-MM-dd HH:mm:ss');

const supplierCreateList = Mock.mock({
    data_list: {
        key: ['编号', '供应商代码', '供应商名称', '发货地址', '联络资料', '支付资料', '操作记录', '附件资料', '状态', '驳回说明'],

        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'value|1-20': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            'supplier_code': 'V18120001011',
            'supplier_name': '宁都县黄陂镇康隆鞋厂',
            'fh_address_shi': '辽宁省大连市',
            'fh_address': '宁都县万桶街黄陂镇康隆鞋厂',
            'ca_data_user': '乔峰',
            'ca_data_qq': '1355906017',
            'ca_data_wx': 'wx1355906017',
            'ca_data_email': '1355906017@qq.com',
            'payment_data_type': '线上支付宝（款到发货）',
            'payment_data_zfb': 'klxc@163.com',
            'payment_data_name': '康隆鞋厂',
            'payment_data_address': '宁都县黄陂镇康隆鞋厂',
            'operate_dev_user|1': ['哆啦A梦', '蜡笔小新', '光头一休'],
            'operate_dev_time': '@datetime',
            'operate_create_user|1': ['哆啦A梦', '蜡笔小新', '光头一休'],
            'operate_create_time': '@datetime',
            'operate_audit_user|1': ['哆啦A梦', '蜡笔小新', '光头一休'],
            'operate_audit_time': '@datetime',
            'file_url': '',
            'state|1': ['已创建', '被驳回'],
            'reject_remarks': '驳回人；驳回原因；驳回时间',
            'sumMoney': Random.float(1, 10000000, 1, 2),
            'sumTotal': Random.integer(1, 10000000)
        }]
    },
    page_data: {
        limit: 20,
        offset: 1,
        'total|1-20': 1
    }
});

Mock.mock(/\/myapi\/supplier\/get_create_supplier_list/, function (option) {
    return {
        ...supplierCreateList
    }
});

const porductDatumCreateInfo = Mock.mock({
    data_list: {
        key: ['编号', '商品SPU', '商品图片', '商品名称', '商品目录', '样品类型', '商品资料', '产品审核状态', '操作记录', '操作用时(min)', '备注'],

        // 属性 list 的值是一个数组，其中含有 1 到 10 个元素
        'value|100-200': [{
            // 属性 id 是一个自增数，起始值为 1，每次增 1
            'id|+1': 1,
            'spu': 'V18120001011',
            'spu_qty': Random.integer(1, 10000000),
            'img': 'http://img0.imgtn.bdimg.com/it/u=3377301164,1214067452&fm=26&gp=0.jpg',
            'name': '辽宁省大连市',
            'list': '一级目录->二级目录->三级目录',
            'type': '玩具',
            'is_buys|1': ['是', '否'],
            'is_diy|1': ['是', '否'],
            'datum_sample_money': Random.integer(1, 10000000),
            'supplier_code': '51360700MJC979811N',
            'supplier_name': '笑嘻嘻',
            'sample_link': 'www.ynmau.com',
            'look_link': 'www.baidu.com',
            'create_state|1': ['已创建', '已保存', '被驳回'],
            'dev_state|1': ['被驳回', '已开发', '未开发'],
            'create_record_user': 'ynmau',
            'create_record_time': '@datetime',
            'dev_record_user': 'ynmau',
            'dev_record_time': '@datetime',
            'pk_record_user': 'ynmau',
            'pk_record_time': '@datetime',
            'dev_use_time': Random.integer(1, 24),
            'pk_use_time': Random.integer(1, 24),
            'remarks': '哈哈哈'
        }]
    },
    page_data: {
        limit: 20,
        offset: 1,
        'total|1-20': 1
    }
});

Mock.mock(/\/myapi\/product\/getinfo/, function (option) {
    console.log(option);
    return {
        ...porductDatumCreateInfo
    }
});