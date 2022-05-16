const mysql = require('../mysql.helper')

async function test() {

  const str = `themselves.\\\\",\\\\\\\\"options\\\\\\\\":[\\\\\\\\"Ukraine\\\\\\\\",\\\\\\\\"Baltics\\\\\\\\",\\\\\\\\\"Crimea\\\\\\\\\"],\\\\\\\\\"extra_options\\\\\\\\\":[\\\\\\\\\"Ussr\\\\\\\\\",\\\\\\\\\\\\"Nato\\\\\\\\\\\\"],\\\\\\\\\\\\"question_type\\\\\\\\\\\\":\\\\\\\\\\\\"MCQ\\\\\\\\\\\\",\\\\\\\\\\\\"options_algorithm\\\\":\\\\"sense2vec\\\\",\\\\"question_statement\\\\":\\\\"What country is a reminder of the extent to which Russia is... especially in high circles, who can still think for themselves?\\\\"},\\\\\"user_answer\\\\\":\\\\\"russia\\\\\"},{\\\\\"news_question_id\\\\\":\\\\\"0f51b9bfcc82cd97695ef6353c786e7b54c071ce114b7dea6a1e9eb4701e4c58\\\\\",\\\\\"news_question_json\\\\\":{\\\\\"answer\\\\\":\\\\\"reminder\\\\\",\\\\\"context\\\\\":\\\\"But the fact that his remarks could easily be applied to todays war is a reminder of the extent to which Russia is ... especially in high circles, who can still think for themselves.\\\\",\\\\"options\\\\":[\\\\"Reminding\\\\",\\\\"Next Time\\\\"],\\\\"extra_options\\\\":[],\\\\"question_type\\\\":\\\\"MCQ\\\\",\\\\"options_algorithm\\\\":\\\\"sense2vec\\\\",\\\\"question_statement\\\\":\\\\"How can the comments of Putin be applied to todays war?\\\\"},\\\\"user_answer\\\\":\\\\"next time\\\\"}]}],\\\\"quiz_time_limit_upper\\\\":5,\\\\"quiz_time_limit_lower\\\\":0,\\\\"quiz_question_limit\\\\":5,\\\\"completed_date\\\\":null,\\\\"user_news\\\\":[{\\\\"user_news_id\\\\":
  \\\\"6bc3ffff63b94e5fccdf87774c07f6bb54a8ee8e6563c64aba0f8dcfa46afcf0\\\\",\\\\"news_id\\\\":\\\\"0f5b71124ab6cb4f104e28a61ef29ba26876a37361d546b99fe7f94f58734231\\\\"},{\\\\"user_news_id\\\\":\\\\"9eb54208bd07aa8bc0c3d46ea22e9878b50b7570d4ee78d6084db76448011745\\\\",\\\\"news_id\\\\":\\\\"10d3a6f877cddcddefa54ede1ccab39c6242a99c704582cb79cecd163ce43959\\\\"},{\\\\"user_news_id\\\\":\\\\"52fe6e3ec6014dbc9ba`

  console.log(str.replace(/\\+/g, '\\'))

}

test()