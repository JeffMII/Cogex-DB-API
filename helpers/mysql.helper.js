const mysql = require('mysql')

const info = JSON.parse(process.env.MYSQL_INFO)

const LOGS = {
  
  validate: (value) => {
    
    return Object.values(LOGS).reduce((pv, cv) => {

      if(pv) return pv
      else if(cv == value.toLowerCase()) return true
      else return false

    }, false)

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
              r.news_json = JSON.parse(r.news_json)
            else break
  
        resolve(s(result, res))

      })

    } catch(err) { reject(e(err, res)) }

  })

  let content

  try { content = await promise }
  catch(err) { content = e(err) }

  con.end()

  return content

}

function s(result, res) {

  const msg = { result: result, error: null }

  if(res)
    res.send(msg)

  return msg

}

function e(error, res) {

  error = typeof error == 'string' ? new Error(error) : error

  const msg = { error: error, result: null }

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

  return await q(sql)

}

module.exports = { q, s, e, l, LOGS }