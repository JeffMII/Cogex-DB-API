const { Configuration, OpenAIApi } = require('openai')

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})

const openai = new OpenAIApi(configuration)

function multiChoices(snippets, topics = []) {
  
  let count = snippets.length
  
  let text = snippets.join(' ')
  
  let data = `a multiple-choice question as a string labeled "question", the answer as a string labeled "answer", three generated distractors as an array of strings labeled "distractors"`
  
  let json = `[{
    "question": "What is a charge of discrimination?",
    "answer": "A signed statement asserting that an organization engaged in employment discrimination.",
    "distractors": ["A request for EEOC to take remedial action.", "A lawsuit for unlawful discrimination.", "None of the above."]
  }, {
    "question": "What is a charge of discrimination?",
    "answer": "A signed statement asserting that an organization engaged in employment discrimination.",
    "distractors": ["A request for EEOC to take remedial action.", "A lawsuit for unlawful discrimination.", "None of the above."]
  }]`
  
  let prompt = `Provide a JSON list of ${count} records of [Data Description] for multiple-choice questions generated only from [Text]${topics.length > 0 ? ' that pertain to [Topics]' : ''}. All provided [Data Description] records are required to be given as JSON as shown in [JSON Example].
  [Text]${text}[Text]
  [Data Description]${data}[Data Description]
  [JSON Example]${json}[JSON Example]
  ${topics.length > 0 ? '[Topics]' + topics.join(', ') + '[Topics]' : ''}`
  
  const response = await openai.createCompletion("text-davinci-002", {
    prompt,
    top_p: 0.33,
    max_tokens: 256 * count
  })
  
  const { choices } = response.data
  const [ quests ] = choices
  
  return JSON.parse(quests.text)

}

module.exports = { multiChoices }