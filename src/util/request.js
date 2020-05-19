import Vue from 'vue'
import axios from 'axios'
const service = axios.create({
    
    baseURL: "/system"
})
// request拦截器
service.interceptors.request.use(config => {
    return config
}, error => {
    Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
    response => {

        return response
    },
    error => {

        return Promise.reject(error)
    }
)

export default service
