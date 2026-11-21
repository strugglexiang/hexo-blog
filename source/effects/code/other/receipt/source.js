function eiTrim(str) {
    return str.replace(/^\s*|\s*$/g, '')
}


// 替换 #{中文}
const trans = function (arr, str) {
    let resultStr = ''
    if (!arr || !arr.length || !str) {
        return resultStr
    }
    let reg = /#\{\s*(.*?)\s*\}/g
    resultStr = str.replace(reg, function (match, key) {
        let str = ''
        for (let i = 0; i < arr.length; i++) {
            if (arr[i]['name'] === key) {
                str = arr[i]['defaultValue']
                break
            }
        }
        return str || match
    })
    return resultStr
}


// 替换循环体
const escapeItem = function (str, arr) {
    let result = arr.reduce((pre, item, index) => {
        let rowStr = trans(item, str)
        return pre + rowStr.slice(1, -1) + (index === arr.length - 1 ? '' : '\n')
    }, '')
    return result
}


// 转义
/**
 * 将模板转为 具体小票数据
 * @param {Array} arr  字典
 * @param {String} str 模板
 */
const escapeTemp = function (arr, str, type) {
    let resultStr = ''
    if (!str || !arr.length) {
        return str
    }
    // 正则
    let reg1 = /#\{\s*(.*?)\s*\}/g // 字典替换
    let reg2 = /(#item)(.*?)\1/gs // 循环内容
    let reg3 = /(#inner)(.*?)\1/gs // 循环内容中的循环
    // 循环内容(转换#item内的内容)
    if (reg2.test(str)) {
        let iterateIndex = 0
        resultStr = str.replace(reg2, function (match, key1, key2) {
            let loopStr1 = key2 // 循环内容
            let outArr = dataArr[iterateIndex] // 循环数组
            iterateIndex++
            // 循环体内部有循环
            if (reg3.test(loopStr1)) {
                let innerResult = outArr.map((option) => option.arr).reduce((innerRow, innerArr, innnerIndex) => {
                    let rowLoop = innerRow + loopStr1.replace(reg3, function (match2, matchKey1, matchKey2) {
                        return escapeItem(matchKey2, innerArr)
                    }).slice(1, -1)
                    rowLoop = trans(outArr.map((option) => option.dic)[innnerIndex], rowLoop)
                    return rowLoop + (innnerIndex === innerArr.length - 1 ? '' : '\n')
                }, '')
                // console.log('有循环', innerResult)
                return innerResult.slice(1, -1)
            } else {
                // 循环体内部无循环
                let result = escapeItem(loopStr1, outArr)
                return result
            }
        })
    }

    // #{} 普通字典替换（转换除#item内的内容）
    resultStr = trans(arr, eiTrim(resultStr) ? resultStr : str)
    return resultStr
}

const tempstr1 = `结账单
#{店名}
#{欢迎标题}
------------------------------
账单号:#{账单号}
结账日:#{结账日}
收银员:#{收银员} 
房间:#{房间}
房号   来店时间   时长
#item
#{房间号}   #{来店时间}   #{来店时长}
#item
------------------------------
项目名称  技师  数量  金额
------------------------------
#item
#inner
#{项目名称}  #{技师}  #{数量}  #{金额}
#inner
--房号    #{房间号}   消费    #{房间金额}
#item
---合计---  #{数量合计}  #{金额合计}
------------------------------
折扣:#{折扣}  会员卡:#{会员卡后4位}
免单:#{免单}  赠送:#{赠送}
服务费:#{服务费}  抹零:#{抹零}
应收合计:#{应收合计} 
------------------------------
#item
#{付款方式}:#{付款金额}
#item

*支付:#{客人支付}      客签:
*找零:#{找零}
------------------------------
#{商家地址}
电话:#{商家电话}
欢迎您再次光临 
`


const dataArr = {
    0: [
        [
            { name: '房间号', defaultValue: '001' },
            { name: '来店时间', defaultValue: '2019-10-15 13:00' },
            { name: '来店时长', defaultValue: '1时2分' }
        ],
        [
            { name: '房间号', defaultValue: '002' },
            { name: '来店时间', defaultValue: '2019-10-15 13:00' },
            { name: '来店时长', defaultValue: '1时2分' }
        ]
    ],
    1: [
        {
            arr: [
                [
                    { name: '项目名称', defaultValue: '按摩' },
                    { name: '技师', defaultValue: '088' },
                    { name: '数量', defaultValue: '1' },
                    { name: '金额', defaultValue: '118.00' }
                ],
                [
                    { name: '项目名称', defaultValue: 'SPA' },
                    { name: '技师', defaultValue: '098' },
                    { name: '数量', defaultValue: '1' },
                    { name: '金额', defaultValue: '200.00' }
                ]
            ],
            dic: [
                { name: '房间号', defaultValue: '001' },
                { name: '房间金额', defaultValue: '318.00' }
            ]
        },
        {
            arr: [
                [
                    { name: '项目名称', defaultValue: 'SPA' },
                    { name: '技师', defaultValue: '098' },
                    { name: '数量', defaultValue: '1' },
                    { name: '金额', defaultValue: '200.00' }
                ]
            ],
            dic: [
                { name: '房间号', defaultValue: '002' },
                { name: '房间金额', defaultValue: '200.00' }
            ]
        }
    ],
    2: [
        [
            { name: '付款方式', defaultValue: '现金' },
            { name: '付款金额', defaultValue: '300.00' }
        ],
        [
            { name: '付款方式', defaultValue: '会员卡' },
            { name: '付款金额', defaultValue: '200.00' }
        ]
    ]
}


const dic = [
    {
        "keys": [],
        "id": "1",
        "code": "",
        "name": "店名",
        "value": "shopName",
        "defaultValue": "天道店",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "2",
        "code": "",
        "name": "账单号",
        "value": "billDate",
        "defaultValue": "88888888888888",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "3",
        "code": "",
        "name": "结账日",
        "value": "closingDate",
        "defaultValue": "2018-18-18 08:08",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "4",
        "code": "",
        "name": "收银员",
        "value": "cashier",
        "defaultValue": "张三",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "5",
        "code": "",
        "name": "房间",
        "value": "room",
        "defaultValue": "854",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "6",
        "code": "",
        "name": "客人牌",
        "value": "guestCard",
        "defaultValue": "28",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "7",
        "code": "",
        "name": "来店时长",
        "value": "timeToShop",
        "defaultValue": "1时2分",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "8",
        "code": "",
        "name": "来店时间",
        "value": "shopTime",
        "defaultValue": "2018-18-18",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "9",
        "code": "",
        "name": "折扣",
        "value": "discount",
        "defaultValue": "18.00",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "10",
        "code": "",
        "name": "折类型",
        "value": "foldingType",
        "defaultValue": "黄金会员",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "11",
        "code": "",
        "name": "赠送",
        "value": "give",
        "defaultValue": "0.00 ",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "12",
        "code": "",
        "name": "免单",
        "value": "freeSheet",
        "defaultValue": "0.00 ",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "13",
        "code": "",
        "name": "抹零",
        "value": "roundoff",
        "defaultValue": "0.00 ",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "14",
        "code": "",
        "name": "服务费",
        "value": "serviceCharge",
        "defaultValue": "0.00",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "15",
        "code": "",
        "name": "应收合计",
        "value": "totalReceivables",
        "defaultValue": "300.00",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "16",
        "code": "",
        "name": "付款方式",
        "value": "paymentModeName",
        "defaultValue": "现金",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "17",
        "code": "",
        "name": "付款金额",
        "value": "paymentAmount",
        "defaultValue": "708.00",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "18",
        "code": "",
        "name": "客人支付",
        "value": "guestPayment",
        "defaultValue": "0.00",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "19",
        "code": "",
        "name": "找零",
        "value": "giveChange",
        "defaultValue": "0.00",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "337",
        "code": "",
        "name": "会员姓名",
        "value": "memberName",
        "defaultValue": "张三",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "339",
        "code": "",
        "name": "备注",
        "value": "remarks",
        "defaultValue": "谢谢光临",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "341",
        "code": "",
        "name": "商家地址",
        "value": "address",
        "defaultValue": "xxxxx路188号",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "364",
        "code": "",
        "name": "商家电话",
        "value": "telephone",
        "defaultValue": "0731-88888888",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "365",
        "code": "",
        "name": "欢迎标题",
        "value": "welcomename",
        "defaultValue": "欢迎光临",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "408",
        "code": "",
        "name": "项目名称",
        "value": "commodityName",
        "defaultValue": "泰式按摩",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "409",
        "code": "",
        "name": "技师",
        "value": "technician",
        "defaultValue": "888",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "410",
        "code": "",
        "name": "数量",
        "value": "number",
        "defaultValue": "1",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "411",
        "code": "",
        "name": "金额",
        "value": "money",
        "defaultValue": "128",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "412",
        "code": "",
        "name": "小计",
        "value": "subtotal",
        "defaultValue": "128",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "413",
        "code": "",
        "name": "数量合计",
        "value": "totalQuantity",
        "defaultValue": "1",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "414",
        "code": "",
        "name": "金额合计",
        "value": "totalAmount",
        "defaultValue": "128",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "416",
        "code": "",
        "name": "房间金额",
        "value": "roomMoney",
        "defaultValue": "300",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "417",
        "code": "",
        "name": "房间号",
        "value": "orderBody",
        "defaultValue": "12",
        "description": "",
        "remarks": "放item标签内",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    },
    {
        "keys": [],
        "id": "418",
        "code": "",
        "name": "会员卡后4位",
        "value": "cardNumberFour",
        "defaultValue": "8888",
        "description": "",
        "remarks": "",
        "systemFlag": 0,
        "deleteFlag": 0,
        "type": "1"
    }
]