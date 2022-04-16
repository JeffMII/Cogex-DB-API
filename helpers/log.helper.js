const { dateFormat } = require('./date.helper')
const { l, LOGS } = require('./mysql.helper')
const { JSstringify, JSparse } = require('./json.helper')

function logWrap(wrapped) {

  return async function(signature, handler) {
    
    wrapped.apply(this, [signature, async function() {
      
      const start = dateFormat(new Date(Date.now()))
  
      const transaction_start = `'${start}'`
  
      const transaction_endpoint = `'${signature}'`
  
      const wrap = handWrap(handler)
      
      const result = wrap.apply(this, arguments)

      const { transaction_request, transaction_status, transaction_error } = result instanceof Promise ? await result : result
      
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
      
    }])

  }

}

function handWrap(wrapped) {
  
  return async function(req, res) {

    const args = Object.keys(req.query).length > 0 ? JSstringify(req.query) : Object.keys(req.body).length > 0 ? JSstringify(req.body) : 'Unknown'

    const transaction_request = `'${args}'`

    const result = wrapped.apply(this, [req, res])

    const { error } = result instanceof Promise ? await result : result

    const transaction_status = res.statusCode

    const err = JSstringify(error)

    const transaction_error = `'${err}'`

    return { transaction_request, transaction_status, transaction_error }

  }

}

module.exports = { logWrap }