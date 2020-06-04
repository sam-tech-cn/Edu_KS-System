const mongoose = require('mongoose')
const testMongoURI = 'mongodb://localhost:27017/'

module.exports = {
    testMongoURI: testMongoURI,
    connectMongo: async (db = 'test-ks') => {
        const uri = `${testMongoURI}${db}`
        return mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
            useCreateIndex: true
        })
    },
    disconnectMongo: async () => {
        return mongoose.disconnect()
    },
    dropDatabase: async () => {
        return mongoose.connection.db.dropDatabase()
    },

    // random a date
    randomDate: (start = new Date(2019, 0, 1), end = new Date()) => {
        return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()))
    },
    // @edu number.toString(radix) e.g hex 0, ..., 9, a, b, c, d, e, f, so 36-base, 0, 1, ..., 9, ..., q, ..., z
    randomString: (length = 5) => {
        return Math.random().toString(36).substr(2, length)
    },
    // random an array
    randomArr: (arr) => {
        if (arr.length > 0) {
            return arr[Math.floor(Math.random() * arr.length)]
        } else {
            return null
        }
    },
    // precision 2 digits
    randomPercentage: () => {
        return Math.round(Math.random() * 100) / 100
    },
    randomObjectId: () => {
        return mongoose.Types.ObjectId()
    },
    // arr is string[]
    sortStrArrAsc: (arr, sort = 'asc') => {
        const sortedArr = arr.sort((x, y) => x.toLowerCase().localeCompare(y.toLowerCase()))
        if (sort == 'asc' || sort == 1) {
            return sortedArr
        } else if (sort == 'desc' || sort == -1) {
            return sortedArr.reverse()
        }
    },
    // random a project
    randomPrj: (userIDs) => {
        return {
            assignee: module.exports.randomArr(userIDs),
            project_code: module.exports.randomString(),
            design_start: module.exports.randomDate(),
            design_end: module.exports.randomDate(),
            design_perc: module.exports.randomPercentage(),
            design_approval: module.exports.randomArr(['TODO', 'NG', 'OK']),
            coding_start: module.exports.randomDate(),
            coding_end: module.exports.randomDate(),
            coding_perc: module.exports.randomPercentage(),
            coding_approval: module.exports.randomArr(['TODO', 'NG', 'OK']),
            testing_start: module.exports.randomDate(),
            testing_end: module.exports.randomDate(),
            testing_perc: module.exports.randomPercentage(),
            testing_approval: module.exports.randomArr(['TODO', 'NG', 'OK']),
            release: module.exports.randomDate()
        }
    },
    // random a user
    randomUser: () => {
        return {
            name: module.exports.randomString(),
            email: `${module.exports.randomString()}@test.com`,
            password: module.exports.randomString(),
            admin: module.exports.randomArr([true, false]),
            note: module.exports.randomString(10)
        }
    }
}