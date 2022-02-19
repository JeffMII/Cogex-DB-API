const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res, next) => {
  const con = connect()
  const sql = `select sup.super_category_id, sup.super_category, sup.super_category_display, sub.sub_category_id, sub.sub_category, sub.sub_category_display from cogex.super_categories sup left join cogex.sub_categories sub on sup.super_category_id=sub.super_category_id order by sup.super_category_id`
  query({ con, sql, res })
})

module.exports = router