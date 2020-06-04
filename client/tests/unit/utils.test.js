import { groupby, getTimeGapInfo, validateTime, getFmtVal,getFmtPrjCode, isEmpty } from '@/utils/utils'

describe('test util functions', () => {
  test('test groupby', () => {
    const rawData = [{ name: "samtech", skill: "js" }, { name: "samtech", skill: "shell" }, { name: "jctech", skill: "ps" }]
    const expectedData = { samtech: [{ name: "samtech", skill: "js" }, { name: "samtech", skill: "shell" }], jctech: [{ name: "jctech", skill: "ps" }] }
    expect(groupby(rawData, 'name')).toEqual(expectedData)
  })
  test('test get time gap info', () => {
    expect(getTimeGapInfo('2020-01-10 10:10:00', '2020-01-10 10:11:00')).toBe('1 minute ago')
    expect(getTimeGapInfo('2020-01-10 10:10:00', '2020-01-10 10:12:01')).toBe('2 minutes ago')
    expect(getTimeGapInfo('2020-01-10 00:00:00', '2020-01-10 01:00:00')).toBe('1 hour ago')
    expect(getTimeGapInfo('2020-01-10 00:00:00', '2020-01-10 02:59:00')).toBe('2 hours ago')
    expect(getTimeGapInfo('2020-01-10 00:00:00', '2020-01-11 02:59:00')).toBe('1 day ago')
    expect(getTimeGapInfo('2020-01-10 00:00:00', '2020-01-12 02:59:00')).toBe('2 days ago')
    expect(getTimeGapInfo(Date.now() - (1000 * 60 * 60 * 24 * 1.5))).toBe('1 day ago')
  })
  test('test moment', () => {
    const time1 = "2020-04-29T15:00:00.000Z"
    const time2 = "it's a string"
    const time3 = 0.5
    const time4 = true
    const time5 = "2020-04-29"
    expect(validateTime(time1)).toBe(true)
    expect(validateTime(time2)).toBe(false)
    expect(validateTime(time3)).toBe(false)
    expect(validateTime(time4)).toBe(false)
    expect(validateTime(time5)).toBe(true)
  }),
  test('test get formatted value',() =>{
    const time1 = "2020-04-29T00:00:00.000Z"
    const time2 = "2020-04-02T00:00:00.000Z"
    expect(getFmtVal(time1)).toBe('2020-04-29')
    expect(getFmtVal(time2)).toBe('2020-04-02')
    expect(getFmtVal(time1,"/")).toBe('2020/04/29')

    const digit = "85.6"
    expect(getFmtVal(digit)).toBe('86%')
    expect(getFmtVal(null)).toBe(null)
    expect(getFmtVal(undefined)).toBe(undefined)
    expect(getFmtVal(false)).toBe(false)
    expect(getFmtVal(true)).toBe(true)
    expect(getFmtVal(0)).toBe('0%')
  }),
  test('get project code', ()=>{
    const log = {
      project_id: {
        _id: "1",
        project_code: "5678"
      },
      project_code: "1234"
    }
    expect(getFmtPrjCode(log,true)).toBe("1234")
    expect(getFmtPrjCode(log)).toBe("5678")
  })
  test('is empty',() => {
    expect(isEmpty(0)).toBe(false)
  })
})