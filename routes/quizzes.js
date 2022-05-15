const { q, s, e } = require('../helpers/mysql.helper.js')
const { logWrap } = require('../helpers/wrap.helper')
const { Router } = require('express')
const crypto = require('crypto')

const router = Router()

const get = router.get
router.get = logWrap(get)

const post = router.post
router.post = logWrap(post)

router.get('/get/questions', async (req, res) => {
  
  try {
    
    const { user_id } = req.q
  
    let build = { user_id }
  
    let sql = `select quiz_time_limit_upper, quiz_time_limit_lower, quiz_question_limit from users where user_id=${user_id}`
  
    ({ result, error } = await q(sql))
  
    if (result?.length > 0) {

      const { quiz_time_limit_upper, quiz_time_limit_lower, quiz_question_limit } = result[0]
      build = { ...build, quiz_time_limit_upper, quiz_time_limit_lower, quiz_question_limit, quiz_score: null, completed_duration: null, completed_date: null }
  
    } else if (error) {

      return e(error, res)
  
    } else {
  
      return e('An unknown error occurred when getting user information for news questions', res)
  
    }
  
    sql = `select user_news_id, news_id from user_news where user_id=${user_id} and viewed_date between ( current_timestamp() - interval ${build.quiz_time_limit_upper} day ) and ( current_timestamp() - interval ${build.quiz_time_limit_lower} day ) and was_read=1 and news_quiz_id is null order by news_id asc`
  
    ({ result, error } = await q(sql))
  
    let user_news = []
  
    if (result?.result?.length > 0) {

      for (const { user_news_id, news_id } of result.result)
        user_news = [...user_news, { user_news_id, news_id }]

      build = { ...build, user_news }
  
    } else if (error) {
  
      return e(error, res)
  
    } else {
  
      return e('An unknown error occurred when getting user news information for news questions', res)
  
    }
  
    const news_ids = user_news.map(un => { return `'${un.news_id}'` })
  
    sql = `select * from news_questions where news_id in (${news_ids.join(', ')}) order by news_id asc`
  
    let news_questions = []
  
    ({ result, error } = await q(sql))
  
    if (result?.length >= build.quiz_question_limit) {

      news_questions = result.result.map(r => {

        const { ...news_question } = r
        return news_question

      })

      let rands = []

      while (rands.length < build.quiz_question_limit) {

        const rand = Math.floor(Math.random() * news_questions.length)
        if (rands.indexOf(rand) === -1) rands = [...rands, rand]

      }

      news_questions = rands.map(rand => { return news_questions[rand] })

      news_questions = news_questions.reduce((pv, cv) => {

        let { news_id, ...question } = cv

        question = { ...question, news_question_json: JSON.parse(question.news_question_json) }

        if (Object.keys(pv).length == 0) pv = [{ news_id, questions: [{ ...question, user_answer: null }] }]
        else {

          const index = Object.values(pv).reduce((p, c, i) => {

            if (p === -1 && c.news_id === news_id) return i
            else return p

          }, -1)

          if (index === -1) pv = [...pv, { news_id, questions: [{ ...question, user_answer: null }] }]
          else pv[index].questions.push({ ...question, user_answer: null })

        }

        return pv

      }, [])

      build = { ...build, news_questions }

    } else if (result?.length > 0) {

      return e(`Only ${result.result.length} total question(s) found for News IDs: ${news_ids.join(', ')}`, res)

    } else if(result) {

      return e(`No questions were found for News IDs: ${news_ids.join(', ')}`, res)

    } else if (error) {
  
      return e(error, res)
  
    } else {
  
      return e('An unknown error occurred when getting news questions', res)
  
    }
  
    return s(build, res)

  } catch(err) {

    return e(err, res)

  }
})

router.get('/get/quiz', async (req, res) => {

  const { news_quiz_id } = req.q

  const sql = `select * from news_quizzes where news_quiz_id='${news_quiz_id}'`

  return await q(sql, res)

})

router.get('/get/user/quizzes', async (req, res) => {

  const { user_id } = req.q

  const sql =  `select * from news_quizzes where user_id=${user_id}`

  return await q(sql, res)

})

router.post('/insert/quiz', async (req, res) => {

  const { news_quiz } = req.body

  const { user_id, completed_duration, completed_date, quiz_score, news_questions, ...news_quiz_json } = news_quiz

  const news_quiz_id = crypto.createHash('sha256').update(JSON.stringify(news_quiz)).digest('hex')
  
  const names = '(news_quiz_id, user_id, completed_duration, completed_date, quiz_score, news_quiz_json)'
  
  const values = `('${news_quiz_id}', ${user_id}, ${completed_duration}, ${completed_date}, ${quiz_score}, '${JSON.stringify(news_quiz_json)}')`
  
  let sql = `insert into news_quizzes ${names} values ${values}`
  
  var results = []
  
  var result = await q(sql)

  if(result?.error) {

    return e(result.error, res)

  }

  results = [...results, result.result]
  
  var news_ids = []

  for(const question of news_questions)
    news_ids = [...news_ids, question.news_id]

  for(const news_id of news_ids) {
    
    sql = `update into user_news (news_quiz_id) values ('${news_quiz_id}') where user_id=${user_id} and news_id='${news_id}'`
    result = await q(sql)

    if(result?.error) {

      return e(result.error, res)

    }

    results = [...results, result.result]
  
  }

  return s(results, res)

})

module.exports = router