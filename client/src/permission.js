import router from './router'
import store from '@/store'
import { GET_USERINFO } from '@/store/action-types'
import { getToken } from '@/utils/auth'

router.beforeEach(async (to, from, next) => {
    const token = getToken();
    if (token) {
        if (to.path == "/login" || to.path == "/register") {
            next("/");
        } else {
            // @edu check if mapGetters has data, otherwise refresh vuex userinfo, here user is an object
            const hasUserInfo = store.getters.user
            if (Object.keys(hasUserInfo).length > 0) {
                next()
            } else {
                await store.dispatch(GET_USERINFO, token)
                next()
            }
        }
    } else {
        if (to.path == "/login" || to.path == "/register") {
            next()
        } else {
            next("/login")
        }
    }
})