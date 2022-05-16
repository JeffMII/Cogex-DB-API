const { dateFormat } = require('./date.helper');
const { l, LOGS } = require('./mysql.helper')

function logWrap(wrapped) {

  return function(signature, handler) {
    
    wrapped.apply(this, [signature, async function() {
      
      const start = dateFormat(new Date(Date.now()))
  
      const transaction_start = `'${start}'`
  
      const transaction_endpoint = `'${signature}'`
  
      const wrap = handWrap(handler)
      
      const result = wrap.apply(this, arguments)

      const {
        
        transaction_request,
        transaction_status,
        transaction_error
      
      } = result instanceof Promise ? await result : result
      
      const end = dateFormat(new Date(Date.now()))
  
      const transaction_end = `'${end}'`

      const { error } = await l({

        transaction_start,
        transaction_endpoint,
        transaction_request,
        transaction_status,
        transaction_error,
        transaction_end

      }, LOGS.TRANSACTION)
      
      if(error)
        console.log(error)

    }])

  }

}

function handWrap(wrapped) {
  
  return async function(req, res) {

    const transaction_request = `'${JSON.stringify(req.query && Object.keys(req.query).length > 0 ? req.query : req.body && Object.keys(req.body).length > 0 ? req.body : undefined)}'`

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

    transaction_error = JSON.stringify(transaction_error)

    transaction_error = transaction_error ? `'${transaction_error}'` : null

    return { transaction_request, transaction_status, transaction_error }

  }

}

module.exports = { logWrap }