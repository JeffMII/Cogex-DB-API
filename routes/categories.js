const { q, e } = require('../helpers/sql')
const { logWrap } = require('../helpers/log')
const { Router } = require('express')

const router = Router()

const get = router.get
router.get = logWrap(get)

const post = router.post
router.post = logWrap(post)

router.get('/get', async (req, res) => {

  try {
    
    const sql = `select sup.super_category_id, sup.super_category, sup.super_category_display, sub.sub_category_id, sub.sub_category, sub.sub_category_display from super_categories sup left join sub_categories sub on sup.super_category_id=sub.super_category_id order by sup.super_category_id`
    return await q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }
})

module.exports = router