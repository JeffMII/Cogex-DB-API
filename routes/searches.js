const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res) => {

  try {

    const { id } = req.query
    const con = connect()
    const sql = `select (search_json) from searches where search_id=${id}`
    query({ con, sql, res })
  
  } catch(err) {

    e(err, res)

  }
})

router.post('/insert', (req, res) => {

  try {

    const { id, json } = req.body
    const con = connect()
    const sql = `insert into searches (search_json) values ('${JSON.stringify(json)}')`
    query({ con, sql, res })
  
  } catch(err) {

    e(err, res)

  }
})

router.post('/upsert', (req, res) => {

  try {

    const { id, json } = req.body
    const con = connect()
    const sql = `replace into searches (search_id, search_json) values (${id}, '${JSON.stringify(json)}')`
    query({ con, sql, res })
  
  } catch(err) {

    e(err, res)

  }
})

module.exports = router