const { Router } = require('express')
const { query } = require('../helpers/mysql.helper.js')
// const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
// const HTMLParser = require('node-html-parser')

const router = Router()

/**
 * News Endpoints
 */

// Get news data
router.get('/get/news', (req, res, next) => {
  const { news_id } = req.query
  
  const sql = `select * from news where news_id='${news_id}'`
  query({ sql, res })
})

// Insert new news data
router.post('/insert/news', (req, res, next) => {
  const { news_id, news_json } = req.body

  const sql = `insert into news (news_id, news_json) values ('${news_id}', '${JSON.stringify(news_json)}')`
  query({ sql, res })
})

/**
 * User News Endpoints
 */

// Get news related to specified user
router.get('/get/user/news', (req, res, next) => {
  const { user_id } = req.query

  const sql = `select * from user_news un left join news n on un.news_id=n.news_id where un.user_id=${user_id}`
  query({ sql, res })
})

// Insert new relation between specified user and news
router.post('/insert/user/news', (req, res, next) => {
  const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  
  let names = 'user_id, news_id'
  let values = `${user_id}, '${news_id}'`
  if (was_read !== undefined) {
    names += ', was_read'
    values += `, ${was_read}`
  }
  if (is_bookmarked !== undefined) {
    names += ', is_bookmarked'
    values += `, ${is_bookmarked}`
  }
  if (has_recommended !== undefined) {
    names += ', has_recommended'
    values += `, ${has_recommended}`
  }

  const sql = `insert into user_news (${names}) values (${values})`
  query({ sql, res })
})

// Update relation between specified user and news
router.post('/update/user/news', (req, res, next) => {
  const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body

  let sets = []
  if (was_read !== undefined)
    sets = [...sets, `was_read=${was_read}`]
  if (is_bookmarked !== undefined)
    sets = [...sets, `is_bookmarked=${is_bookmarked}`]
  if (has_recommended !== undefined)
    sets = [...sets, `has_recommended=${has_recommended}`]
  sets = sets.join(', ')

  const sql = `update user_news set ${sets} where user_id=${user_id} and news_id='${news_id}'`
  query({ sql, res })
})

/**
 * Utility Endpoints
 */

// Extract news article content from Yahoo news sources
// router.post('/extract/contents/yahoo', async (req, res, next) => {
//   const { news_json } = req.body

//   const url = news_json.newsSearchUrl
//   const response = await fetch(url, { method: 'GET' })
//   const raw = await response.text()
//   const root = HTMLParser.parse(raw)
//   const sites = root.querySelectorAll('a[data-author*=yahoo i]')

//   const load = sites.map(async (site) => {
//     const url = site.attributes.href
//     const response = await fetch(url, { method: 'GET' })
//     const raw = await response.text()
//     const root = HTMLParser.parse(raw)
//     const contents = root.querySelectorAll(`div[class=caas-body]>p`)

//     const text = contents.reduce((result, content) => {
//       const c = content.rawText.replaceAll('&quot;', '')
//                            .replaceAll('— ', '')
//                            .replaceAll('&#39;', '\'')
//                            .replaceAll('&amp;', '&')
//                            .replaceAll('&#8217;', '\'')
//       if (c.length > 20) result = [...result, c]
//       return result
//     }, [])

//     return { url, text }
//   })
//   news_json.contents = await Promise.all(load)

//   successResponse({ result: news_json, res })
// })

module.exports = router