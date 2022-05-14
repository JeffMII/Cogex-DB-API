const { Router } = require('express')
const { q, e } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', async (req, res) => {

  try {

    const { id } = req.query
    const con = connect()
    const sql = `select (search_json) from searches where search_id=${id}`
    return await q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }
  
})

router.post('/insert', (req, res) => {

  try {

    const { id, json } = req.body
    const con = connect()
    const sql = `insert into searches (search_json) values ('${JSON.stringify(json)}')`
    q({ con, sql, res })
  
  } catch(err) {

    e(err, res)

  }
})

router.post('/upsert', (req, res) => {

  try {

    const { id, json } = req.body
    const con = connect()
    const sql = `replace into searches (search_id, search_json) values (${id}, '${JSON.stringify(json)}')`
    q({ con, sql, res })
  
  } catch(err) {

    e(err, res)

  }
})

module.exports = router