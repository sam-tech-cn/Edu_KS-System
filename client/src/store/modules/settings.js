import { getSidebarStatus, setSidebarStatus } from '@/utils/utils'
import { SET_SIDEBARSTATUS } from '@/store/mutation-types'
import { TOGGLE_SIDEBSR } from '@/store/action-types'

const state = {
    /*
     * @edu initially localstorage.getItem('item') will return null, 
     * otherwise will return a string, remember a none empty string, in conditional operator is always execute true part
     * e.g. 'false' ? 'y' : 'n' -> still return y
     */

    // true means side bar is collapse
    sidebarStatus: getSidebarStatus() ? !!(getSidebarStatus() === 'true') : false
}

const getters = {
    sidebarStatus: state => state.sidebarStatus
}

const mutations = {
    [SET_SIDEBARSTATUS]: (state, status) => {
        setSidebarStatus(status)
        state.sidebarStatus = status
    }
}

const actions = {
    [TOGGLE_SIDEBSR]({ commit }, status) {
        commit(SET_SIDEBARSTATUS, status)
    }
}

export default {
    state,
    mutations,
    actions,
    getters
}