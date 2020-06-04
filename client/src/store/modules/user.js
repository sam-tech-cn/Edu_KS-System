import axios from '@/http'
import { getAvatar, extractToken } from '@/utils/utils'
import { setToken, removeToken, getToken } from '@/utils/auth'
import {
    SET_USERINFO,
    SET_TOKEN,
    PURGE_AUTH
} from '@/store/mutation-types'

import {
    LOG_IN,
    LOG_OUT,
    GET_USERINFO,
    UPDATE_USERINFO
} from '@/store/action-types'

const defaultState = () => {
    return {
        user: {},
        avatar: '',
        token: getToken()
    }
}

const state = defaultState()

const getters = {
    avatar: state => state.avatar,
    user: state => state.user,
    token: state => state.token
}

const mutations = {
    [SET_USERINFO]: (state, user) => {

        // the server side return "_id" via mongo, we ommit password here
        const { _id, name, email, admin } = user
        state.user = { _id, name, email, admin }
        state.avatar = getAvatar(user.email)
    },
    [SET_TOKEN]: (state, token) => {
        state.token = token
    },
    [PURGE_AUTH]: state => {
        removeToken()
        Object.assign(state, defaultState())
    }
}

const actions = {
    // @edu must add commit
    [LOG_IN]: ({ commit }, userInfo) => {
        return new Promise((resolve, reject) => {
            axios.post("api/user/login", userInfo).then(res => {
                const { token } = res.data
                setToken(token)
                commit(SET_TOKEN,token)                
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [LOG_OUT]: ({ commit }) => {
        commit(PURGE_AUTH)
    },
    [GET_USERINFO]: ({ commit }, token) => {
        const user = extractToken(token)

        return new Promise((resolve, reject) => {
            axios.get(`api/user/${user.id}`).then(res => {
                const { _id, name, email, admin } = res.data
                commit(SET_USERINFO, { _id, name, email, admin })
                resolve()
            }).catch(error => {
                reject(error)
            })
        })
    },
    [UPDATE_USERINFO]: ({ commit }, user) => {
        commit(SET_USERINFO, user)
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}