const { dateFormat } = require('./date.helper');
const { r, l, LOGS } = require('./mysql.helper')

function logWrap(wrapped) {

  return function(signature, handler) {
    
    wrapped.apply(this, [signature, async function() {
      
      const start = dateFormat(new Date(Date.now()))
  
      const transaction_start = `${start}`
  
      const transaction_endpoint = `${signature}`
  
      const wrap = handWrap(handler)
      
      const data = wrap.apply(this, arguments)

      const {
        
        transaction_request,
        transaction_status,
        transaction_error
      
      } = data instanceof Promise ? await data : data
      
      const end = dateFormat(new Date(Date.now()))
  
      const transaction_end = `${end}`

      const { result, error } = await l({

        transaction_start,
        transaction_endpoint,
        transaction_request, 
        transaction_status,
        transaction_error,
        transaction_end

      }, LOGS.TRANSACTION)
      
      if(error) {

        const { res } = arguments

        console.log(error)

        return r({ error, result }, res)

      }

    }])

  }

}

function handWrap(wrapped) {
  
  return async function(req, res) {

    const transaction_request = req.query && Object.keys(req.query).length > 0 ? req.query : req.body && Object.keys(req.body).length > 0 ? req.body : {}

    const result = wrapped.apply(this, [req, res])

    const { error } = result instanceof Promise ? await result : result

    const transaction_status = res.statusCode

    let transaction_error = error ? { 
    
      code: error.code,
      errno: error.errno,
      sqlMessage: error.sqlMessage,
      sqlState: error.sqlState,
      index: error.index,
      sql: error.sql
    
    } : { error: null }

    return { transaction_request, transaction_status, transaction_error }

  }

}

module.exports = { logWrap }