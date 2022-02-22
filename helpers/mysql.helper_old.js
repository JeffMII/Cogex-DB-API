const mysql = require('mysql')

const info = JSON.parse(process.env.MYSQL_INFO)
var e = { status: 500 }

function connection() {
  return mysql.createConnection({
    host: info.host,
    user: info.user,
    password: info.password,
    database: info.database
  })
}

async function query(sql) {
  try {
    const con = connection()
    con.connect(async error => {
      const promise = new Promise(async () => {
        if (error)
            return await Promise.resolve(err(error))
        
        con.query(sql, async (error, result) => {
          if (error)
            return await Promise.resolve(err(error))
          
          if (Array.isArray(result))
            for (const res of result)
              if (res.news_json !== undefined)
                res.news_json = JSON.parse(res.news_json)
              else break
          
          return await Promise.resolve(succ(result))
        })
        return await Promise.resolve(err('An unknown server error has occurred'))
      })
      const resolved = await promise
      return resolved
    })
  } catch (error) { return err(error) }
}

async function queryResponse({ sql, res }) {
  const result = await query(sql)

  e.result = result
  e.res = res

  if (result?.success) successResponse({ result, res })
  else errorResponse(e)
}

function succ(result) {
  return { result, error: null }
}

function successResponse({ result, res }) {
  res.send(succ(result))
}

function err(error) {
  return { error, result: null }
}

function errorResponse({ status, error, res }) {
  console.trace('errorResponse')
  res.status(status)
  res.send(err(error))
}

function warnResponse({ result, error, res }) {
  console.trace('warnResponse')
  res.status(199)
  res.send({ result, error })
}

module.exports = { query, queryResponse, succ, successResponse, err, errorResponse, warnResponse }