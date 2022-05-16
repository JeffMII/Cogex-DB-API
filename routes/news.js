const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { q, e, s } = require('../helpers/mysql.helper')
const { logWrap } = require('../helpers/wrap.helper')
const { Router } = require('express')
const crypto = require('crypto')

const router = Router()

const get = router.get
router.get = logWrap(get)

const post = router.post
router.post = logWrap(post)

async function getNlpURL() {
  
  const sql = `select app_setting_json from app_settings where app_setting_id='nlpURL'`
  
  const { result } = await q(sql)
  
  if(result?.length > 0)
    return JSON.parse(result[0].app_setting_json).nlpURL
    
  return null

}

router.get('/get/Questgen/baseURL', (req, res) => {

  return s(getNlpURL(), res)

})

router.post('/set/Questgen/baseURL', (req, res) => {

  const { url } = req.body

  if(!url) return e('Request body must include url', res)
  
  else {
  
    const sql = `replace into app_settings (app_setting_id, app_setting_json) values ('nlpURL', '{ "nlpURL": "${url}" }')`
    return q(sql, res)
  
  }
})

/**
 * News Endpoints
 */ 

// Get news data
router.get('/get/news', (req, res) => {

  const { news_id } = req.query
  const sql = `select * from news where news_id='${news_id}'`
  return q(sql, res)

})

// Insert new news data
router.post('/insert/news', (req, res) => {

  try {

    const { news_id, news_json } = req.body
    const sql = `insert into news (news_id, news_json) values ('${news_id}', '${news_json.replace(/\\+/g, '\\')}')`
    return q(sql, res)

  } catch(err) {

    return e(err, res)
  
  }
})

/**
 * News Questions Endpoints
 */

router.get('/get/news/questions', (req, res) => {

  try{
    
    const { news_id } = req.query
    const sql = `select * from news_questions where news_id='${news_id}'`
    return q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }

})

/**
 * User News Endpoints
 */

// Get news related to specified user
router.get('/get/user/news', (req, res) => {

  try {

    const { user_id } = req.query
    const sql = `select * from user_news un left join news n on un.news_id=n.news_id where un.user_id=${user_id}`
    return q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }

})

// Insert new relation between specified user and news
router.post('/insert/user/news', async (req, res) => {

  try{
    
      const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
      
      let sql = `select * from user_news where user_id=${user_id} and news_id='${news_id}'`
      const { result } = await q(sql)
    
      if(result?.length > 0)
        return e('Duplicate', res)

      const hash = crypto.createHash('sha256').update(`${user_id}${news_id}`).digest('hex')
    
      let names = ['user_news_id', 'user_id', 'news_id']
      let values = [`'${hash}'`, `${user_id}`, `'${news_id}'`]
    
      if (was_read !== undefined) {
        names = [...names, 'was_read']
        values = [...values, `${was_read}`]
      }
      
      if (is_bookmarked !== undefined) {
        names = [...names, 'is_bookmarked']
        values = [...values, `${is_bookmarked}`]
      }
      
      if (has_recommended !== undefined) {
        names = [...names, 'has_recommended']
        values = [...values, `${has_recommended}`]
      }
    
      names = names.join(', ')
      values = values.join(', ')
    
      sql = `insert into user_news (${names}) values (${values})`
      return q(sql, res)

  } catch(err) {

    return e(err, res)

  }

})

// Update relation between specified user and news
router.post('/update/user/news', async (req, res) => {

  try{
    
    var { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  
    let sql = `select (was_read) from user_news where user_id=${user_id} and news_id='${news_id}'`
    const user_news = await q(sql)
  
    let sets = []
  
    if (was_read !== undefined)
      sets = [...sets, `was_read=${was_read}`]
  
    if (is_bookmarked !== undefined)
      sets = [...sets, `is_bookmarked=${is_bookmarked}`]
  
    if (has_recommended !== undefined)
      sets = [...sets, `has_recommended=${has_recommended}`]
  
    sets = sets.join(', ')
  
    sql = `update user_news set ${sets} where user_id=${user_id} and news_id='${news_id}'`
    const update = await q(sql)
  
    if(update?.result?.changedRows == 1 && user_news?.result[0]?.was_read != was_read && was_read == true) {
      
      const url = `${await getNlpURL()}/generate/news/multiple-choice-questions`
  
      const result = await (await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ news_id }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })).json()
      
      if(result)
        return s(result, res)

      return e('An unknown error occurred while initiating question generation', res)
  
    }
    
    return s(update, res)
    
  } catch(err) {

    return e(err, res)

  }

})

module.exports = router