const projectService = require('../service/project-service')
const logService = require('../service/log-service')
const userService = require('../service/user-service')
const Project = require('../models/Project')
const User = require('../models/User')
const testUtils = require('./test-utils')
const action_type = {
    CREATE: "CREATE",
    UPDATE: "UPDATE",
    DELETE: "DELETE"
}

// global variable, we only test project service only
let userIDs = []
let users = []
let operator = {}
let receivers = []

// mongodb connection
describe('test project service', () => {
    beforeAll(async () => {
        try {
            await testUtils.connectMongo('test-' + testUtils.randomString())
            await testUtils.dropDatabase()

            // save users for test
            users = await User.insertMany(Array.from({ length: 5 }, () => testUtils.randomUser()))
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

    describe('test add project and log', () => {
        test('test add project', async () => {
            const project = testUtils.randomPrj(userIDs)

            const log = await projectService.addProject(operator, project)

            const checkPrj = await Project.findOne({ project_code: project.project_code })
            const checkLog = {
                operator: operator.id,
                operator_name: operator.name,
                project_id: checkPrj.id,
                project_code: checkPrj.project_code,
                action_type: action_type.CREATE,
                record: '',
                receivers: receivers,
            }

            // be aware of actual mongoose return object
            expect(JSON.parse(JSON.stringify(log))).toMatchObject(JSON.parse(JSON.stringify(checkLog)))
        })
    })


    test('test get project list', async () => {
        const projects = await Project.find()
        const projectsList = await projectService.getProjectList()
        expect(projectsList.length).toBe(projects.length)

        // check project_code ascending
        const projectCodes = projectsList.map(x => x.project_code)
        const checkCodes = testUtils.sortStrArrAsc(projects.map(x => x.project_code))
        expect(projectCodes).toEqual(checkCodes)
    })

    test('test update project by id', async () => {
        const oldPrj = testUtils.randomArr(await Project.find())
        const updatePrj = testUtils.randomPrj(userIDs)

        const log = await projectService.updateProject(oldPrj.id, operator, updatePrj)

        const record = await logService.makeRecord(oldPrj, updatePrj)
        const checkLog = {
            operator: operator.id,
            operator_name: operator.name,
            project_id: oldPrj.id,
            project_code: oldPrj.project_code,
            action_type: action_type.UPDATE,
            record: record,
            receivers: receivers,
        }
        expect(JSON.parse(JSON.stringify(log))).toMatchObject(JSON.parse(JSON.stringify(checkLog)))

        // check if return null
        const fakeID = testUtils.randomObjectId()
        const log2 = await projectService.updateProject(fakeID, operator, updatePrj)
        expect(log2).toEqual(null)
    })

    test('test delete project by id', async () => {
        const project = testUtils.randomPrj(userIDs)
        const projectID = (await new Project(project).save()).id
        const log = await projectService.deleteProject(projectID, operator)

        // check if project deleted
        expect(await Project.findById(projectID)).toEqual(null)
        const checkLog = {
            operator: operator.id,
            operator_name: operator.name,
            project_id: projectID,
            project_code: project.project_code,
            action_type: action_type.DELETE,
            record: `Project Code|${project.project_code}|null`,
            receivers: receivers,
        }

        // compare return value
        expect(JSON.parse(JSON.stringify(log))).toMatchObject(JSON.parse(JSON.stringify(checkLog)))

        // check if return null
        const fakeID = testUtils.randomObjectId()
        const log2 = await projectService.deleteProject(fakeID, operator)
        expect(log2).toEqual(null)
    })

    describe('test batch delete projects', () => {
        test('delete actual projects', async () => {
            // save projects for test
            // @edu fill array with random data
            const projectIDs = Array.from({ length: 5 }, () => testUtils.randomObjectId())
            const projects = projectIDs.map(x => Object.assign({}, testUtils.randomPrj(userIDs), { _id: x }))
            await Project.insertMany(projects)

            const logs = await projectService.batchDeleteProject(projectIDs, operator)

            // to expect projects have been deleted
            const result = await Project.find({ _id: { $in: projectIDs } })
            expect(result).toEqual([])

            // to check logs
            const checkLogs = projects.map(x => {
                return {
                    operator: operator.id,
                    operator_name: operator.name,
                    project_id: x._id,
                    project_code: x.project_code,
                    action_type: action_type.DELETE,
                    record: `Project Code|${x.project_code}|null`,
                    receivers: receivers
                }
            })
            expect(JSON.parse(JSON.stringify(logs))).toMatchObject(JSON.parse(JSON.stringify(checkLogs)))
        })

        test('ids are invalid', async () => {
            const fakeIDs = Array.from({ length: 5 }, () => testUtils.randomObjectId())
            const logs = await projectService.batchDeleteProject(fakeIDs, operator)
            expect(logs).toEqual(null)
        })
    })
})