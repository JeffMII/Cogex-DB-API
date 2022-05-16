const mysql = require('mysql')

const info = JSON.parse(process.env.MYSQL_INFO)

const LOGS = {
  
  validate: (value) => {
    
    return Object.values(LOGS).reduce((pv, cv) => {

      if(pv) return pv
      
      if(cv == value.toLowerCase()) return true
      
      return false

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

function q(sql, res) {

  sql = sql.replace(/(?<=[A-Za-z])\'(?=[A-Za-z])/g, '@')
           .replace(/\\+n/g, '')
           .replace(/\\+/g, '/')
  
  //  .replace(/((?<=["][^"]+[\])}:,\\\[{(:, ]?)\'(?=[^\])}:,\\\[{(:, ][^"]+["]))|((?<=["][^"]+[^\])}:,\\\[{(:, ][\])}:,\\\[{(:, ]?)\'(?=[\])}:,\\\[{(:, ]?[^"]+["]))/g, '@')
  
  const con = connection()
  
  return new Promise(resolve => {
    
    try {

      con.connect()

      con.query(sql, (error, result) => {
        
        if(error) {
          
          resolve(e(error, res)) ;return
  
        }
        
        if(Array.isArray(result))
          for(const r of result)
            if(r.news_json)
              r.news_json = JSON.parse(r.news_json)
            else break
  
        resolve(s(result, res))

      })

    } catch(err) { resolve(e(err, res)) } finally { con.end() }

  })

}

async function s(result, res) {

  result instanceof Promise ? await result : result

  return r({ result, error: null }, res)

}

async function e(error, res) {

  error = error instanceof Promise ? await error : error
  error = typeof error == 'string' ? new Error(error) : error

  return r({ error: {
    
    code: error.code ? error.code : error.name ? error.name : 'None',
    errno: error.errno ? error.errno : -1,
    sqlMessage: error.sqlMessage ? error.sqlMessage : error.message ? error.message : 'None',
    sqlState: error.sqlState ? error.sqlState : error.stack ? error.stack : 'None',
    index: error.index ? error.index : -1,
    sql: error.sql ? error.sql : 'None'
  
  }, result: null }, res)

}

function r({ result, error }, res) {

  if(res) {

    res.status(result ? 200 : error?.status ? error.status : 500)
    res.send(result ? { result, error } : { error, result })

  }

  return { result, error }

}

function l(log, table) {

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

module.exports = { q, s, e, r, l, LOGS }