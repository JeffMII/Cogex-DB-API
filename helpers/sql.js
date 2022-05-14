const mysql = require('mysql')
const JS = require('./json')
const MysqlError = require('mysql/lib/protocol/constants/errors')
const info = JSON.parse(process.env.MYSQL_INFO)

const LOGS = {

  validate: (value) => {
    console.log(value)
    return Object.values(LOGS).reduce((pv, cv) => pv || cv == value.toLowerCase() , false)

  },
  TRANSACTION: 'transaction_logs',
  ANALYTICS: 'analytics_logs',
  MISCELLANEOUS: 'miscellaneous_logs'

}

function connection() {

  return mysql.createConnection({

    host: info.host,
    user: info.user,
    password: info.password,
    database: info.database

  })

}

async function q(sql, res) {

  const con = connection()
  
  con.connect()
  
  const promise = new Promise((resolve, reject) => {
    try {

      con.query(sql, async (error, result) => {
        
        if(error) {
          
          reject(e(error, res))
          return
  
        } else if(Array.isArray(result))
          for(const r of result)
            if(r.news_json)
              r.news_json = JS.parse(r.news_json)
            else break

        resolve(s(result, res))

      })

    } catch(err) { reject(e(err, res)) }

  })

  let content
  
  try { return await promise }
  catch(err) { return e(err) }
  finally { con.end() }

}

function s(result, res) {

  const msg = { result: result, error: null }

  if(res)
    res.send(msg)

  return msg

}

function e(error, res) {

  try {

    error = JS.parse(error)

  } catch {

    error = typeof error === 'string' ? new Error(error) : error

  }

  // let err = typeof error === 'string' ? new Error(error) : error

  error = JS.objectify(error)

  const msg = { error, result: null }

  if(res) {

    res.status(500)
    res.send(msg)
  
  }
  
  return msg

}

async function l(log, table) {

  if(!LOGS.validate(table))
    return e(`Unknown log table ${table}`)

  const keys = Object.keys(log)

  let names = []
  let values = []

  loop: for(const key of keys) {

    if(!log[key]) continue loop

    handle: switch(key) {

      case undefined | null:

        return e('A transaction log entry key was undefined while building the sql query')

      default:

        values = [...values, `${log[key]}`]
        break handle

    }

    names = [...names, key]

  }

  const sql = `insert into transaction_logs (${names.join(', ')}) values (${values.join(', ')})`

  return q(sql)

}

function run() {

  const strErr = new Error('New error')
  const appErr = new SyntaxError('({ a, b, c } = x)')
  const sqlErr = new Error(MysqlError[1635])

  console.log(e(JS.objectify(strErr)))
  console.log(e(JS.objectify(sqlErr)))
  console.log(e(JS.objectify(appErr)))

}

run()

module.exports = { q, s, e, l, LOGS }