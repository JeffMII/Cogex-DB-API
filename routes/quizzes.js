const { q, s, e, r, f } = require('../helpers/mysql.helper.js')
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
    
    const { user_id, custom_time_limit } = req.query
  
    let build = { user_id, custom_time_limit }
  
    let sql = `select quiz_time_limit_upper, quiz_time_limit_lower, quiz_question_limit from users where user_id=${user_id}`
  
    ;({ result, error } = await q(sql))
  
    if (result?.length > 0) {

      const { quiz_time_limit_upper, quiz_time_limit_lower, quiz_question_limit } = result[0]
      build = { ...build, quiz_time_limit_upper, quiz_time_limit_lower, quiz_question_limit, quiz_score: null, completed_duration: null }
  
    }

    else if(error) return r({ error, result }, res)
      
    else return e('An unknown error occurred when getting user information for news questions', res)
  
    sql = `select user_news_id, news_id from user_news where user_id=${user_id} and viewed_date between ( current_timestamp() - interval ${custom_time_limit ? custom_time_limit : build.quiz_time_limit_upper} day ) and ( current_timestamp() - interval ${build.quiz_time_limit_lower} day ) and was_read=1 and news_quiz_id is null order by news_id asc`
  
    ;({ result, error } = await q(sql))
  
    let user_news = []
  
    if (result?.length > 0) {
      
      for (const { user_news_id, news_id } of result)
        user_news = [...user_news, { user_news_id, news_id }]

      build = { ...build, user_news }
  
    }
    
    else if (error) return r({ error, result }, res)
    
    else return e('An unknown error occurred when getting user news information for news questions', res)
  
    const news_ids = user_news.map(un => { return `'${un.news_id}'` })
  
    sql = `select * from news_questions where news_id in (${news_ids.join(', ')}) order by news_id asc`
  
    let news_questions = []
  
    ;({ result, error } = await q(sql))
  
    if (result?.length >= build.quiz_question_limit) {

      news_questions = result.map(rt => {

        const { ...news_question } = rt
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

        if (Object.keys(pv).length == 0) pv = [{
          news_id, questions: [{
            ...question, user_answer: null
          }]
        }]

        else {

          const index = Object.values(pv).reduce((p, c, i) => {

            if (p === -1 && c.news_id === news_id) return i
            
            return p

          }, -1)

          if (index === -1) pv = [...pv, {
            news_id, questions: [{
              ...question, user_answer: null
            }]
          }]
          
          else pv[index].questions.push({
            ...question, user_answer: null
          })

        }

        return pv

      }, [])

      build = { ...build, news_questions }

    }
    
    else if (result) {
      
      return e(`Complete more articles to activate a quiz:\n${result.length} of ${build.quiz_question_limit} questions found\n`, res)
    
    }

    else if(error)
      return r({ error, result }, res)
   
    else
      return e('An unknown error occurred when getting news questions', res)
  
    return s(build, res)

  } catch(err) { return e(err, res) }

})

router.get('/get/quiz', (req, res) => {

  const { news_quiz_id } = req.query

  const sql = `select * from news_quizzes where news_quiz_id='${news_quiz_id}'`

  return q(sql, res)

})

router.get('/get/user/quizzes', (req, res) => {

  const { user_id } = req.query

  const sql = `select * from news_quizzes where user_id=${user_id}`

  return q(sql, res)

})

router.post('/insert/quiz', async (req, res) => {

  const { ...news_quiz } = req.body

  const { user_id, completed_duration, quiz_score, news_questions, ...rest } = news_quiz

  const news_quiz_json = { news_questions, ...rest }

  const news_quiz_id = crypto.createHash('sha256').update(JSON.stringify(news_quiz)).digest('hex')
  
  const names = 'news_quiz_id, user_id, completed_duration, quiz_score, news_quiz_json'
  
  const values = [news_quiz_id, user_id, completed_duration, quiz_score, news_quiz_json]
  
  let sql = f({ sql: `insert into news_quizzes (${names}) values (${new Array(values.length).fill('?').join(', ')})`, data: values })

  let { result, error } = await q(sql)

  if(error)
    return r({ error, result }, res)

  let news_ids = []

  for(const question of news_questions)
    news_ids = [...news_ids, `'${question.news_id}'`]

  news_ids = news_ids.join(', ')

  sql = `update user_news set news_quiz_id='${news_quiz_id}' where user_id=${user_id} and news_id in (${news_ids})`
  
  ;({ result, error } = await q(sql))

  if(error)
    return r({ error, result }, res)

  return s(result, res)

})

// const E = {

//   readMORE: ({ quiz_question_limit: ql }, { length: rl }, { length: nl }) => {
    
//     return `${
//       rl >= ql * (1 / 3) ? rl >= ql * (2 / 3) ?
//       `Only ${ql - rl / nl}` :
//       'Complete more' :
//       'Read'
//     } articles to activate a quiz: ${rl} of ${ql} questions found`
  
//   },


// }

module.exports = router