const date = new Date()
const now = Date.now()
const number = 0.85
const bool = false
const str = 'str'
describe('test expect.any', ()=>{
    test('test start',()=>{
        expect(number).toEqual(expect.any(Number))
        expect(date).toEqual(expect.any(Date))
        expect(now).toEqual(expect.any(Number))
        expect(number).toEqual(expect.any(Number))
        expect(bool).toEqual(expect.any(Boolean))
        expect(str).toEqual(expect.any(String))
        expect(date).toEqual(expect.anything())

    })
})