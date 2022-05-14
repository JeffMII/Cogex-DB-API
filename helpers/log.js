const { dateFormat } = require('./data')
const { l, LOGS } = require('./sql')
const JS = require('./json')

const DEBUG = true

function logWrap(wrapped) {

  return async function(signature, handler) {

    if(!DEBUG) {

      return wrapped.apply(this, arguments)

    }
    
    return wrapped.apply(this, [signature, async function() {
      
      const start = dateFormat(new Date(Date.now()))
  
      const transaction_start = `'${start}'`
  
      const transaction_endpoint = `'${signature}'`
  
      const wrap = handWrap(handler)
      
      const result = wrap.apply(this, arguments)

      const { transaction_request, transaction_status, transaction_error } = result instanceof Promise ? await result : result
      
      const end = dateFormat(new Date(Date.now()))
  
      const transaction_end = `'${end}'`

      return l({

        transaction_start,
        transaction_endpoint,
        transaction_request,
        transaction_status,
        transaction_error,
        transaction_end

      }, LOGS.TRANSACTION)

    }])

  }

}

function handWrap(wrapped) {
  
  return async function(req, res) {

    if(!DEBUG) 
      return wrapped.apply(this, [req, res])

    const args = Object.keys(req.query).length > 0 ? JS.stringify(req.query) : Object.keys(req.body).length > 0 ? JS.stringify(req.body) : undefined

    const transaction_request = `'${args}'`

    const result = wrapped.apply(this, [req, res])

    const { error } = result instanceof Promise ? await result : result

    const transaction_status = res.statusCode

    const err = JS.stringify(error)

    const transaction_error = `'${err}'`

    return { transaction_request, transaction_status, transaction_error }

  }

}

module.exports = { logWrap }