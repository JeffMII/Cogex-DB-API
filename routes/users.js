const { q, r } = require('../helpers/mysql.helper')
const { logWrap } = require('../helpers/wrap.helper')
const { Router } = require('express')
const crypto = require('crypto')

const router = Router()

const get = router.get
router.get = logWrap(get)

const post = router.post
router.post = logWrap(post)

router.post('/login', (req, res) => {

  const { user_nickname, user_password } = req.body

  const hash = crypto.createHash('sha256').update(user_password).digest('hex')

  const sql = `select user_id, user_email, user_notes, user_creation_date, user_update_date, quiz_question_limit, quiz_time_limit_upper, quiz_time_limit_lower from users where user_nickname='${user_nickname}' and user_password='${hash}'`
  
  return q(sql, res)
  
})

router.get('/get/user/by/id', (req, res) => {

  const { user_id } = req.query
  
  const sql = `select * from users where user_id=${user_id}`
  
  return q(sql, res)

})

router.get('/get/user/by/name', (req, res) => {

  const { user_nickname } = req.query

  const sql = `select * from users where user_nickname='${user_nickname}'`
  
  return q(sql, res)
  
})

router.post('/insert/user', (req, res) => {

  const { user_nickname, user_password, user_email, user_notes } = req.body

  const hash = crypto.createHash('sha256').update(user_password).digest('hex')

  const sql = `insert into users (user_nickname, user_password, user_email, user_notes) values ('${user_nickname}', '${hash}', '${user_email}', '${user_notes}')`

  return q(sql, res)
  
})

router.post('/update/user', async (req, res) => {

  const { user_id, user_nickname, user_password, user_email, user_notes, quiz_question_limit, quiz_time_limit_upper, quiz_time_limit_lower } = req.body

  const user_update_date = new Date(Date.now()).toISOString().replace('T', ' ').replace('Z', '')
  
  let sets = []
  
  if(user_nickname !== undefined)
    sets = [...sets, `user_nickname='${user_nickname}'`]

  if (user_password !== undefined) {

    const hash = crypto.createHash('sha256').update(user_password).digest('hex')
    sets = [...sets, `user_password='${hash}'`]

  }

  if (user_email !== undefined)
    sets = [...sets, `user_email='${user_email}'`]

  if (user_notes !== undefined)
    sets = [...sets, `user_notes='${user_notes}'`]

  if (quiz_question_limit !== undefined)
    sets = [...sets, `quiz_question_limit=${quiz_question_limit}`]
  
  if (quiz_time_limit_upper !== undefined)
    sets = [...sets, `quiz_time_limit_upper=${quiz_time_limit_upper}`]

  if (quiz_time_limit_lower !== undefined)
    sets = [...sets, `quiz_time_limit_lower=${quiz_time_limit_lower}`]

  sets = [...sets, `user_update_date='${user_update_date}'`].join(', ')

  const sql = `update users set ${sets} where user_id=${user_id}`

  return q(sql, res)
  
})

router.get('/get/interests', (req, res) => {

  const { user_id } = req.query

  const sql = `select user_interests.super_category_id, user_interests.sub_category_id, super_categories.super_category, super_categories.super_category_display, sub.sub_category,sub.sub_category_display from user_interests inner join super_categories on user_interests.super_category_id=super_categories.super_category_id left join sub_categories as sub on user_interests.sub_category_id=sub.sub_category_id where user_interests.user_id=${user_id} order by user_interests.super_category_id, user_interests.sub_category_id;`
  
  return q(sql, res)
  
})

router.post('/insert/interests', async (req, res) => {

  const { user_id, interests } = req.body

  let sql = `select * from user_interests where user_id=${user_id}`

  let { result, error } = await q(sql)

  if(error) return r({ error, result }, res)

  if(result?.length > 0) {

    sql = `delete from user_interests where user_id=${user_id}`

    ;({ result, error } = q(sql))

    if(error) return r({ error, result }, res)

  }

  const names = '(user_id, super_category_id, sub_category_id)'
  
  var values = []
  for(const interest of interests)
    values = [...values, `(${user_id}, ${interest.super_category_id}, ${interest.sub_category_id})`]
  values = values.join(', ')

  sql = `insert into user_interests ${names} values ${values}`
  
  return q(sql, res)

})

module.exports = router