const mysql = require('mysql')

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
      console.table(result)
      res.send({ success: true, result: JSON.parse(result) })
      con.end()
    })
  })
}

module.exports = { connect, query }