import jwt_decode from 'jwt-decode'
import gravatar from 'gravatar'
import moment from 'moment'

const SidebarKey = 'sidebar'
/**
 * Get online avatar by specific email
 * @param {string} email 
 * @param {Object} options refer gravatar website https://en.gravatar.com/site/implement/images/
 * @param {boolean} protocol true: 'https://' false: 'http://'
 * @returns {string} avatar online address
 */
export function getAvatar(email, options = null, protocol = true) {
    if (!options) {
        options = {
            s: '200',
            r: 'pg',
            d: 'mp'
        }
    }
    return gravatar.url(email, options, protocol)
}

/**
 * Extract jwt token to original data
 * @param {string} token 
 * @returns {Object} original object
 */
export function extractToken(token) {
    return jwt_decode(token)
}

export function getSidebarStatus() {
    return localStorage.getItem(SidebarKey)
}

export function setSidebarStatus(status) {
    return localStorage.setItem(SidebarKey, status)
}

/**
 * Reduce array group by a specific filed
 * [{name:"samtech",skill:"js"},{name:"samtech",skill:"shell"},{name:"jctech",skill:"ps"}]
 * => {samtech:[{name:"samtech",skill:"js"},{name:"samtech",skill:"shell"}],jctech:[{name:"jctech",skill:"ps"}]}
 * @param {Object[]} arr 
 * @param {string} key 
 */
export function groupby(arr, key) {
    return arr.reduce((rv, x) => {

        /*
         * @edu if return object has no key create key then value = [] then push item, if hash key push item directory
         * sam as https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce
         */
        (rv[x[key]] = rv[x[key]] || []).push(x)
        return rv
    }, {})
}

/**
 * Get gap alert info between two specified times
 * @param {string} from 
 * @param {string} to default is now
 */
export function getTimeGapInfo(from, to = (new Date()).toString()) {
    const gap = (new Date(to)).getTime() - (new Date(from)).getTime()
    if (gap / 1000 / 60 < 60) {
        const info = Math.floor(gap / 1000 / 60)
        return info > 1 ? `${info} minutes ago` : '1 minute ago'
    } else if (gap / 1000 / 60 / 60 < 24) {
        const info = Math.floor(gap / 1000 / 60 / 60)
        return info > 1 ? `${info} hours ago` : '1 hour ago'
    } else if (gap / 1000 / 60 / 60 >= 24) {
        const info = Math.floor(gap / 1000 / 60 / 60 / 24)
        return info > 1 ? `${info} days ago` : '1 day ago'
    }
}

export function validateTime(val) {
    return moment(val, moment.ISO_8601, true).isValid()
}

/**
 * if val is date return formatted date with specific delimiter, e.g. 2020-04-01
 * if val is a number return xx%, only keep 2 digits
 * otherwise val keep same
 * @param {*} val 
 * @param {string} delimiter default is "-"
 */
export function getFmtVal(val, delimiter = "-") {
    if (!isEmpty(val)){
        if (moment(val, moment.ISO_8601, true).isValid()) {
            const time = new Date(val.toString())
            return `${time.getFullYear()}${delimiter}${(time.getMonth() + 1).toString().padStart(2, '0')}${delimiter}${time.getDate().toString().padStart(2, '0')}`
        } else if (!isNaN(val.toString())) {
            return Math.round(val) + '%'
        } else {
            return val
        }
    }else{
        // undefined null
        return val
    }
}

export function getFmtPrjCode(data, useBackup = false) {
    if (!useBackup) {
        return data.project_id ? data.project_id.project_code : data.project_code
    } else {
        return data.project_code
    }
}

export function specifiedPath(path) {
    return /^https?:/.test(path);
}

export function isEmpty(val) {
    return (val === undefined || val == null || val.length <= 0) ? true : false
}