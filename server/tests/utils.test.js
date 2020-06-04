const utils = require('../utils/utils')
describe('test utils', () => {
    
    // test isEmpty
    test('isEmpty', () => {
        let tmp = undefined
        expect(utils.isEmpty(tmp)).toBe(true)
        tmp = null
        expect(utils.isEmpty(tmp)).toBe(true)
        tmp = []
        expect(utils.isEmpty(tmp)).toBe(true)
    })

    // test encrypt decrypt
    test('encrypt & decrypt', async () => {
        const data = 'admin'
        const encryption = await utils.encrypt(data)
        expect(encryption).not.toBe(data)
        expect(await utils.decrypt(data, encryption)).toBe(true)
    })

    // genToken
    test('genToken', async () => {
        const obj = { 'name': 'sam' }
        const token = await utils.genToken(obj, '12h')
        expect(token).not.toEqual(obj)
    })
})