// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
// import axios from 'axios';
import '@/assets/css/resets.css'
import '@/assets/commonjs/rem.js'
import { getCookie ,isMobile} from './util/getcookie.js'

Vue.config.productionTip = false
Vue.prototype.getCookie = getCookie
// Vue.prototype.isMobile = isMobile
if(isMobile() !== null) {
    router.replace('/');
    // next();
}else {
    //  alert("请在手机上查看");
     router.replace('/pc_index');

}
/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    components: { App },
    template: '<App/>'
})

// router.beforeEach((to, from, next) => {
//     console.log(111);
//     console.log(isMobile() !== null);
//     if(isMobile() !== null) {
//         next();
//     }else {
//         alert("请在手机上查看");
//     }
// })
