const { Router } = require('express')
const { query, e, s } = require('../helpers/mysql.helper.js')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { JSDOM } = require('jsdom')
const crypto = require('crypto')

const router = Router()

var nlpURL = 'http://127.0.0.1:5000'

router.get('/get/Questgen/baseURL', (req, res) => {

  res.send({ result: nlpURL, error: null })

})

router.post('/set/Questgen/baseURL', (req, res) => {

  const { url } = req.body
  
  if(!url) res.send({ error: 'Request body must include url', result: null })
  else {
  
    nlpURL = url
    res.send({ result: 'Question Generator API base URL updated', error: null })
  
  }
})

/**
 * News Endpoints
 */ 

// Get news data
router.get('/get/news', (req, res) => {

  const { news_id } = req.query
  const sql = `select * from news where news_id='${news_id}'`
  query(sql, res)

})

// Insert new news data
router.post('/insert/news', (req, res) => {

  try {

    const { news_id, news_json } = req.body
    const sql = `insert into news (news_id, news_json) values ('${news_id}', '${news_json.replace(/\\+/g, '\\')}')`
    query(sql, res)

  } catch(err) {

    e(err, res)
  
  }
})

/**
 * News Questions Endpoints
 */

router.get('/get/news/questions', (req, res) => {
  try{
    
    const { news_id } = req.query
    const sql = `select * from news_questions where news_id='${news_id}'`
    query(sql, res)
  
  } catch(err) {

    e(err, res)

  }
})

/**
 * User News Endpoints
 */

// Get news related to specified user
router.get('/get/user/news', (req, res) => {

  try {

    const { user_id } = req.query
    const sql = `select * from user_news un left join news n on un.news_id=n.news_id where un.user_id=${user_id}`
    query(sql, res)
  
  } catch(err) {

    e(err, res)

  }

})

// Insert new relation between specified user and news
router.post('/insert/user/news', async (req, res) => {

  try{
    
      const { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
      
      let sql = `select * from user_news where user_id=${user_id} and news_id='${news_id}'`
      const { result } = await query(sql)
    
      if(result?.length > 0) {
        res.send({ error: 'Duplicate', result: null })
        return
      }

      const hash = crypto.createHash('sha256').update(`${user_id}${news_id}`).digest('hex')
    
      let names = ['user_news_id', 'user_id', 'news_id']
      let values = [`'${hash}'`, `${user_id}`, `'${news_id}'`]
    
      if (was_read !== undefined) {
        names = [...names, 'was_read']
        values = [...values, `${was_read}`]
      }
      
      if (is_bookmarked !== undefined) {
        names = [...names, 'is_bookmarked']
        values = [...values, `${is_bookmarked}`]
      }
      
      if (has_recommended !== undefined) {
        names = [...names, 'has_recommended']
        values = [...values, `${has_recommended}`]
      }
    
      names = names.join(', ')
      values = values.join(', ')
    


      sql = `insert into user_news (${names}) values (${values})`
      query(sql, res)

  } catch(err) {

    e(err, res)

  }
})

// Update relation between specified user and news
router.post('/update/user/news', async (req, res) => {

  try{
    
    var { user_id, news_id, was_read, is_bookmarked, has_recommended } = req.body
  
    let sql = `select (was_read) from user_news where user_id=${user_id} and news_id='${news_id}'`
    const user_news = await query(sql)
  
    let sets = []
  
    if (was_read !== undefined)
      sets = [...sets, `was_read=${was_read}`]
  
    if (is_bookmarked !== undefined)
      sets = [...sets, `is_bookmarked=${is_bookmarked}`]
  
    if (has_recommended !== undefined)
      sets = [...sets, `has_recommended=${has_recommended}`]
  
    sets = sets.join(', ')
  
    sql = `update user_news set ${sets} where user_id=${user_id} and news_id='${news_id}'`
    const update = await query(sql)
  
    if(update?.result?.changedRows == 1 && user_news?.result[0]?.was_read != was_read && was_read == true) {
      
      const url = `${nlpURL}/generate/news/multiple-choice-questions`
  
      const result = await (await fetch(url, {
        method: 'POST',
        body: JSON.stringify({ news_id }),
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      })).json()
      
      if(result)
        s(result, res)
      else
        e('An unknown error occurred while initiating question generation', res)
  
    } else {

      s(update, res)

    }
    
  } catch(err) {

    e(err, res)

  }
})

/**
 * Utility Endpoints and Methods
 */

// router.post('/topic/extract/headline/content', async (req, res) => {

//   // let { html } = req.body
  
//   const response = await fetch('https://www.bing.com/news/search?q=World', { method: 'GET' })
//   const raw = reformatHTML(await response.text())
//   const { document } = (new JSDOM(raw)).window
//   fs.writeFileSync('./topic.html', document.body.innerHTML)
//   const cards = document.getElementsByClassName('news-card')

//   let content = []

//   for(const card of cards) {
//     if(card.getAttribute('data-adregion')) continue
//     const url = card.getAttribute('url')
//     const title = card.getAttribute('data-title')
//     const publisher = { author: card.getAttribute('data-author'), logo: card.querySelector('div.publogo').getAttribute('src') }
//     const description = card.querySelector('div.snippet').textContent
//     let image = ''
//     let tmp = card.querySelector('img.rms-img')
//     if(!tmp) image = card.querySelector('div.rms-iac').getAttribute('data-src')
//     else image = tmp.getAttribute('src')
//     if(!(image.length == 0 && image.includes('bing'))) image = `https://www.bing.com${image}`

//     content = [...content, { url, title, publisher, description, image: tmp }]
//   }

//   res.send({ result: content, error: null })
  
// })

// router.post('/topic/extract/article/content', async (req, res) => {

//   let { html } = req.body

//   html = reformatHTML(html)

//   const soup = new JSSoup(html)

//   let content = []
//   // const body = soup.find('div', 'articlecontent')
//   const article = soup.find('div', 'richtext')
//   const paragraphs = article.findAll('p')

//   for(const paragraph of paragraphs)
//     if(paragraph.parent.attrs['class'] === 'richtext')
//       content = [...content, paragraph.text.trim()]
  
//   res.send({ result: content, error: null })

// })

// router.post('/search/extract/headline/content', (req, res) => {

//   let { html } = req.body

//   html = reformatHTML(html)

//   console.log(html, '\n----------\n')

//   const soup = new JSSoup(html)
//   const cards = soup.findAll('div', 'news-card')
  
//   let content = []

//   for(const card of cards) {

//     // if(card.attrs['data-adregion']) continue;

//     const url = card.attrs['url'].trim()
//     const title = card.attrs['data-title']
//     const author = card.attrs['data-author'].trim()
//     const description = card.find('div', 'news_snpt')?.attrs['title'].trim()

//     let image = card.find('img', 'rms_img')?.attrs['src']
//     image = (image ? image : card.find('div', 'rms_iac')?.attrs['data-src'])
//     image = (image?.includes('bing') ? image : ( image ? 'www.bing.com' + image : image))
//     image = image.trim()

//     content = [...content, { url, title, author, description, image, article: null }]

//   }

//   res.send({ result: content, error: null })
  
// })

// router.post('/search/extract/article/content', async (req, res) => {

//   let { html } = req.body

//   html = reformatHTML(html)

//   const soup = new JSSoup(html)

//   let content = []
//   // const body = soup.find('div', 'articlecontent')
//   const article = soup.find('div', 'richtext')
//   const paragraphs = article.findAll('p')

//   for(const paragraph of paragraphs)
//     if(paragraph.parent.attrs['class'] === 'richtext')
//       content = [...content, paragraph.text.trim()]
  
//   res.send({ result: content, error: null })

// })

// function reformatHTML(html) {

//   return html.replace(/(?<=="(\w)+)_(?=(\w)+")/g, '-').replace(/news-snpt/g, 'snippet')
//   // .replace(/\/\/\<\!\[CDATA\[\s*[^\n]*\s*\/\/\]\]\>/g, '')
//             //  .replace(/&nbsp;/g, ' ')
//             //  .replace(/&lt;/g, '<')
//             //  .replace(/&gt;/g, '>')
//             //  .replace(/&amp;/g, '&')
//             //  .replace(/&quot;/g, '"')
//             //  .replace(/&apos;/g, '\'')
//             //  .replace(/&cent;/g, 'cent(s)')
//             //  .replace(/&pound;/g, 'pound(s)')
//             //  .replace(/&yen;/g, 'yen')
//             //  .replace(/&euro;/g, 'euro(s)')
//             //  .replace(/&copy;/g, '(copyright)')
//             //  .replace(/&reg;/g, '(registered trademark)')
//             //  .replace(/\n/g, '')
//             //  .replace(/(?<=[^\s])\s+(?=[^\s])/g, ' ')
//             //  .replace(/\'/g, '`')
//             //  .replace(/\"/g, '\'')
//             //  .replace(/\\/g, '')
             
// }

module.exports = router