const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res, next) => {
  const { user } = req.query
  const con = connect()
  const sql = `select (
      quiz_id,
      complete_time,
      start_time,
      score
    ) from quizzes where user_id=${user}`
  query({ con, sql, res })
})

router.post('/insert', (req, res, next) => {
  const { user } = req.body
  const con = connect()
  const sql = `insert into quizzes (user_id) values (${user})`
  query({ con, sql, res })
})

router.post('/upsert', (req, res, next) => {
  const { id, user } = req.body
  const con = connect()
  const sql = `insert into quizzes (user_id) values (${user})`
  query({ con, sql, res })
})

module.exports = router