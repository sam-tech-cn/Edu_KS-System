const Log = require('../models/Log')
const project_item = {
    'assignee': 'Assignee',
    'project_code': 'Project Code',
    'design_start': 'Design Start Time',
    'design_end': 'Degign End Time',
    'design_perc': 'Design Complete',
    'design_approval': 'Design Approval',
    'coding_start': 'Coding Start Time',
    'coding_end': 'Coding End Time',
    'coding_perc': 'Coding Complete',
    'coding_approval': 'Coding Approval',
    'testing_start': 'Test Start Time',
    'testing_end': 'Test End Time',
    'testing_perc': 'Test Complete',
    'testing_approval': 'Test Approval',
    'release': 'Release'
}

/**
 * Save log, for single operation
 * @param {*} log
 * @returns {*} saved log
 */
exports.saveLog = async (log) => {
    return new Log(log).save()
}

/**
 * Save logs, for batch operations
 * @param {*} logs the array of logs
 * @returns {*} saved logs
 */
exports.saveManyLogs = async (logs) => {
    return Log.insertMany(logs)
}

/**
 * Get project modification logs by project_id 
 * order by action_time descending
 * @param {*} id project id
 * @param {*} sortType default is descending, 1: asending, -1: descending
 * @returns {*} project list
 */
exports.getLogList = async (id, sortType) => {
    return Log.find({ project_id: id }).sort({ action_time: sortType })
}

/**
 * Make record with specified pattern (<item name>|<old value>|<new value>) sepearted by ','
 * @param {*} oldPrj must be stringified
 * @param {*} newPrj must be stringified
 * @returns {*} empty string or record string with specified pattern as bove introduced
 */
exports.makeRecord = (oldPrj, newPrj, item = project_item) => {
    const recordArr = []
    const formatedOld = JSON.parse(JSON.stringify(oldPrj))
    const formatedNew = JSON.parse(JSON.stringify(newPrj))
    Object.keys(formatedOld).forEach(key => {
        if ( (key in formatedNew) && formatedOld[key] != formatedNew[key]) {
            recordArr.push(item[key] + '|' + formatedOld[key] + '|' + formatedNew[key])
        }
    })
    if (recordArr.length > 0) {
        return recordArr.join(',')
    } else {
        return ''
    }
}



