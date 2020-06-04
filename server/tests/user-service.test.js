const userService = require('../service/user-service')
const testUtils = require('./test-utils')
const utils = require('../utils/utils')
const User = require('../models/User')

describe('test user service', () => {
    beforeAll(async () => {
        try {
            await testUtils.connectMongo('test-' + testUtils.randomString())
            await testUtils.dropDatabase()
        } catch (error) {
            console.error(error)
        }
    })

    afterAll(async () => {

        // if collection  is not exist, will raise error. use condition as below
        // const length = (await User.db.db.listCollections({ name: User.collection.name }).toArray()).length
        // if (length !== 0) {
        //     await User.collection.drop()
        // }
        await User.collection.drop()
        await testUtils.disconnectMongo()
    })

    describe('test user login', () => {
        const users = Array.from({ length: 5 }, () => testUtils.randomUser())
        beforeAll(async () => {
            await User.insertMany(users)
        })
        test('right name wrong password', async () => {
            const name = testUtils.randomArr(users).name
            const password = "wrong"
            const result = await userService.loginUser(name, password)
            expect(result).toEqual({ status: 400, msg: 'Invalid password' })
        })
        test('wrong name', async () => {
            const name = "xxx"
            const password = "wrong"
            const result = await userService.loginUser(name, password)
            expect(result).toEqual({ status: 404, msg: 'User not found' })
        })
        test('right user & password', async () => {
            const user = testUtils.randomUser()
            const name = user.name
            const password = user.password
            user.password = await utils.encrypt(user.password)
            await new User(user).save()

            const result = await userService.loginUser(name, password, '1h')
            expect(result.status).toBe(200)

            // @edu match regex check token pattern 
            expect(result.msg.token).toMatch(/Bearer .*/)
        })
    })

    describe('test register user', () => {
        const user = testUtils.randomUser()
        beforeAll(async () => {
            await new User(user).save()
        })
        test('named existed', async () => {
            const newUser = {
                name: user.name,
                email: 'whatever@sam-tech.com',
                password: 'password',
                admin: false,
                note: 'this is note'
            }
            const result = await userService.registerUser(newUser)
            expect(result).toEqual({ status: 400, msg: 'User existed' })
        })
        test('email existed', async () => {
            const newUser = {
                name: 'whatever',
                email: user.email,
                password: 'password',
                admin: false,
                note: 'this is note'
            }
            const result = await userService.registerUser(newUser)
            expect(result).toEqual({ status: 400, msg: 'User existed' })
        })
        test('new user', async () => {
            const newUser = testUtils.randomUser()
            const result = await userService.registerUser(newUser)
            // @edu toMatchObject to check that a JavaScript object matches a subset of the properties of an object
            expect(result.msg).toMatchObject(newUser)
        })
    })

    test('test find all users order by name ascending', async () => {

        // the response list shouble be order as expect
        const users = (await userService.getUserList()).map(x => x.name)
        const checkUsers = (await User.find()).map(x => x.name)
        expect(users.length).toBe(checkUsers.length)
        expect(users).toEqual(testUtils.sortStrArrAsc(checkUsers))
    })

    test('test update user by id', async () => {
        const user = {
            name: 'origin',
            email: 'origin@origin.com',
            password: 'origin',
            admin: false
        }
        const savedUser = await new User(user).save()
        const modifiedUser = {
            name: 'modify',
            email: 'modify@modify.com',
            password: 'modify',
            admin: true
        }

        const updateUser = await userService.updateUser(savedUser.id, modifiedUser)
        expect(JSON.parse(JSON.stringify(updateUser))).toMatchObject(JSON.parse(JSON.stringify(modifiedUser)))

        // check if password encrypted 
        expect(updateUser.password).not.toEqual('modify')

        // without password
        const user2 = (await new User(testUtils.randomUser()).save())
        const userNoPass = {
            name: 'whatever',
            email: 'whatever',
            admin: 'false'
        }
        const udpateUser2 = await userService.updateUser(user2.id, userNoPass)
        expect(JSON.parse(JSON.stringify(udpateUser2)).password).toEqual(JSON.parse(JSON.stringify(user2)).password)
    })

    test('test get receivers, except operator', async () => {
        const users = Array.from({ length: 5 }, () => testUtils.randomUser())
        const savedUsers = await User.insertMany(users)
        const operator = testUtils.randomArr(savedUsers)
        const receivers = await userService.getReceivers(operator)
        const userArr = (await User.find()).filter(x => x.id !== operator.id).map(x => {
            return { receiver: x.id }
        })
        expect(receivers).toEqual(userArr)
    })

    test('test delete user', async () => {
        const savedUser = await new User(testUtils.randomUser()).save()
        expect(await User.findById(savedUser.id)).toEqual(expect.anything())

        // delete it
        await userService.deleteUser(savedUser.id)
        expect(await User.findById(savedUser.id)).not.toEqual(expect.anything())
    })

    test('test batch delete users', async () => {

        // save 10 users
        const userIDs = Array.from({ length: 10 }, () => testUtils.randomObjectId())
        const users = userIDs.map(x => {
            return Object.assign({ _id: x }, testUtils.randomUser())
        })
        await User.insertMany(users)
        expect((await User.find({ _id: { $in: userIDs } })).length).toBe(10)

        // delete users
        // all fakeIDs
        const fakeIDs = Array.from({ length: 10 }, () => testUtils.randomObjectId())
        expect(await userService.batchDeleteUser(fakeIDs)).toEqual(null)

        // include fakeIDs
        const realWithFakeIDs = userIDs.concat(testUtils.randomObjectId())
        expect(await userService.batchDeleteUser(realWithFakeIDs)).toEqual(null)

        // delete real users
        await userService.batchDeleteUser(userIDs)
        expect(await User.find({ _id: { $in: userIDs } })).toEqual([])
    })
})