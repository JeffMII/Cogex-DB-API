const mysql = require('mysql')
const { response } = require('../app')

const info = JSON.parse(process.env.MYSQL_INFO)

function connect() {
  return mysql.createConnection({
    host: info.host,
    user: info.user,
    password: info.password,
    database: info.database
  })
}

function query({ con, sql, res }) {
  console.log(sql)
  try {
    con.connect(err => {
      if (err) {
        res.status(500)
        res.send({ success: false, error: err })
        return
      }
      console.log('Connected...')
      con.query(sql, (err, result) => {
        if (err) {
          res.status(500)
          res.send({ success: false, error: err })
          return
        }
        
        if(Array.isArray(result))
          for(const res of result)
            if(res.news_json !== undefined)
              res.news_json = JSON.parse(res.news_json)
            else break
        
        res.send({ success: true, result })
        con.end()
      })
    })
  } catch(err) {
    res.status(500)
    res.send({ success: false, error: err })
  }
}

module.exports = { connect, query }