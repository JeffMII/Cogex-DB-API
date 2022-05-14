function stringify(data) {

  try { return JSON.stringify(data) } catch {}

  return String(data)
  
  // str = str.replace(/(?<=[^\\])\\{1,}"(?=[^\\])/g, `\\\\"`)
  //           .replace(/(?<![\\])'/g, `\\'`)
  //           .replace(/(?<=[^\\])\\{1,}'(?=[^\\])/g, `\'`)
  //           // .replace(/(?<!\\)\\{1,}(?!\\)/g, '\\')

}

function objectify(obj) {

  try { return parse(obj) } catch {}

  const keys = Object.keys(obj)

  try { obj = keys.map(key => objectify(obj[key])) } catch {}

  return obj

}

function parse(obj) {

  // console.log()
  // console.log()
  // console.log(obj)
  try { obj = JSON.parse(obj) } catch {}
  // console.log(obj)
  // console.log()
  // console.log(Boolean(obj))
  // console.log(Number.parseInt(obj))
  // console.log(Number.parseFloat(obj))
  // console.log(Number(obj))
  // console.log(obj === 'false')
  // console.log()
  // console.log()

  // obj = typeof obj === 'object' ?
  //       objectify(obj) : obj

  obj = (obj === 'true' || obj === 'false') ?
        Boolean(obj) : obj

  obj = !Number.isNaN(Number(obj)) ?
        Number.isFinite(Number(obj)) ?
        Number.isInteger(Number(obj)) ?
        Number.parseInt(obj) :
        Number.parseFloat(obj) :
        Number(obj) :
        obj
  console.log(obj)
  return obj
}

function run() {

  let str = 'Hellow, World!'
  let int = '1'
  let obj = '{ "a": "A", "b": 2 }'
  let arr = '[{ "one": "true", "two": 2, "three": 3 }, { "four": 4, "five": 5, "six": 6 }, { "seven": 7, "eight": 8, "nine": 9 }]'
  let obarr = '[{ "one": { "a": "true", "b": { "a": "A", "b": 2 } }, "two": 2, "three": 3 }, { "a": "A", "b": 2 }, { "four": { "a": "A", "b": 2 }, "five": 5, "six": 6 }, { "seven": 7, "eight": 8, "nine": 9 }]'

  // console.log(objectify(str))
  // console.log(objectify(int))
  // console.log(objectify(obj))
  // console.log(objectify(arr))
  // console.log(objectify(obarr))
  // console.log()
  console.log(parse(str))
  console.log(parse(int))
  console.log(parse(obj))
  console.log(parse(arr))
  console.log(parse(obarr))

}

run()

module.exports = { stringify, objectify, parse }