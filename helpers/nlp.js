const JS = require('./json')
const { q } = require('./sql')

async function getNLP() {
  
  const sql = `select app_setting_json from app_settings where app_setting_id='nlpURL'`
  
  const { result, error } = await q(sql)

  if(error) return null
  else if(result?.length > 0) {

    const [app_setting, ...rest] = result

    const { app_setting_json } = app_setting

    return JS.parse(app_setting_json).nlpURL
  
  } else
    return null

}

async function setNLP(url) {

  const sql = `replace into app_settings (app_setting_id, app_setting_json) values ('nlpURL', '{ "nlpURL": "${url}" }')`

  return await q(sql)

}

module.exports = { getNLP, setNLP }