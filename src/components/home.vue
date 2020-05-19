<template>
    <div class="wrapper">
        <div class="headerCon">
            <div class="headers">
                <div class="left">
                    <img alt class="left-img" src="../assets/image/left.png" />
                    <img :src="leftImgTop" alt class="left_icon" />
                    <img :src="leftImgTop" alt class="goodsIMg" />

                    <div class="leftbg">
                        <img alt class="peoples people" src="../assets/image/lanp.png" />
                    </div>
                </div>
                <div class="center">
                    <img alt src="../assets/image/vs.png" />
                    <img alt class="baos" src="../assets/image/bao.png" />
                </div>
                <div class="left">
                    <img alt class="right-img" src="../assets/image/right.png" />
                    <img :src="rightImgTop" alt class="iconright" />
                    <img :src="rightImgTop" alt class="goodsIMg" />
                    <a @click="getregular" class="regulars" href="javascript:;">活动规则</a>
                    <div class="leftbg">
                        <img alt class="peoples" src="../assets/image/yellowp.png" />
                    </div>
                </div>
            </div>
        </div>
        <div class="goodsList">
            <div class="topCon" v-if="!isTime">
                <span>05月06日，准点开押</span>
            </div>
            <div class="listsCon">
                <div :key="item.id" class="items" v-for="item in goods">
                    <div class="img_ya">
                        <img :src="item.goodPic" alt />
                    </div>
                     <span v-if="item.payStatus && (item.orderId===orderTrue)" class="btns1 yaBao">已押</span>
                    <span class="name">{{item.goodsName}}</span>
                    <div class="bottomCon">
                        <span>
                            <i>{{item.count}}</i>人已押
                        </span>
                        <a
                            @click.prevent.stop="getBet(item)"
                            class="btns"
                            href="javascript:;"
                            v-if="(!payStatus1&& !payStatus2) && isTime"
                        >押宝</a>
                       
                        <a class="btns1" href="javascript:;" v-if="(payStatus1 ||payStatus2) || !isTime">押宝</a>
                    </div>
                </div>
            </div>
        </div>
        <div class="diamask" v-if="isShow">
            <div class="dialogCon">
                <span class="diaSpan">
                    继续支付
                    <i class="fcolor">￥5.16</i>，完成押注
                </span>
                <div class="btnCon">
                    <a @click="cancle" href="javascript:;">取消</a>
                    <a @click="confirm" class="fcolor" href="javascript:;">确定</a>
                </div>
            </div>
        </div>
        <div class="diamask" v-if="isRegular">
            <div class="imgDia">
                <img alt src="../assets/image/regula.jpeg" />
                <span @click="getClose" class="closeIcon">×</span>
            </div>
        </div>
    </div>
</template>
<script>
import {
    GetGoodList,
    GetOpenid,
    GetTicket,
    GetpreRecord,
    GetPay,
    GetPayStatus
} from '@/api/index'
import qs from 'qs'
let Base64 = require('js-base64').Base64;
export default {
    name: 'Home',
    data() {
        return {
            isShow: false,
            leftImg: '',
            leftImgTop: '',
            rightImg: '',
            rightImgTop: '',
            goods: [],
            openId: '',
            userId: '',
            ticket: '',
            orderId: '',
            orderInfo: {},
            payStatus1: false, // 获取支付状态
            payStatus2: false, // 获取支付状态
            orderTrue:'',
            isRegular: false, //规则页面展示
            isTime: false, // 判断是否在可押宝时间范围
            timer: '', //定时器
            count: 0,
            imgsrc:'https://yunji-it-1254201734.cos.ap-shanghai.myqcloud.com/Lark20200429-174204.jpeg',
        }
    },

    created() {
        this.getGoods()
        this.gettickets()
        this.getIds()
        this.timer = setInterval(this.getTimes, 1000)
    },
    mounted() {
      
        //ios
        document.body.addEventListener(
            'touchmove',
            function(e) {
                e.preventDefault()
            },
            { passive: false }
        )
        if (localStorage.getItem('count')) {
            this.count = localStorage.getItem('count')
            if (this.count > 1) {
                this.isRegular = false
                this.count = this.count + 1
                localStorage.setItem('count', this.count)
            } else {
                this.isRegular = true
                this.count = this.count + 1
                localStorage.setItem('count', this.count)
            }
        } else {
            this.isRegular = true
            this.count = this.count + 1
            localStorage.setItem('count', this.count)
        }
    },
    watch: {
        isTime(newval, oldval) {
            if (newval) {
                clearInterval(this.timer)
            }
        }
    },
    beforeDestroy() {
        clearInterval(this.timer)
    },
    methods: {
        //获取当前时间
        getTimes() {
            let startTime = this.tranDate('2020-04-06 10:00:00')
            let endTime = this.tranDate('2020-05-10 20:00:01')
            let thisDate = new Date()
            // 获取当前时间，格式为 2018-9-10 20:08
            let currentTime =
                thisDate.getFullYear() +
                '-' +
                (thisDate.getMonth() + 1) +
                '-' +
                thisDate.getDate() +
                ' ' +
                thisDate.getHours() +
                ':' +
                thisDate.getMinutes()
            let nowTime = this.tranDate(currentTime)
            // 如果当前时间处于时间段内，返回true，否则返回false
            if (nowTime < startTime || nowTime>endTime) {
                this.isTime = false
                return false
            } else {
                if (thisDate.getHours() >= 10 && thisDate.getHours() < 20) {
                    this.isTime = true
                } else {
                    this.isTime = false
                }
            }
        },

        tranDate(time) {
            return new Date(time.replace(/-/g, '/')).getTime()
        },

        //获取商品列表判断支付状态
        getGoods() {
            GetGoodList(this.getCookie('username')).then(res => {
                const data = res.data
                if (data.success && data.data) {
                    this.goods = data.data
                    this.leftImg = this.goods[0].goodPic
                    this.leftImgTop = this.goods[0].topPic
                    this.rightImgTop = this.goods[1].topPic
                    this.rightImg = this.goods[1].goodPic
                    if (
                        this.goods[0].orderId !== null 
                        // this.goods[0].orderId !== ''
                    ) {
                        this.orderId = this.goods[0].orderId
                        this.getPayStatus().then(resstatus=>{
                            this.payStatus1 = resstatus
                                if(resstatus){
                                    this.orderTrue = this.orderId
                                }
                        })           
                    
                    }
                    if (
                        this.goods[1].orderId !== null 
                    ) {
                        this.orderId = this.goods[1].orderId
                         this.getPayStatus().then(resstatus=>{
                            this.payStatus2 = resstatus
                                if(resstatus){
                                    this.orderTrue = this.orderId
                                }
                        })          
                    }
                    if (
                        this.goods[0].orderId === null &&
                        this.goods[1].orderId === null
                    ) {
                        this.orderId = ''
                    }
                }
            })
        },
        //获取openid、userid（支付用)
        getIds() {
            GetOpenid(this.getCookie('username')).then(res => {
                const data = res.data
                if (data.success && data.data) {
                    this.openId = data.data.openid
                    this.userId = data.data.userId
                }
            })
        },
        
        
        //转发
       	wxConfig() {
                // var urls = Base64.encode(this.wxurl);
                var that = this 
				var linkurl ="https://open.weixin.qq.com/connect/oauth2/authorize?appid=ww76673d8a0d7cd9d7&redirect_uri=http://attendance.api.com/wx/globalauth.html?backUrl=http://mall.api.com/yunji516/index.html&response_type=code&scope=snsapi_userinfo&agentid=1000122#wechat_redirect"
				wx.onMenuShareAppMessage({
					title: "516爆款对爆款", // 分享标题
					desc: "搏一搏，单车变摩托，拼一拼，小鸡变雄鹰", // 分享描述
					link: linkurl, // 分享链接
					imgUrl:that.imgsrc, // 分享图标
					success: function() {
						// 用户确认分享后执行的回调函数
					},
					cancel: function() {
						// 用户取消分享后执行的回调函数
					}

				});
				wx.onMenuShareTimeline({
					title: "516爆款对爆款", // 分享标题
					desc: "搏一搏，单车变摩托，拼一拼，小鸡变雄鹰", // 分享描述
					link: linkurl, // 分享链接
					imgUrl:that.imgsrc, // 分享图标
					success: function() {
						// 用户确认分享后执行的回调函数
					},

					cancel: function() {
						// 用户取消分享后执行的回调函数
					}

                });
                wx.onMenuShareWechat({
                     title: "516爆款对爆款", // 分享标题
					desc: "搏一搏，单车变摩托，拼一拼，小鸡变雄鹰", // 分享描述
					link: linkurl, // 分享链接
					imgUrl:that.imgsrc, // 分享图标
                    success: function () {
                        // 用户确认分享后执行的回调函数
                    },
                    cancel: function () {
                        // 用户取消分享后执行的回调函数
                    }
                });

			},
        //获取签名TIket
        gettickets() {
            var that = this
            let url = window.location.href
            const parms = qs.stringify({
                url: url
            })
            GetTicket(parms).then(res => {
                if (res.data.success) {
                    that.ticket = res.data.data
                    wx.config({
                        debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来
                        appId: 'ww76673d8a0d7cd9d7', // 必填，企业微信的corpID
                        timestamp: 1414587466, // 必填，生成签名的时间戳
                        nonceStr: 'Wm3WZYTPz0wzccnC', // 必填，生成签名的随机串
                        signature: this.ticket, // 必填，签名
                        jsApiList: ['getBrandWCPayRequest',"onMenuShareAppMessage","onMenuShareWechat","onMenuShareTimeline"]
                    })
                   	wx.ready(function () {
                           that.wxConfig()
                           
                    })
                }
            })
        },
        // 押宝 获取orderId
        getBet(item) {
            const parms = qs.stringify({
                userId: this.userId,
                openId: this.openId,
                goodsid: item.id
            })
            GetpreRecord(parms).then(res => {
                if (res.data.success) {
                    this.isShow = true
                    this.orderId = res.data.orderId
                }
            })
        },
        // 查询订单支付状态情况
        getPayStatus() {
            if (this.orderId !== null) {
                const parms1 = qs.stringify({
                    orderId: this.orderId
                })
               return new Promise((resolve, reject) => {
                    GetPayStatus(parms1).then(res => {
                        if (res.data.success ) {
                            resolve(res.data.payStatus);
                        } 
                    })
                      .catch(error => {
                            reject(error);
                        });
               })

            }

        },
        cancle() {
            this.isShow = false
        },
        //发起付款
        confirm() {
            if (this.orderId) {
                const parms = qs.stringify({
                    orderId: this.orderId
                })
                GetPay(parms).then(res => {
                    if (res.data.success) {
                        this.isShow = false
                        this.orderInfo = res.data.data.payResponse
                        this.getWxconfig(this.orderInfo)
                    }
                })
            }
        },
        getWxconfig(orderInfo) {
            var vm = this
            WeixinJSBridge.invoke(
                'getBrandWCPayRequest',
                {
                    debug: false,
                    appId: orderInfo.appId, //公众号名称，由商户传入
                    timeStamp: orderInfo.timeStamp, //时间戳，自1970年以来的秒数
                    nonceStr: orderInfo.nonceStr, //随机串
                    package: orderInfo.package,
                    signType: 'MD5', //微信签名方式：
                    paySign: orderInfo.paySign //微信签名
                },
                function(res) {
                    if (res.err_msg == 'get_brand_wcpay_request:ok') {
                        vm.getGoods()
                        // vm.getPayStatuss()
                    }
                }

            )
        },
        getregular() {
            this.isRegular = true
        },
        getClose() {
            this.isRegular = false
        }
    }
}
</script>

<style scoped >
@import '../assets/css/home.css';
.regulars {
    display: inline-block;
    position: fixed;
    right: 0;
    top: 8%;
    z-index: 888;
    padding: 6px 10px;
    background: rgba(0, 0, 0, 0.6);
    color: #fff;
}
.imgDia {
    width: 260px;
    position: absolute;
    top: 50%;
    left: 50%;
    z-index: 999;
    transform: translate(-50%, -50%);
}
.imgDia > img {
    width: 100%;
}
.closeIcon {
    position: absolute;
    right: 0px;
    padding-right: 10px;
    top: 0px;
    font-size: 30px;
    display: inline-block;
    width: 60px;
    text-align: center;
    height: 40px;
    line-height: 40px;
    text-align: right;
}
.yaBao{
    position: absolute;
    top:10px;
    right:5px;
    z-index:2;
}
</style>