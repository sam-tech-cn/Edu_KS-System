const notificationService = require('../service/notification-service')
const projectService = require('../service/project-service')
const userService = require('../service/user-service')
const testUtils = require('./test-utils')
const Project = require('../models/Project')
const User = require('../models/User')
const Log = require('../models/Log')

describe('test notification service', () => {
    beforeAll(async () => {
        try {
            await testUtils.connectMongo('test-' + testUtils.randomString())
            await testUtils.dropDatabase()

            await User.insertMany(Array.from({ length: 5 }, () => testUtils.randomUser()))
        } catch (error) {
            console.error(error)
        }
    })
    afterAll(async () => {
        await testUtils.dropDatabase()
        await testUtils.disconnectMongo()
    })

    describe('test get notification', () => {
        test('no notification', async () => {
            const fakeReceiver = testUtils.randomObjectId()
            const notification = await notificationService.getNotification(fakeReceiver)
            expect(notification.length).toBe(0)
        })

        test('has notification', async () => {
            const operator = await new User(testUtils.randomUser()).save()
            const userIDs = (await User.find()).map(x => x.id)
            const project = await new Project(testUtils.randomPrj(userIDs)).save()
            const receivers = await userService.getReceivers(operator)
            const receiver_id = testUtils.randomArr(receivers).receiver

            // assume update 10 times
            await Promise.all(Array(10).fill().map(async () => {
                const updateProject = testUtils.randomPrj(userIDs)
                const log = await projectService.updateProject(project.id, operator, updateProject)
                await new Log(log).save()
            }))

            const notification = await notificationService.getNotification(receiver_id)
            expect(notification.length).toBe(10)

            // test pattern
            expect(testUtils.randomArr(notification)).toEqual({
                log_id: expect.anything(),
                receiver_id: expect.anything(),
                project_id: expect.anything(),
                project_code: expect.any(String),
                operator_id: expect.anything(),
                operator_name: expect.any(String),
                action_type: expect.any(String),
                action_time: expect.any(Date),
                read_status: expect.any(Boolean),
                delete_status: expect.any(Boolean)
            })

            // edge case, delete receiver and project, still has receiver name and project code
            await User.findByIdAndDelete(operator.id)
            await Project.findByIdAndDelete(project.id)

            const notification2 = await notificationService.getNotification(receiver_id)
            expect(testUtils.randomArr(notification2)).toMatchObject({
                operator_name: expect.any(String),
                project_code: expect.any(String)
            })
        })
    })

    describe('test update notification', () => {
        let receiver_id
        beforeAll(async () => {
            const operator = await new User(testUtils.randomUser()).save()
            const userIDs = (await User.find()).map(x => x.id)
            const project = await new Project(testUtils.randomPrj(userIDs)).save()
            const receivers = await userService.getReceivers(operator)
            const receiverObj = testUtils.randomArr(receivers)
            receiver_id = receiverObj.receiver

            // assume update 10 times
            await Promise.all(Array(10).fill().map(async () => {
                const updateProject = testUtils.randomPrj(userIDs)
                const log = await projectService.updateProject(project.id, operator, updateProject)
                await new Log(log).save()
            }))
        })

        test('test update all false read status to true', async () => {
            // set all read status to false
            await Log.updateMany({ receiver: receiver_id, read_status: true }, { $set: { 'receivers.$.read_status': false } })
            const assymeResult = await Log.find({ receivers: { $elemMatch: { receiver: receiver_id, read_status: true } } })
            expect(assymeResult).toEqual([])

            const updateFiled = {
                read_status: true
            }
            await notificationService.updateAll(receiver_id, updateFiled)
            const result = await Log.find({ receivers: { $elemMatch: { receiver: receiver_id, read_status: false } } })
            expect(result).toEqual([])
        })

        test('test update all false delete status to true', async () => {
            // set all delete status to false
            await Log.updateMany({ receiver: receiver_id, delete_status: true }, { $set: { 'receivers.$.delete_status': false } })
            const assymeResult = await Log.find({ receivers: { $elemMatch: { receiver: receiver_id, delete_status: true } } })
            expect(assymeResult).toEqual([])

            const updateFiled = {
                delete_status: true
            }
            await notificationService.updateAll(receiver_id, updateFiled)
            const result = await Log.find({ receivers: { $elemMatch: { receiver: receiver_id, delete_status: false } } })
            expect(result).toEqual([])

        })
    })

})