import Axios from '@/util/request'
export const GetGoodList = data => Axios({ 
    method: 'get',
    url: '/goods/show?workCode=' + data ,
    data
  })
  //获取openid、userid（支付用）
  export const GetOpenid = data => Axios({ 
    method: 'get',
    url: '/pay/getOpenid?workCode=' + data ,
    data
  })
  //企微ticket
  export const GetTicket = data => Axios({ 
    method: 'post',
    url: '/common/ticket',
    data
  })
  //预订单
  export const GetpreRecord = data => Axios({ 
    method: 'post',
    url: '/pay/preRecord',
    data
  })
//   微信支付发起
export const GetPay = data => Axios({ 
    method: 'post',
    url: '/pay/create',
    data
  })
  // 查询订单状态
  
  export const GetPayStatus = data => Axios({ 
    method: 'get',
    url: '/pay/checkPayStatusByOrderId?'+data,
    data
  })
