const { Router } = require('express')
const { query, queryResponse, errorResponse, warnResponse, successResponse } = require('../helpers/mysql.helper_old.js')
const crypto = require('crypto')

const router = Router()

var error = { status: 400 }
const nil = [undefined, null]

router.post('/login', (req, res) => {
  const { user_nickname, user_password } = req.body

  error.error = 'Body requires user_nickname and user_password',
  error.res = res

  if (user_nickname === undefined || user_password === undefined) {
    errorResponse(error)
    return
  }

  const hash = crypto.createHash('sha256').update(user_password).digest('hex')

  const sql = `select user_id, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_nickname='${user_nickname}' and user_password='${hash}'`
  queryResponse(sql, res)
})

router.get('/get/user/by/id', (req, res) => {
  const { user_id } = req.query

  error.error = 'Query parameters require user_id',
  error.res = res

  if (user_id === undefined) {
    errorResponse(error)
    return
  }

  const sql = `select user_nickname, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_id=${user_id}`
  queryResponse(sql, res)
})

router.get('/get/user/by/name', (req, res) => {
  const { user_nickname } = req.query

  error.error = 'Query parameters require user_nickname',
  error.res = res

  if (user_nickname === undefined) {
    errorResponse(error)
    return
  }

  const sql = `select user_id, user_creation_date, user_update_date, quiz_time_limit, quiz_question_limit from users where user_nickname='${user_nickname}'`
  queryResponse(sql, res)
})

router.post('/insert/user', (req, res) => {
  const { user_nickname, user_password } = req.body

  error.error = 'Body requires user_nickname and user_password'
  error.res = res
  
  if (user_nickname === undefined || user_password === undefined) {
    errorResponse(error)
    return
  }

  const hash = crypto.createHash('sha256').update(user_password).digest('hex')

  const sql = `insert into users (user_nickname, user_password) values ('${user_nickname}', '${hash}')`
  queryResponse(sql, res)
})

router.post('/update/user', (req, res) => {
  const { user_id, user_password, quiz_time_limit, quiz_question_limit } = req.body

  error.error = 'Body requires user_id'
  error.res = res

  if (user_id === undefined) {
    errorResponse(error)
    return
  }

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
  queryResponse(sql, res)
})

router.post('/get/interests', (req, res) => {
  const { user_id } = req.body

  error.error = 'Query parameters require user_id'
  error.res = res

  if (user_id === undefined) {
    errorResponse(error)
    return
  }

  const sql = `select u.user_id, u.user_nickname, sup.*, sub.* from user_interests ui inner join super_categories sup on ui.super_category_id=sup.super_category_id left join sub_categories sub on ui.sub_category_id=sub.sub_category_id inner join users u on ui.user_id=u.user_id and u.user_id=27 order by sup.super_category_id`
  queryResponse(sql, res)
})

router.post('/insert/interests', async (req, res) => {

  console.log('Entering request...')
  const { user_id, interests } = req.body
  
  error.error = 'Body requires { user_id, interests: [{ super_category_id, sub_category_id }, { super_category_id }, ... }] }'
  error.res = res
  
  if (user_id === undefined || interests?.length === 0)
    return errorResponse(error)
  
  let results = []
  let errors = ''
  
  for (const interest of interests) {
    console.log('...Beginning loop')
    
    if (interest.super_category_id === undefined)
      return errorResponse(error)
    
    let sql = `select * from user_interests ui where ui.user_id=${user_id} and ui.super_category_id=${interest.super_category_id}`
    
    if (!(nil.indexOf(interest.sub_category_id) + 1))
      sql += ` and ui.sub_category_id=${interest.sub_category_id}`
    
    console.log(`...Awaiting query: ${sql}`)
    let result = await query(sql)
    console.log(`...Query complete: ${result}`)

    if (!(result?.length === 0)) {
      if (errors.length > 0) errors += '; '
      
      errors += `The user interest relation all ready exists > { user_id: ${user_id}, super_category_id: ${interest.super_category_id}`
      
      if (!(nil.indexOf(interest.sub_category_id) + 1))
        errors += ` sub_category_id: ${interest.sub_category_id}`

      continue
    }

    let names = 'user_id, super_category_id'
    let values = `${user_id}, ${interest.super_category_id}`
    
    if (!(nil.indexOf(interest.sub_category_id) + 1)) {
      names += ', sub_category_id'
      values += `, ${interest.sub_category_id}`
    }

    sql = `insert into user_interests (${names}) values (${values})`
    result = await query(sql)
    
    if (result.error)
      errors += `; SQLError: ${result.error}`
    else
      results = [...results, result.result]
  }

  error.error = errors
  error.res = res

  if (errors.length > 0 && results.length > 0)
    warnResponse({ result: results, error: errors, res })
  else if (errors.length > 0)
    errorResponse(error)
  else if (results.length > 0)
    successResponse({ result: results, res })
  else errorResponse({
    status: 500,
    error: 'An unknown server error occurred',
    res
  })
  
  console.log('End iteration...')
})

module.exports = router