const { Router } = require('express')
const { query, e } = require('../helpers/mysql.helper.js')

const router = Router()

router.post('/query/database', (req, res) => {
  
  try {

    const { sql } = req.body
    query(sql, res)
  
  } catch(err) {

    e(err, res)

  }
})

module.exports = router