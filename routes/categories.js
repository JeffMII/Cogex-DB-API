const { Router } = require('express')
const { query } = require('../helpers/mysql.helper')

const router = Router()

router.get('/get', (req, res) => {

  try {
    
    const sql = `select sup.super_category_id, sup.super_category, sup.super_category_display, sub.sub_category_id, sub.sub_category, sub.sub_category_display from super_categories sup left join sub_categories sub on sup.super_category_id=sub.super_category_id order by sup.super_category_id`
    query(sql, res)
  
  } catch(err) {

    e(err, res)

  }
})

module.exports = router