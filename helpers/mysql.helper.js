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

async function query({ sql, res }) {
  const con = connection()
  try {
    con.connect(err => {
      if(err) {
        res.status(500)
        res.send({ error: err, result: null })
      }
      con.query(sql, (error, result) => {
          if (Array.isArray(result))
            for (const res of result)
              if (res.news_json !== undefined)
                res.news_json = JSON.parse(res.news_json)
              else break
          res.send({ result, error: null })
        })
      })
  } catch (err) {
    res.status(500)
    res.send({ error: err, result: null})
  }

  // try {
  //   const con = connection()
  //   con.connect(async error => {
  //     const promise = new Promise(async () => {
  //       if (error)
  //           return await Promise.resolve(err(error))
        
  //       con.query(sql, async (error, result) => {
  //         if (error)
  //           return await Promise.resolve(err(error))
          
  //         if (Array.isArray(result))
  //           for (const res of result)
  //             if (res.news_json !== undefined)
  //               res.news_json = JSON.parse(res.news_json)
  //             else break
          
  //       })
  //     })
  //   })
  // } catch (error) { return err(error) }
}

module.exports = { query }