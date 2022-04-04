const mysql = require('mysql')

const info = JSON.parse(process.env.MYSQL_INFO)

function connection() {

  return mysql.createConnection({

    host: info.host,
    user: info.user,
    password: info.password,
    database: info.database

  })
}

async function query(sql, res) {

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

  try {
    content = await promise
  } catch(err) {
    content = err
  }

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

  console.log('error')
  const msg = { error: error, result: null }

  if(res) {

    res.status(500)
    res.send(msg)
  
  }
  console.log(msg)
  return msg

}

module.exports = { query, s, e }