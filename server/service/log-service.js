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
 * @param {Object} log
 * @returns {Object[]} saved log
 */
exports.saveLog = async (log) => {
    return new Log(log).save()
}

/**
 * Save logs, for batch operations
 * @param {Object[]} logs the array of logs
 * @returns {Object[]} saved logs
 */
exports.saveManyLogs = async (logs) => {
    return Log.insertMany(logs)
}

/**
 * Get project modification logs by project_id  order by action_time descending
 * @param {string} id project id
 * @param {string} sortType default is descending, 1: asending, -1: descending
 * @returns {Object[]} project list
 */
exports.getLogList = async (id, sortType) => {
    return Log.find({ project_id: id })
        .sort({ action_time: sortType })
        .populate('operator', '_id name email admin')
}

/**
 * Get logs by log ids
 * @param {Object[]} ids log ids
 * @param {number} sortType default is descending, 1: asending, -1: descending
 */
exports.getLogByIds = async (ids, sortType) => {
    return Log.find({
        _id: { $in: ids }
    }).sort({action_time: sortType})
}

/**
 * Make record with specified pattern (<item name>|<old value>|<new value>) separated by ','
 * @param {Object} oldPrj must be stringified in process
 * @param {Object} newPrj must be stringified in process
 * @returns {string} empty string or record string with specified pattern as bove introduced
 */
exports.makeRecord = (oldPrj, newPrj, item = project_item) => {
    const recordArr = []
    const formattedOld = JSON.parse(JSON.stringify(oldPrj))
    const formattedNew = JSON.parse(JSON.stringify(newPrj))
    Object.keys(formattedOld).forEach(key => {
        if ((key in formattedNew) && formattedOld[key] != formattedNew[key]) {
            recordArr.push(item[key] + '|' + formattedOld[key] + '|' + formattedNew[key])
        }
    })
    if (recordArr.length > 0) {
        return recordArr.join(',')
    } else {
        return ''
    }
}



