/******************** 转换器 ********************/
let isQuantumultX = $task != undefined;
let isSurge = $httpClient != undefined;
let isLoon = isSurge && typeof $loon != undefined;
var $task = isQuantumultX ? $task : {};
var $httpClient = isSurge ? $httpClient : {};
var $prefs = isQuantumultX ? $prefs : {};
var $persistentStore = isSurge ? $persistentStore : {};
var $notify = isQuantumultX ? $notify : {};
var $notification = isSurge ? $notification : {};
if (isQuantumultX) {
    var errorInfo = {
        error: "",
    };
    $httpClient = {
        get: (url, cb) => {
            var urlObj;
            if (typeof url == "string") {
                urlObj = {
                    url: url,
                }
            } else {
                urlObj = url
            }
            $task.fetch(urlObj).then((response) => {
                cb(undefined, response, response.body)
            }, (reason) => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, "")
            })
        }, post: (url, cb) => {
            var urlObj;
            if (typeof url == "string") {
                urlObj = {
                    url: url,
                }
            } else {
                urlObj = url
            }
            url.method = "POST"
            $task.fetch(urlObj).then((response) => {
                cb(undefined, response, response.body)
            }, (reason) => {
                errorInfo.error = reason.error;
                cb(errorInfo, response, "")
            })
        },
    }
}
if (isSurge) {
    $task = {
        fetch: (url) => {
            return new Promise((resolve, reject) => {
                if (url.method == "POST") {
                    $httpClient.post(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error,
                            })
                        } else {
                            resolve(null, {
                                error: error,
                            })
                        }
                    })
                } else {
                    $httpClient.get(url, (error, response, data) => {
                        if (response) {
                            response.body = data;
                            resolve(response, {
                                error: error,
                            })
                        } else {
                            resolve(null, {
                                error: error,
                            })
                        }
                    })
                }
            })
        },
    }
}
if (isQuantumultX) {
    $persistentStore = {
        read: (key) => {
            return $prefs.valueForKey(key)
        }, write: (val, key) => {
            return $prefs.setValueForKey(val, key)
        },
    }
}
if (isSurge) {
    $prefs = {
        valueForKey: (key) => {
            return $persistentStore.read(key)
        }, setValueForKey: (val, key) => {
            return $persistentStore.write(val, key)
        },
    }
}
if (isQuantumultX) {
    $notify = ((notify) => {
        return function (title, subTitle, detail, url = undefined) {
            detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
            notify(title, subTitle, detail)
        }
    })($notify);
    $notification = {
        post: (title, subTitle, detail, url = undefined) => {
            detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
            $notify(title, subTitle, detail)
        },
    }
}
if (isSurge && !isLoon) {
    $notification.post = ((notify) => {
        return function (title, subTitle, detail, url = undefined) {
            detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
            notify.call($notification, title, subTitle, detail)
        }
    })($notification.post);
    $notify = (title, subTitle, detail, url = undefined) => {
        detail = url === undefined ? detail : `${detail}\n点击链接跳转: ${url}`;
        $notification.post(title, subTitle, detail)
    }
}
if (isLoon) {
    $notify = (title, subTitle, detail, url = undefined) => {
        $notification.post(title, subTitle, detail, url)
    }
}
/******************** 转换器 ********************/

/*
种豆得豆
quantumultx用
会自动关注任务中的店铺跟商品
*/


//直接用NobyDa的jd cookie
const cookie = $prefs.valueForKey('CookieJD')
const name = '京东种豆得豆'

//京东接口地址
const JD_API_HOST = 'https://api.m.jd.com/client.action';

var plantUuids = [ // 这个列表填入你要助力的好友的plantUuid
    'mlrdw3aw26j3witdhw4vt2kptfwlhpwkiadkaqy',
'5azfqt6w2x5lztg2pjkatit22a3h7wlwy7o5jii',
'olmijoxgmjutyrsovl2xalt2tbtfmg6sqldcb3q',
'mlrdw3aw26j3wnp5w664mla2a4gxr27jhtmtsfq',
'4npkonnsy7xi2eq2k25itzaab2hf7kpv2djqdma',
'66j4yt3ebl5ierjljoszp7e4izzbzaqhi5k2unz2afwlyqsgnasq',
'jezqczgr4tsechfwoeoyp4regm',
'e7jscpzp7kr6v6m7akoq7psmli5ac3f4ijdgqji',
'e7lhibzb3zek2dz26dqpqexdy4u5hxraa2ps75y',
]


var Task = step();
Task.next();

function* step() {
    //
    let message = ''
    if (cookie) {
        console.log(`获取任务及基本信息`)
        let plantBeanIndexResult = yield plantBeanIndex()
        if (plantBeanIndexResult.code != "0") {
            console.log(`plantBeanIndexResult:${JSON.stringify(plantBeanIndexResult)}`)
            //todo
            return
        }
        let shareUrl = plantBeanIndexResult.data.jwordShareInfo.shareUrl
        let myPlantUuid = getParam(shareUrl, 'plantUuid')
        console.log(`你的plantUuid为${myPlantUuid}`)
        for (let task of plantBeanIndexResult.data.taskList) {
            console.log(`开始【${task.taskName}】任务`)
            if (task.taskType == 7 || task.taskType == 17 || task.taskType == 18) {
                //具体每个人可能不一样
                //7金融双签,18疯抢爆品,17叠蛋糕
                if (task.isFinished != 1) {
                    console.log(task.taskName)
                    let receiveNutrientsTaskResult = yield receiveNutrientsTask(task.taskType)
                    console.log(`receiveNutrientsTaskResult:${JSON.stringify(receiveNutrientsTaskResult)}`)
                }
            } else if (task.awardType == 3) {
                //浏览店铺
                if (task.isFinished != 1) {
                    let shopTaskListResult = yield shopTaskList()
                    if (shopTaskListResult.code == '0') {
                        let shops = shopTaskListResult.data.goodShopList.concat(shopTaskListResult.data.moreShopList)
                        let nutrCount = 0
                        for (let shop of shops) {
                            console.log(shop.shopName)
                            if (shop.taskState == '2') {
                                let shopNutrientsTaskResult = yield shopNutrientsTask(shop.shopTaskId, shop.shopId)
                                if (shopNutrientsTaskResult.code == 0) {
                                    if (shopNutrientsTaskResult.data.nutrState == '1' && shopNutrientsTaskResult.data.nutrCount > 0) {
                                        console.log(`关注店铺${shop.shopName}获得${shopNutrientsTaskResult.data.nutrCount}营养液`)
                                        nutrCount += shopNutrientsTaskResult.data.nutrCount
                                        if (nutrCount >= task.totalNum - task.gainedNum) {
                                            break
                                        }
                                    } else {
                                        console.log(`关注店铺${shop.shopName}未获得营养液`)
                                    }
                                } else {
                                    console.log(`${shop.shopName},shopNutrientsTaskResult:${JSON.stringify(shopNutrientsTaskResult)}`)
                                }
                            }
                        }
                    } else {
                        console.log(`shopTaskListResult:${JSON.stringify(shopTaskListResult)}`)
                    }
                }
            } else if (task.awardType == 10) {
                //浏览频道
                if (task.isFinished != 1) {
                    let plantChannelTaskListResult = yield plantChannelTaskList()
                    if (plantChannelTaskListResult.code == '0') {
                        let channelList = plantChannelTaskListResult.data.goodChannelList.concat(plantChannelTaskListResult.data.normalChannelList)
                        let nutrCount = 0
                        for (let channel of channelList) {
                            // console.log(channel.channelName)
                            if (channel.taskState == '2') {
                                let plantChannelNutrientsTaskResult = yield plantChannelNutrientsTask(channel.channelTaskId, channel.channelId)
                                if (plantChannelNutrientsTaskResult.code == '0') {
                                    if (plantChannelNutrientsTaskResult.data.nutrState == '1' && plantChannelNutrientsTaskResult.data.nutrNum > 0) {
                                        console.log(`浏览频道${channel.channelName}获得${plantChannelNutrientsTaskResult.data.nutrNum}营养液`)
                                        nutrCount += plantChannelNutrientsTaskResult.data.nutrNum
                                        if (nutrCount >= task.totalNum - task.gainedNum) {
                                            break
                                        }
                                    } else {
                                        console.log(`浏览频道${channel.channelName}未获得营养液`)
                                    }
                                } else {
                                    console.log(`${channel.channelName},plantChannelNutrientsTaskResult:${JSON.stringify(plantChannelNutrientsTaskResult)}`)

                                }
                            }
                        }
                    } else {
                        console.log(`plantChannelTaskListResult:${JSON.stringify(plantChannelTaskListResult)}`)
                    }
                }
            } else if (task.awardType == 5) {
                //关注商品
                if (task.isFinished != 1) {
                    let productTaskListResult = yield productTaskList()
                    if (productTaskListResult.code == '0') {
                        let productInfoList = productTaskListResult.data.productInfoList.map(([item]) => item)
                        let nutrCount = 0
                        for (let productInfo of productInfoList) {
                            console.log(productInfo.productName)
                            if (productInfo.taskState == '2') {
                                let productNutrientsTaskResult = yield productNutrientsTask(productInfo.productTaskId, productInfo.skuId)
                                if (productNutrientsTaskResult.code == '0') {
                                    if (productNutrientsTaskResult.data.nutrState == '1' && productNutrientsTaskResult.data.nutrCount > 0) {
                                        console.log(`关注商品${productInfo.productName}获得${productNutrientsTaskResult.data.nutrCount}营养液`)
                                        nutrCount += productNutrientsTaskResult.data.nutrCount
                                        if (nutrCount >= task.totalNum - task.gainedNum) {
                                            break
                                        }
                                    } else {
                                        console.log(`关注商品${productInfo.productName}未获得营养液`)
                                    }
                                } else {
                                    console.log(`productNutrientsTaskResult:${JSON.stringify(productNutrientsTaskResult)}`)
                                }
                            }
                        }
                    } else {
                        console.log(`productTaskListResult:${JSON.stringify(productTaskListResult)}`)
                    }
                }
            } else if (task.taskType == 4) {
                //逛逛会场
                if (task.isFinished != 1 && task.gainedNum == '0') {
                    if (plantBeanIndexResult.data.roundList[1].roundState == 2) {
                        let purchaseRewardTaskResult = yield purchaseRewardTask(plantBeanIndexResult.data.roundList[1].roundId)
                        console.log(`purchaseRewardTaskResult:${JSON.stringify(purchaseRewardTaskResult)}`)
                    }
                }
            } else {
                console.log(`【${task.taskName}】未开发${task.awardType},${task.taskType}`)
            }
            console.log(`【${task.taskName}】任务结束`)
        }

        //助力好友
        console.log('开始助力好友')
        for (let plantUuid of plantUuids) {
            if (plantUuid == myPlantUuid) {
                console.log('跳过自己的plantUuid')
                continue
            }
            console.log(`开始助力好友: ${plantUuid}`);
            let helpResult = yield helpShare(plantUuid)
            if (helpResult.code == 0) {
                console.log(`助力好友结果: ${JSON.stringify(helpResult.data.helpShareRes)}`);
            } else {
                console.log(`助力好友失败: ${JSON.stringify(helpResult)}`);
            }
        }
        plantBeanIndexResult = yield plantBeanIndex()
        if (plantBeanIndexResult.code == '0') {
            let plantBeanRound = plantBeanIndexResult.data.roundList[1]
            if (plantBeanRound.roundState == 2) {
                //收取营养液
                console.log(`开始收取营养液`)
                for (let bubbleInfo of plantBeanRound.bubbleInfos) {
                    console.log(`收取营养液${bubbleInfo.name}`)
                    let cultureBeanResult = yield cultureBean(plantBeanRound.roundId, bubbleInfo.nutrientsType)
                    console.log(`cultureBeanResult:${JSON.stringify(cultureBeanResult)}`)
                }
                //定时领取
                if (plantBeanIndexResult.data.timeNutrientsRes.state == 1 && plantBeanIndexResult.data.timeNutrientsRes.nutrCount > 0) {
                    console.log(`开始领取定时产生的营养液`)
                    let receiveNutrientsResult = yield receiveNutrients(plantBeanRound.roundId)
                    console.log(`receiveNutrientsResult:${JSON.stringify(receiveNutrientsResult)}`)
                }
            }
        } else {
            console.log(`plantBeanIndexResult:${JSON.stringify(plantBeanIndexResult)}`)
        }
        console.log('结束')
    } else {
        message = '请先获取cookie\n直接使用NobyDa的京东签到获取'
    }
    $notify(name, '种豆得豆副标题', message)
}

function purchaseRewardTask(roundId) {
    let functionId = arguments.callee.name.toString();
    let body = {
        "monitor_refer": "plant_receiveNutrients",
        "monitor_source": "plant_app_plant_index",
        "roundId": roundId,
        "version": "9.0.0.1"
    }
    request(functionId, body);// `body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function receiveNutrientsTask(awardType) {
    // let functionId = arguments.callee.name.toString();
    // let body = {
    //     "monitor_refer": "plant_receiveNutrientsTask",
    //     "monitor_source": "plant_m_plant_index",//plant_app_plant_index,plant_m_plant_index
    //     "awardType": `"${awardType}"`,
    //     "version": "9.0.0.1"// "9.0.0.1", "8.4.0.0"
    // }
    //这里很奇怪，试了很多情况都不行，直接这样了
    requestGet(`https://api.m.jd.com/client.action?functionId=receiveNutrientsTask&body=%7B%22awardType%22%3A%22${awardType}%22%2C%22monitor_source%22%3A%22plant_m_plant_index%22%2C%22monitor_refer%22%3A%22plant_receiveNutrientsTask%22%2C%22version%22%3A%228.4.0.0%22%7D&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`)
    // request(functionId, body);// `body=${escape(JSON.stringify(body))}&client=apple&appid=ld`
}

//https://api.m.jd.com/client.action?functionId=receiveNutrients
function receiveNutrients(roundId) {

    let functionId = arguments.callee.name.toString();
    let body = {
        "monitor_refer": "plant_receiveNutrients",
        "monitor_source": "plant_app_plant_index",
        "roundId": roundId,
        "version": "9.0.0.1"
    }

    request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`

}
// https://api.m.jd.com/client.action?functionId=cultureBean
//收取营养液
function cultureBean(roundId, nutrientsType) {
    let functionId = arguments.callee.name.toString();
    let body = {
        "monitor_refer": "plant_index",
        "monitor_source": "plant_app_plant_index",
        "roundId": roundId,
        "nutrientsType": nutrientsType,
        "version": "9.0.0.1"
    }
    request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function productNutrientsTask(productTaskId, skuId) {
    let functionId = arguments.callee.name.toString();
    let body = {
        "monitor_refer": "plant_productNutrientsTask",
        "monitor_source": "plant_app_plant_index",
        "productTaskId": productTaskId,
        "skuId": skuId,
        "version": "9.0.0.1"
    }
    request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function productTaskList() {
    //https://api.m.jd.com/client.action?functionId=productTaskList&body=%7B%7D&uuid=&appid=ld
    let functionId = arguments.callee.name.toString();
    request(functionId);// `body=%7B%7D&uuid=&appid=ld`
}

function plantChannelNutrientsTask(channelTaskId, channelId) {
    let functionId = arguments.callee.name.toString();
    let body = { "channelTaskId": channelTaskId, "channelId": channelId }
    request(functionId, body);//`body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function plantChannelTaskList() {
    let functionId = arguments.callee.name.toString();
    request(functionId);// `body=%7B%7D&uuid=&appid=ld`
}

function shopNutrientsTask(shopTaskId, shopId) {
    let functionId = arguments.callee.name.toString();
    let body = { "version": "9.0.0.1", "monitor_refer": "plant_shopNutrientsTask", "monitor_source": "plant_app_plant_index", "shopId": shopId, "shopTaskId": shopTaskId }

    request(functionId, body);// `body=${escape(JSON.stringify(body))}&uuid=&appid=ld`
}

function shopTaskList() {
    let functionId = arguments.callee.name.toString();
    request(functionId);//`body=%7B%7D&uuid=&appid=ld`
}

function helpShare(plantUuid) {
    let body = {
        "plantUuid": plantUuid,
        "monitor_refer": "",
        "wxHeadImgUrl": "",
        "shareUuid": "",
        "followType": "1",
        "monitor_source": "plant_m_plant_index",
        "version": "9.0.0.1"
    }
    request(`plantBeanIndex`, body);
}

function plantBeanIndex() {
    // https://api.m.jd.com/client.action?functionId=plantBeanIndex
    let functionId = arguments.callee.name.toString();
    let body = { "monitor_source": "plant_app_plant_index", "monitor_refer": "", "version": "9.0.0.1" }
    request(functionId, body);//plantBeanIndexBody
}

function requestGet(url){
    $task.fetch({
        url: url,
        headers: {
            Cookie: cookie,
        },
        method: "GET",
    }).then(
        (response) => {
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)
    ).then((response) => sleep(response))
}

function request(function_id, body = {}) {
    $task.fetch(taskurl(function_id, body)).then(
        (response) => {
            return JSON.parse(response.body)
        },
        (reason) => console.log(reason.error, reason)
    ).then((response) => sleep(response))
}

function taskurl(function_id, body) {
    // console.log(`${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`)
    return {
        // url: `${JD_API_HOST}?functionId=${function_id}&body=${escape(JSON.stringify(body))}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`,
        url: JD_API_HOST,
        body: `functionId=${function_id}&body=${JSON.stringify(body)}&appid=ld&client=apple&clientVersion=&networkType=&osVersion=&uuid=`,
        headers: {
            Cookie: cookie,
        },
        // method: "GET",
        method: "POST",
    }
}

// function taskurl(function_id, body) {
//     return {
//         url: `${JD_API_HOST}?functionId=${function_id}`,
//         body: body, //escape`functionId=${function_id}&body=${JSON.stringify(body)}&appid=wh5`
//         headers: {
//             Cookie: cookie,
//         },
//         method: "POST",
//     }
// }

function sleep(response) {
    console.log('休息一下');
    setTimeout(() => {
        console.log('休息结束');
        Task.next(response)
    }, 2000);
}

function getParam(url, name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = url.match(reg);
    if (r != null) return unescape(r[2]);
    return null;
} 