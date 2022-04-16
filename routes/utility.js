const { q, e } = require('../helpers/mysql.helper')
const { logWrap } = require('../helpers/log.helper')
const { Router } = require('express')

const router = Router()

const get = router.get
router.get = logWrap(get)

const post = router.post
router.post = logWrap(post)

router.post('/query/database', async (req, res) => {
  
  try {

    const { sql } = req.body
    return await q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }
})

module.exports = router