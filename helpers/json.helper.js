function JSstringify(data) {
  console.log(data)
  let str = typeof data == 'string' ? data : JSON.stringify(data)
  return str.replace(/(?<=[^\\])\\{1,}"(?=[^\\])/g, `\\\\"`)
            .replace(/(?<![\\])'/g, `\\'`)
            .replace(/(?<=[^\\])\\{1,}'(?=[^\\])/g, `\\'`)

}

function JSparse(data) {

  return typeof data == 'string' ? JSON.parse(data) : data
  
}

module.exports = { JSstringify, JSparse }