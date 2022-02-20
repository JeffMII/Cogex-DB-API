const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const HTMLParser = require('node-html-parser')
const { response } = require('../app')

const router = Router()

router.get('/get/news', (req, res, next) => {
  const { news_id } = req.query
  const con = connect()
  const sql = `select * from news where news_id='${news_id}'`
  query({ con, sql, res })
})

router.get('/get/news/by/user', (req, res, next) => {
  const { user_id } = req.query
  const con = connect()
  const sql = `select * from news left join user_news on news.news_id=user_news.news_id and user_news.user_id=${user_id}`
  query({ con, sql, res })
})

router.post('/insert/news', (req, res, next) => {
  const { news_id, news_json } = req.body

  if(news_json.contents === undefined) {
    res.status(404)
    res.send({ success: false, error: 'Body must contain news_id and news_json. Also, news_json must contain news_json.contents. Use the contents extractor before attempting insert.' })
    return
  }
  
  const con = connect()
  const sql = `insert into news (news_id, news_json) values ('${news_id}', '${JSON.stringify(news_json)}')`
  query({ con, sql, res })
})

router.post('/insert/user/news', (req, res, next) => {
  const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  const con = connect()

  let names = 'user_id, news_id'
  let values = `${user_id}, '${news_id}'`
  if(was_read !== undefined) {
    names += ', was_read'
    values += `, ${was_read}`
  }
  if(is_bookmarked !== undefined) {
    names += ', is_bookmarked'
    values += `, ${is_bookmarked}`
  }
  if(has_recommended !== undefined) {
    names += ', has_recommended'
    values += `, ${has_recommended}`
  }

  const sql = `insert into user_news (${names}) values (${values})`
  query({ con, sql, res })
})

router.post('/update/user', (req, res, next) => {
  const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  const con = connect()

  let sets = []
  if(was_read !== undefined)
    sets = [...sets, `was_read=${was_read}`]
  if(is_bookmarked !== undefined)
    sets = [...sets, `is_bookmarked=${is_bookmarked}`]
  if(has_recommended !== undefined)
    sets = [...sets, `has_recommended=${has_recommended}`]
  sets = sets.join(', ')

  const sql = `update user_news set ${sets} where user_id=${user_id} and news_id='${news_id}'`
  query({ con, sql, res })
})

router.post('/extract/contents', (req, res, next) => {
  const { news_json } = req.body
  const url = news_json.newsSearchUrl
  news_json.contents = []
  fetch(url, { method: 'GET' })
  .then(res => res.text())
  .then(txt => {
    const root = HTMLParser.parse(txt)
    const sites = root.querySelectorAll('a[data-author*=yahoo i]')

    for(const site of sites) {
      const url = site.attributes.href
      fetch(url, { method: 'GET' })
      .then(res => res.text())
      .then(txt => {
        const root = HTMLParser.parse(txt)
        const content = root.querySelectorAll(`div[class=caas-body]>p`)
        let text = []
        for(let i = 0; i < content.length; i++)
          text = [...text, content[i].rawText.replaceAll('&quot;', '')
                                              .replaceAll('— ', '')
                                              .replaceAll('&#39;', '\'')
                                              .replaceAll('&amp;', '&')
                                              .replaceAll('&#8217;', '\'')]

        news_json.content = [...news_json.content, { source: site.attributes.href, text }]
      })
    }

    res.send({ success: true, result: news_json, error: null })
  })
})
  
module.exports = router