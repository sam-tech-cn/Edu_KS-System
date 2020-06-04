import axios from 'axios'
import { MessageBox, Message, Loading } from 'element-ui'
import { getToken, removeToken } from '@/utils/auth'
import router from './router'

let loading

function startLoading() {
    loading = Loading.service({
        lock: true,
        text: 'Loading',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
    })
}

function endLoading() {
    loading.close()
}

// request interceptor
axios.interceptors.request.use(config => {
    startLoading()

    // check token and set authorization
    if (getToken()) {
        config.headers.Authorization = getToken()
    }
    return config;
}, error => {
    return Promise.reject(error);
})

// response interceptor
axios.interceptors.response.use(response => {
    endLoading()
    return response
}, error => {
    endLoading()

    // check status code, 401 means unauthorized
    if (error.response.status == 401) {
        Message.error('Invalid token, please log in again')
        removeToken()

        // navigate to login page
        router.push('/login')
    } else {

        // @edu get error response data from server side
        if (typeof error.response.data === 'object') {
            MessageBox(JSON.stringify(error.response.data), "KS-System")
        } else {
            Message.error(error.response.data, "KS-System")
        }

    }

    return Promise.reject(error);
})

export default axios