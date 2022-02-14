const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res, next) => {
  const { news_id } = req.query
  const con = connect()
  const sql = `select * from news where news_id='${news_id}'`
  query({ con, sql, res })
})

router.get('/get/user', (req, res, next) => {
  const { user_id } = req.query
  const con = connect()
  const sql = `select * from news left join user_news on news.news_id=user_news.news_id and user_news.user_id=${user_id}`
  query({ con, sql, res })
})

router.post('/insert', (req, res, next) => {
  const { news_id, news_json } = req.body
  const con = connect()
  const sql = `insert into news (news_id, news_json) values ('${news_id}', '${JSON.stringify(news_json)}')`
  query({ con, sql, res })
})

router.post('/insert/user', (req, res, next) => {
  const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  const con = connect()
  const sql = `insert into user_news (user_id, news_id, was_read, is_bookmarked, has_recommended) values (${user_id}, '${news_id}', ${was_read}, ${is_bookmarked}, ${has_recommended})`
  query({ con, sql, res })
})

router.post('/update/user', (req, res, next) => {
  const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  const con = connect()
  const sql = `update user_news set was_read=${was_read}, is_bookmarked=${is_bookmarked}, has_recommended=${has_recommended} where user_id=${user_id} and news_id='${news_id}'`
  query({ con, sql, res })
})

module.exports = router