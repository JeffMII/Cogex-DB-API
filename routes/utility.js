const { Router } = require('express')
const { query } = require('../helpers/mysql.helper.js')

const router = Router()

router.post('/query/database', (req, res) => {

  const { sql } = req.body
  query(sql, res)

})

module.exports = router