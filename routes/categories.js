const { Router } = require('express')
const { connect, query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res, next) => {
  const con = connect()
  const sql = `select * from cogex.super_categories left join sub_categories on super_categories.super_category_id=sub_categories.super_category_id order by super_categories.super_category_id`
  query({ con, sql, res })
})

module.exports = router