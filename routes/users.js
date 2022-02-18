const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res, next) => {
  const { user_id } = req.query
  const con = connect()
  const sql = `select user_nickname, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_id=${user_id}`
  query({ con, sql, res })
})

router.get('/get/name', (req, res, next) => {
  const { user_nickname } = req.query
  const con = connect()
  const sql = `select user_id, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_nickname='${user_nickname}'`
  query({ con, sql, res })
})

router.post('/insert', (req, res, next) => {
  const { user_nickname, user_password } = req.body
  const con = connect()
  const sql = `insert into users (user_nickname, user_password) values ('${user_nickname}', '${user_password}')`
  query({ con, sql, res })
})

router.post('/update', (req, res, next) => {
  const { user_id, user_password, quiz_time_limit, quiz_question_limit } = req.body
  const user_update_date = Date.now()
  const con = connect()

  let sets = []
  if(user_password !== undefined)
    sets = [...sets, `user_password='${user_password}'`]
  if(quiz_time_limit !== undefined)
    sets = [...sets, `quiz_time_limit=${quiz_time_limit}`]
  if(quiz_question_limit !== undefined)
    sets = [...sets, `quiz_question_limit=${quiz_question_limit}`]
  sets = [...sets, `user_update_date=${user_update_date}`]
  sets = sets.join(', ')

  const sql = `update users set ${sets} where user_id=${user_id}`
  query({ con, sql, res })
})

module.exports = router