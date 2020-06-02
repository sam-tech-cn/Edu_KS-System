const logService = require('../service/log-service')
const userService = require('../service/user-service')
const projectService = require('../service/project-service')
const testUtils = require('./test-utils')
const User = require('../models/User')
const Project = require('../models/Project')
const action_type = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE"
}

let operator = {}
let receivers = []
let userIDs = []
describe('test log service', () => {
    beforeAll(async () => {
        try {
            await testUtils.connectMongo('test-' + testUtils.randomString())
            await testUtils.dropDatabase()

            // save user data
            const users = await User.insertMany(Array.from({ length: 5 }, () => testUtils.randomUser()))
            userIDs = users.map(x => x.id)
            operator = testUtils.randomArr(users)
            receivers = await userService.getReceivers(operator)
        } catch (error) {
            console.error(error)
        }
    })

    afterAll(async () => {
        await testUtils.dropDatabase()
        await testUtils.disconnectMongo()
    })

    test('test logService save log', async () => {
        const project_id = testUtils.randomObjectId()
        const log = {
            operator: operator.id,
            project_id: project_id,
            action_type: action_type.CREATE,
            record: '',
            receivers: receivers,
        }
        const savedLog = await logService.saveLog(log)
        const checkLog = {
            operator: operator.id,
            project_id: project_id,
            action_type: action_type.CREATE,
            record: '',
            receivers: receivers,
        }
        expect(JSON.parse(JSON.stringify(savedLog))).toMatchObject(JSON.parse(JSON.stringify(checkLog)))
    })

    test('test batch save logs', async () => {
        const logs = Array.from({ length: 5 }, () => {
            return {
                operator: operator.id,
                operator_name: operator.name,
                project_id: testUtils.randomObjectId(),
                project_code: testUtils.randomString(),
                action_type: action_type.DELETE,
                record: testUtils.randomString(),
                receivers: receivers
            }
        })
        const savedLogs = await logService.saveManyLogs(logs)
        expect(JSON.parse(JSON.stringify(savedLogs))).toMatchObject(JSON.parse(JSON.stringify(logs)))
    })

    test('test get log lists by project id', async () => {
        const project = await new Project(testUtils.randomPrj(userIDs)).save()
        const checkLogs = []

        // assume update 10 times, action time is different
        // @edu promise.all
        await Promise.all(Array(10).fill().map(async () => {
            const updateProject = testUtils.randomPrj(userIDs)
            const log = await projectService.updateProject(project.id, operator, updateProject)

            // random action time
            log.action_time = testUtils.randomDate()
            const savedLog = await logService.saveLog(log)
            checkLogs.push(savedLog)
        }))
        const logs = await logService.getLogList(project.id, -1)

        // we only extract "_id" for operator to check
        for(i=0; i< logs.length; i++){
            logs[i].operator = logs[i].operator['_id']
        }

        // sort checLogs descending @edu .sort((a,b)=>number) if number > 1 desc, -1 asc, 0 remain 
        checkLogs.sort((a, b) => b.action_time - a.action_time)
        expect(JSON.parse(JSON.stringify(logs))).toMatchObject(JSON.parse(JSON.stringify(checkLogs)))

    })
    describe('test make record', () => {
        test('old project and new project are same', () => {
            expect(logService.makeRecord({}, {})).toEqual('')
            const oldPrj = testUtils.randomPrj(userIDs)
            const newPrj = oldPrj
            expect(logService.makeRecord(oldPrj, newPrj)).toEqual('')
        })
        test('new project has changed', async () => {
            const oldPrj = {
                assignee: operator.id,
                project_code: 'A0001',
                design_start: new Date('2020-02-23'),
                design_end: new Date('2020-02-24'),
                design_perc: 0.5,
                design_approval: 'TODO',
                coding_start: new Date('2020-02-23'),
                coding_end: new Date('2020-02-24'),
                coding_perc: 0.6,
                coding_approval: 'TODO',
                testing_start: new Date('2020-02-23'),
                testing_end: new Date('2020-02-24'),
                testing_perc: 0.8,
                testing_approval: 'TODO',
                release: new Date('2020-02-25')
            }
            const savedPrj = await new Project(oldPrj).save()

            // now changed all properties
            const newPrj = {
                assignee: null,
                project_code: 'Z0001',
                design_start: new Date('2019-02-23'),
                design_end: new Date('2019-02-24'),
                design_perc: 0.1,
                design_approval: 'NG',
                coding_start: new Date('2019-02-23'),
                coding_end: new Date('2019-02-24'),
                coding_perc: 0.1,
                coding_approval: 'NG',
                testing_start: new Date('2019-02-23'),
                testing_end: new Date('2019-02-24'),
                testing_perc: 0.1,
                testing_approval: 'OK',
                release: new Date('2019-02-25')
            }

            // console.warn(`please have a look result of log:\n${logService.makeRecord(savedPrj, newPrj)}`)
            expect(logService.makeRecord(savedPrj, newPrj).split(',').length).toBe(Object.keys(oldPrj).length)
        })
    })
})