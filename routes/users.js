const { Router } = require('express')
const { query } = require('../helpers/mysql.helper.js')
const crypto = require('crypto')

const router = Router()

router.post('/login', (req, res, next) => {
  const { user_nickname, user_password } = req.body

  const hash = crypto.createHash('sha256').update(user_password).digest('hex')

  const sql = `select user_id, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_nickname='${user_nickname}' and user_password='${hash}'`
  query({ sql, res })
})

router.get('/get/user/by/id', (req, res, next) => {
  const { user_id } = req.query

  const sql = `select user_nickname, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_id=${user_id}`
  query({ sql, res })
})

router.get('/get/user/by/name', (req, res, next) => {
  const { user_nickname } = req.query

  const sql = `select user_id, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_nickname='${user_nickname}'`
  query({ sql, res })
})

router.post('/insert/user', (req, res, next) => {
  const { user_nickname, user_password } = req.body

  const hash = crypto.createHash('sha256').update(user_password).digest('hex')

  const sql = `insert into users (user_nickname, user_password) values ('${user_nickname}', '${hash}')`
  query({ sql, res })
})

router.post('/update/user', (req, res, next) => {
  const { user_id, user_password, quiz_time_limit, quiz_question_limit } = req.body

  const user_update_date = new Date(Date.now()).toISOString().replace('T', ' ').replace('Z', '')
  
  let sets = []
  if (user_password !== undefined)
    sets = [...sets, `user_password='${user_password}'`]
  if (quiz_time_limit !== undefined)
    sets = [...sets, `quiz_time_limit=${quiz_time_limit}`]
  if (quiz_question_limit !== undefined)
    sets = [...sets, `quiz_question_limit=${quiz_question_limit}`]
  sets = [...sets, `user_update_date='${user_update_date}'`]
  sets = sets.join(', ')

  const sql = `update users set ${sets} where user_id=${user_id}`
  query({ sql, res })
})

router.get('/get/interests', (req, res, next) => {
  const { user_id } = req.query
  const sql = `select user_interests.super_category_id, user_interests.sub_category_id, super_categories.super_category, super_categories.super_category_display, sub.sub_category,sub.sub_category_display from user_interests inner join super_categories on user_interests.super_category_id=super_categories.super_category_id left join sub_categories as sub on user_interests.sub_category_id=sub.sub_category_id where user_interests.user_id=${user_id} order by user_interests.super_category_id,user_interests.sub_category_id;`
  query({ sql, res })
})

router.post('/insert/interests', async (req, res, next) => {
  const { user_id, interests } = req.body
  let names = '(user_id, super_category_id, sub_category_id)'
  
  var values = []
  for(const interest of interests) {
    values = [...values, `(${user_id}, ${interest.super_category_id}, ${interest.sub_category_id})`]
  }
  values = values.join(', ')

  let sql = `insert into user_interests ${names} values ${values}`
  query({ sql, res })
})

module.exports = router