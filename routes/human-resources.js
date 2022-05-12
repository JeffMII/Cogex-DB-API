const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { logWrap } = require('../helpers/log.helper')
const { JSstringify, JSparse } = require('../helpers/json.helper')
const { q, e, s } = require('../helpers/mysql.helper')
const { getNLP } = require('../helpers/nlp.helper')
const { Router } = require('express')
const crypto = require('crypto')

const router = Router()

const get = router.get
router.get = logWrap(get)

const post = router.post
router.post = logWrap(post)

/**
 * Human Resources Endpoints
 */ 

// Get human_resources data
router.get('/get/hr', async (req, res) => {

  const { hr_id } = req.query
  const sql = `select * from human_resources where hr_id='${hr_id}'`
  return await q(sql, res)

})

// Insert new human_resources data
router.post('/insert/hr', async (req, res) => {

  try {

    const { hr_id, hr_json } = req.body

    let json = JSstringify(hr_json)

    const sql = `insert into human_resources (hr_id, hr_json) values ('${hr_id}', '${json}')`
    return await q(sql, res)

  } catch(err) {

    return e(err, res)
  
  }

})

/**
 * News Question Endpoints
 */

router.get('/get/hr/questions', async (req, res) => {
  try{
    
    const { hr_id } = req.query
    const sql = `select * from hr_questions where hr_id='${hr_id}'`
    return await q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }

})

/**
 * staff News Endpoints
 */

// Get human resources related to specified staff
router.get('/get/staff/hr', async (req, res) => {

  try {

    const { staff_id } = req.query
    const sql = `select * from staff_hr sf left join human_resources h on sf.hr_id=n.hr_id where sf.staff_id=${staff_id}`
    return await q(sql, res)
  
  } catch(err) {

    return e(err, res)

  }

})

// Insert new relation between specified staff and hr
router.post('/insert/staff/hr', async (req, res) => {

  try{
    
      const { staff_id, hr_id, was_read, is_bookmarked, has_recommended } = req.body
      
      let sql = `select * from staff_hr where staff_id=${staff_id} and hr_id='${hr_id}'`
      const { result } = await q(sql)
    
      if(result?.length > 0)
        return e('Duplicate', res)

      const hash = crypto.createHash('sha256').update(`${staff_id}${hr_id}`).digest('hex')
    
      let names = ['staff_hr_id', 'staff_id', 'hr_id']
      let values = [`'${hash}'`, `${staff_id}`, `'${hr_id}'`]
    
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
    
      sql = `insert into staff_hr (${names}) values (${values})`
      return await q(sql, res)

  } catch(err) {

    return e(err, res)

  }

})

// Update relation between specified staff and hr
router.post('/update/staff/hr', async (req, res) => {

  try{
    
    var { staff_id, hr_id, was_read, is_bookmarked, has_recommended } = req.body
  
    let sql = `select (was_read) from staff_hr where staff_id=${staff_id} and hr_id='${hr_id}'`
    const staff_hr = await q(sql)
  
    let sets = []
  
    if (was_read !== undefined)
      sets = [...sets, `was_read=${was_read}`]
  
    if (is_bookmarked !== undefined)
      sets = [...sets, `is_bookmarked=${is_bookmarked}`]
  
    if (has_recommended !== undefined)
      sets = [...sets, `has_recommended=${has_recommended}`]
  
    sets = sets.join(', ')
  
    sql = `update staff_hr set ${sets} where staff_id=${staff_id} and hr_id='${hr_id}'`
    const { result, error } = await q(sql)
  
    if(result?.changedRows == 1 && staff_hr?.result[0]?.was_read != was_read && was_read == true) {
      
      const url = `${await getNLP()}/generate/multiple-choice-questions`
  
      const result = await (await fetch(url, {

        method: 'POST',
        body: JSstringify({ hr_id }),
        headers: {

          'Content-Type': 'application/json',
          'Accept': 'application/json'

        }

      })).json()
      
      if(result)
        return s(result, res)
      else
        return e('An unknown error occurred while initiating question generation', res)
  
    } else {

      return s(result, res)

    }
    
  } catch(err) {

    return e(err, res)

  }

})

router.get('/generate/hr/questions', async (req, res) => {

  const { hr_id } = req.query

  const nlp = await getNLP()

  const url = `${nlp}/generate/multiple-choice-questions`

  const result = await (await fetch(url, {

    method: 'POST',
    body: JSstringify({ hr_id }),
    headers: {

      'Content-Type': 'application/json',
      'Accept': 'application/json'

    }

  })).json()
  
  if(result)
    return s(result, res)
  else
    return e('An unknown error occurred while initiating question generation', res)

})

router.get('/generate/hr/questions/from/articles', async (req, res) => {

  // const { hr_id } = req.query

  // const nlp = await getNLP()

  // const url = `${nlp}/gen/mcqs`

  // const result = await (await fetch(url, {

  //   method: 'POST',
  //   body: JSstringify({ hr_id }),
  //   headers: {

  //     'Content-Type': 'application/json',
  //     'Accept': 'application/json'

  //   }

  // })).json()
  
  // if(result)
  //   return s(result, res)
  // else
  //   return e('An unknown error occurred while initiating question generation', res)

  let articles = [{
    url: `https://www.eeoc.gov/how-file-charge-employment-discrimination`,
    search: `EEO`,
    snippets: [
      "A charge of discrimination is a signed statement asserting that an organization engaged in employment discrimination. It requests EEOC to take remedial action. The laws enforced by EEOC, except for the Equal Pay Act, require you to file a charge before you can file a lawsuit for unlawful discrimination. There are strict time limits for filing a charge.",
      "Time Limits for Filing a Charge Where the discrimination took place can determine how long you have to file a charge. The 180-calendar day filing deadline is extended to 300- calendar days if a state or local agency enforces a state or local law that prohibits employment discrimination on the same basis. The rules are slightly different for age discrimination charges. For age discrimination, the filing deadline is only extended to 300 days if there is a state law prohibiting age discrimination in employment and a state agency or authority enforcing that law. The deadline is not extended if only a local law prohibits age discrimination.",
      "Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you. EEOC's Public Portal asks you a few questions to help determine whether EEOC is the right federal agency to handle your complaint involving employment discrimination.",
      "In Person at an EEOC Office Each EEOC office has appointments, which you can schedule online through the EEOC Public Portal. Offices also have walk in appointments. Go to https://www.eeoc.gov/field office for information about the office closest to you.",
      "In the EEOC's experience, having the opportunity to discuss your concerns with an EEOC staff member in an interview is the best way to assess how to address your concerns about employment discrimination and determine whether filing a charge of discrimination is the appropriate path for you. In any event, the final decision to file a charge is your own. An EEOC staff member will prepare a charge using the information you provide, which you can review and sign online by logging into your account.",
      "You may file a charge of employment discrimination at the EEOC office closest to where you live, or at any one of the EEOC's 53 field offices. Your charge, however, may be investigated at the EEOC office closest to where the discrimination occurred. If you are a U.S. citizen working for an American company overseas, you should file your charge with the EEOC field office closest to your employer's corporate headquarters.",
      "It is always helpful if you bring with you to the meeting any information or papers that will help us understand your case. For example, if you were fired because of your performance, you might bring with you the letter or notice telling you that you were fired and your performance evaluations. You might also bring with you the names of people who know about what happened and information about how to contact them.",
      "You can bring anyone you want to your meeting, especially if you need language assistance and know someone who can help. You can also bring your lawyer, although you don't have to hire a lawyer to file a charge. If you need special assistance during the meeting, like a sign language or foreign language interpreter, let us know ahead of time so we can arrange for someone to be there for you.",
      "By Telephone Although we do not take charges over the phone, you can get the process started over the phone. You can call 1-800-669-4000 to discuss your situation. A representative will ask you for some basic information to determine if your situation is covered by the laws we enforce and explain how to file a charge. At a State or Local Fair Employment Practice Agency Many states and localities have agencies that enforce laws prohibiting employment discrimination. EEOC refers to these agencies as Fair Employment Practices Agencies (FEPAs). EEOC and some FEPAs have worksharing agreements in place to prevent the duplication of effort in charge processing. According to these agreements, if you file a charge with either EEOC or a FEPA, the charge also will be automatically filed with the other agency. This process, which is defined as dual filing, helps to protect charging party rights under both federal and state or local law. If you file a charge at a state or local agency, you can let them know if you also want your charge filed with the EEOC.",
      "By Mail If you have 60 days or fewer in which to file a timely charge, the EEOC Public Portal will provide special directions for providing necessary information to the EEOC and how to file your charge quickly.",
      "You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature Don't forget to sign your letter. If you don't sign it, we cannot investigate it.",
      "Your letter will be reviewed and if more information is needed, we will contact you to gather that information."
    ],
    questions: [{
      question_statement: "Who enforces the laws of the EEOC, except for the Equal Pay Act?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "The laws enforced by EEOC, except for the Equal Pay Act, require you to file a charge before you can file a lawsuit for unlawful discrimination. It requests EEOC to take remedial action."
    }, {
      question_statement: "What is a charge of discrimination?",
      question_type: "MCQ",
      answer: "employment discrimination",
      options: ["Workplace Discrimination", "Protected Classes"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "A charge of discrimination is a signed statement asserting that an organization engaged in employment discrimination."
    }, {
      question_statement: "What are the strictest time limits for filing a charge?",
      question_type: "MCQ",
      answer: "time limits",
      options: ["Time Restrictions", "Set Time Limit", "Specific Rules"],
      options_algorithm: "sense2vec",
      extra_options: ["Minimum Time"],
      context: "There are strict time limits for filing a charge."
    }, {
      question_statement: "What can you file if you are charged with unlawful discrimination?",
      question_type: "MCQ",
      answer: "lawsuit",
      options: ["Civil Suit", "Court Case", "Litigation"],
      options_algorithm: "sense2vec",
      extra_options: ["Suing"],
      context: "The laws enforced by EEOC, except for the Equal Pay Act, require you to file a charge before you can file a lawsuit for unlawful discrimination."
    }, {
      question_statement: "Who is the right federal agency to handle your complaint involving employment discrimination?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you. EEOC's Public Portal asks you a few questions to help determine whether EEOC is the right federal agency to handle your complaint involving employment discrimination. EEOC's Public Portal asks you a few questions to help determine whether EEOC is the right federal agency to handle your complaint involving employment discrimination."
    }, {
      question_statement: "How can I submit an inquiry online?",
      question_type: "MCQ",
      answer: "online",
      options: ["Various Websites", "Game Stores"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you. Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you. Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you."
    }, {
      question_statement: "How do I submit an online complaint?",
      question_type: "MCQ",
      answer: "inquiry",
      options: ["Questioning", "Examination", "Dismissal"],
      options_algorithm: "sense2vec",
      extra_options: ["Inquiries", "Further Discussion", "Reasonableness"],
      context: "Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you. Online Use the EEOC Public Portal to Submit an Inquiry, Schedule an Appointment, and File a Charge A Charge of Discrimination can be completed through our online system after you submit an online inquiry and we interview you."
    }, {
      question_statement: "What do you schedule online through the EEOC Public Portal?",
      question_type: "MCQ",
      answer: "appointments",
      options: ["Appts", "Consults", "Doctors Appointment"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "In Person at an EEOC Office Each EEOC office has appointments, which you can schedule online through the EEOC Public Portal. Offices also have walk in appointments."
    }, {
      question_statement: "What are some office appointments?",
      question_type: "MCQ",
      answer: "walk",
      options: ["Stroll", "Saunter", "Waddle"],
      options_algorithm: "sense2vec",
      extra_options: ["Half A Mile", "Bus Stop", "Standing", "Mosey"],
      context: "Offices also have walk in appointments."
    }, {
      question_statement: "What is the best way to address your concerns about employment discrimination?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "In the EEOC's experience, having the opportunity to discuss your concerns with an EEOC staff member in an interview is the best way to assess how to address your concerns about employment discrimination and determine whether filing a charge of discrimination is the appropriate path for you. In the EEOC's experience, having the opportunity to discuss your concerns with an EEOC staff member in an interview is the best way to assess how to address your concerns about employment discrimination and determine whether filing a charge of discrimination is the appropriate path for you. An EEOC staff member will prepare a charge using the information you provide, which you can review and sign online by logging into your account."
    }, {
      question_statement: "What is the best way to address your concerns about?",
      question_type: "MCQ",
      answer: "employment discrimination",
      options: ["Workplace Discrimination", "Protected Classes"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "In the EEOC's experience, having the opportunity to discuss your concerns with an EEOC staff member in an interview is the best way to assess how to address your concerns about employment discrimination and determine whether filing a charge of discrimination is the appropriate path for you."
    }, {
      question_statement: "What is the charge of EEOC?",
      question_type: "MCQ",
      answer: "employment discrimination",
      options: ["Workplace Discrimination", "Protected Classes"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "You may file a charge of employment discrimination at the EEOC office closest to where you live, or at any one of the EEOC's 53 field offices."
    }, {
      question_statement: "Where is the EEOC field office closest to your employer's corporate headquarters?",
      question_type: "MCQ",
      answer: "headquarters",
      options: ["Headquartered", "Offices", "Washington Dc"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "If you are a U.S. citizen working for an American company overseas, you should file your charge with the EEOC field office closest to your employer's corporate headquarters."
    }, {
      question_statement: "What is the name of the charge filed by the EEOC field office closest to your employer's corporate headquarters?",
      question_type: "MCQ",
      answer: "charge",
      options: ["Charging", "Pay", "Flat Fee"],
      options_algorithm: "sense2vec",
      extra_options: ["Convenience Fee"],
      context: "If you are a U.S. citizen working for an American company overseas, you should file your charge with the EEOC field office closest to your employer's corporate headquarters. You may file a charge of employment discrimination at the EEOC office closest to where you live, or at any one of the EEOC's 53 field offices. Your charge, however, may be investigated at the EEOC office closest to where the discrimination occurred."
    }, {
      question_statement: "What is the best way to help us understand your case?",
      question_type: "MCQ",
      answer: "papers",
      options: ["Journals", "Text Books", "Printouts"],
      options_algorithm: "sense2vec",
      extra_options: ["Essays"],
      context: "It is always helpful if you bring with you to the meeting any information or papers that will help us understand your case."
    }, {
      question_statement: "If you were fired because of your performance, what would you bring with you?",
      question_type: "MCQ",
      answer: "notice",
      options: ["Noticing", "Even", "See"],
      options_algorithm: "sense2vec",
      extra_options: ["Bothered", "Weird Thing", "Remark"],
      context: "For example, if you were fired because of your performance, you might bring with you the letter or notice telling you that you were fired and your performance evaluations."
    }, {
      question_statement: "What is the most common language that we can help with during a meeting?",
      question_type: "MCQ",
      answer: "sign language",
      options: ["Asl.", "Deaf People", "Lip Reading"],
      options_algorithm: "sense2vec",
      extra_options: ["Foreign Language", "Conversationally"],
      context: "If you need special assistance during the meeting, like a sign language or foreign language interpreter, let us know ahead of time so we can arrange for someone to be there for you."
    }, {
      question_statement: "What can you bring to court?",
      question_type: "MCQ",
      answer: "lawyer",
      options: ["Attorney", "Solicitor", "Public Defender"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "You can also bring your lawyer, although you don't have to hire a lawyer to file a charge. You can also bring your lawyer, although you don't have to hire a lawyer to file a charge."
    }, {
      question_statement: "What is the only charge that you can file without a lawyer?",
      question_type: "MCQ",
      answer: "charge",
      options: ["Charging", "Pay", "Flat Fee"],
      options_algorithm: "sense2vec",
      extra_options: ["Convenience Fee"],
      context: "You can also bring your lawyer, although you don't have to hire a lawyer to file a charge."
    }, {
      question_statement: "If you file a charge with EEOC or FEPA, the charge will also be automatically filed with which agency?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "According to these agreements, if you file a charge with either EEOC or a FEPA, the charge also will be automatically filed with the other agency. If you file a charge at a state or local agency, you can let them know if you also want your charge filed with the EEOC. EEOC and some FEPAs have worksharing agreements in place to prevent the duplication of effort in charge processing."
    }, {
      question_statement: "What are some states that have laws prohibiting employment discrimination?",
      question_type: "MCQ",
      answer: "localities",
      options: ["Municipalities", "Local Governments", "Other States"],
      options_algorithm: "sense2vec",
      extra_options: ["State Level"],
      context: "At a State or Local Fair Employment Practice Agency Many states and localities have agencies that enforce laws prohibiting employment discrimination."
    }, {
      question_statement: "What is the name of the EEOC Public Portal?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "By Mail If you have 60 days or fewer in which to file a timely charge, the EEOC Public Portal will provide special directions for providing necessary information to the EEOC and how to file your charge quickly. By Mail If you have 60 days or fewer in which to file a timely charge, the EEOC Public Portal will provide special directions for providing necessary information to the EEOC and how to file your charge quickly."
    }, {
      question_statement: "What is the name of the employer you want to file a charge against?",
      question_type: "MCQ",
      answer: "telephone number",
      options: ["Phone Number", "Address", "Contact Information"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature don't forget to sign your letter. You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature don't forget to sign your letter."
    }, {
      question_statement: "What is the name of the employer you want to file a charge against?",
      question_type: "MCQ",
      answer: "email",
      options: ["Gmail Address"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature don't forget to sign your letter. You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature don't forget to sign your letter."
    }, {
      question_statement: "What is the name of the employer you want to file a charge against?",
      question_type: "MCQ",
      answer: "address",
      options: ["Reiterate", "Adressing", "Particular Issue"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature don't forget to sign your letter. You can also file a charge by sending us a letter that includes the following information: Your name, address, email, and telephone number The name, address, email, and telephone number of the employer (or employment agency or union) you want to file your charge against The number of employees employed there (if known) A short description of the actions you believe were discriminatory (for example, you were fired, demoted, harassed) When the discriminatory actions took place Why you believe you were discriminated against (for example, because of your race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability, genetic information, or retaliation Your signature don't forget to sign your letter."
    }]
  },
  {
    url: `https://www.dol.gov/agencies/ofccp/about`,
    search: `OFCCP`,
    snippets: [
      "At the Office of Federal Contract Compliance Programs (OFCCP), we protect workers, promote diversity and enforce the law. OFCCP holds those who do business with the federal government (contractors and subcontractors) responsible for complying with the legal requirement to take affirmative action and not discriminate on the basis of race, color, sex, sexual orientation, gender identity, religion, national origin, disability, or status as a protected veteran. In addition, contractors and subcontractors are prohibited from discharging or otherwise discriminating against applicants or employees who inquire about, discuss or disclose their compensation or that of others, subject to certain limitations.",
      "History In 2009, the Employment Standards Administration was abolished and its four major program components became stand‐alone programs reporting directly to the Secretary of Labor: Office of Federal Contract Compliance Programs, Office of Labor Management Standards, Office of Workers’ Compensation Programs and the Wage and Hour Division. The Office of the Assistant Secretary and the Office of Management, Administration and Planning (OMAP) were eliminated with administrative functions in OMAP transferred to the four programs or departmental administrative programs.",
      "OFCCP’s Enforcement Procedures In carrying out its responsibilities, the OFCCP uses the following enforcement procedures: Offers compliance assistance to federal contractors and subcontractors to help them understand the regulatory requirements and review process. Conducts compliance evaluations and complaint investigations of federal contractors and subcontractors personnel policies and procedures. Obtains Conciliation Agreements from contractors and subcontractors who are in violation of regulatory requirements. Monitors contractors and subcontractors progress in fulfilling the terms of their agreements through periodic compliance reports. Forms linkage agreements between contractors and Labor Department job training programs to help employers identify and recruit qualified workers. Recommends enforcement actions to the Solicitor of Labor. The ultimate sanction for violations is debarment – the loss of a company’s federal contracts. Other forms of relief to victims of discrimination may also be available, including back pay for lost wages. The OFCCP has close working relationships with other Departmental agencies, such as: the Department of Justice, the Equal Employment Opportunity Commission and the DOL, the Office of the Solicitor, which advises on ethical, legal and enforcement issues; the Women’s Bureau, which emphasizes the needs of working women; the Office of Apprenticeship, which establishes policies to promote equal opportunities in the recruitment and selection of apprentices; and the Employment and Training Administration, which administers Labor Department job training programs for current workforce needs.",
      "OFCCP has a national network of six Regional Offices, each with District and Area Offices in Major Metropolitan Centers. OFCCP focuses its resources on finding and resolving systemic discrimination. The agency has adopted this strategy to: Prioritize enforcement resources by focusing on the worst offenders; Encourage employers to engage in self audits of their employment practices; and Achieve maximum leverage of resources to protect the greatest number of workers from discrimination. OFCCP Leadership Jenny R. Yang Director. Maya Raghu Deputy Director, Policy. Michele Hodge Deputy Director. Dariely Rodriguez Chief of Staff. OFCCP Office Directory National Office Directory Regional Offices District and Area Offices Organization Chart Career Opportunities at OFCCP View Current Career Opportunities"
    ],
    questions: [{
      question_statement: "Who is prohibited from discharging or otherwise discriminating against applicants or employees who inquire about, discuss or disclose their compensation or that of others?",
      question_type: "MCQ",
      answer: "subcontractors",
      options: ["Contractors", "Employees"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "OFCCP holds those who do business with the federal government (contractors and subcontractors) responsible for complying with the legal requirement to take affirmative action and not discriminate on the basis of race, color, sex, sexual orientation, gender identity, religion, national origin, disability, or status as a protected veteran. In addition, contractors and subcontractors are prohibited from discharging or otherwise discriminating against applicants or employees who inquire about, discuss or disclose their compensation or that of others, subject to certain limitations."
    }, {
      question_statement: "What is the most important factor that OFCCP does not discriminate on the basis of race, color, sex, sexual orientation, religion, national origin, disability, or status as a protected veteran?",
      question_type: "MCQ",
      answer: "gender identity",
      options: ["Sexual Identity", "Gender Expression", "Biological Sex"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "OFCCP holds those who do business with the federal government (contractors and subcontractors) responsible for complying with the legal requirement to take affirmative action and not discriminate on the basis of race, color, sex, sexual orientation, gender identity, religion, national origin, disability, or status as a protected veteran."
    }, {
      question_statement: "What is the OFCCP's national network of offices?",
      question_type: "MCQ",
      answer: "regional offices",
      options: ["Other Offices", "Various Departments"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "OFCCP Office Directory National Office Directory Regional Offices District and Area Offices Organization Chart Career Opportunities at OFCCP View Current Career Opportunities OFCCP has a national network of six Regional Offices, each with District and Area Offices in Major Metropolitan Centers."
    }]
  },
  {
    url: `https://www.eeoc.gov/employers`,
    search: `EEO Compliance`,
    snippets: [
      "The U.S. Equal Employment Opportunity Commission enforces Federal laws prohibiting employment discrimination. These laws protect employees and job applicants against employment discrimination when it involves: Unfair treatment because of race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability or genetic information. Harassment by managers, co-workers, or others in the workplace, because of race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information. Denial of a reasonable workplace accommodation that the employee needs because of religious beliefs or disability. Retaliation because the employee complained about job discrimination, or assisted with a job discrimination investigation or lawsuit. Not all employers are covered by the laws we enforce, and not all employees are protected. This can vary depending on the type of employer, the number of employees it has, and the type of discrimination alleged.",
      "An employee or job applicant who believes that he or she has been discriminated against at work can file a \"Charge of Discrimination.\" All of the laws enforced by EEOC, except for the Equal Pay Act, require employees and applicants to file a Charge of Discrimination with us before they can file a job discrimination lawsuit against their employer. Also, there are strict time limits for filing a charge.",
      "The fact that the EEOC has taken a charge does not mean that the government is accusing anyone of discrimination. The charging party has alleged that an employer has discriminated against him or her and it is the EEOC's job to investigate the matter to determine whether there is reasonable cause to believe that discrimination has occurred.",
      "Other Requirements The laws enforced by EEOC require employers to keep certain records, regardless of whether a charge has been filed against them. When a charge has been filed, employers have additional recordkeeping obligations. The EEOC also collects workforce data from some employers, regardless of whether a charge has been filed against the company.",
      "Employers are required to post notices describing the Federal laws prohibiting job discrimination based on race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information.",
      "Small Businesses While the information in this section of our website applies to all employers, it has been specifically designed for small businesses which may not have a human resources department or a specialized EEO staff. We realize that the information provided here may not answer all of the sophisticated legal issues that can arise in employment discrimination cases. Employers who have questions about the laws enforced by EEOC or about compliance with those laws in specific workplace situations may contact one of our small business liaisons for assistance.",
      "Read more about... The Laws Enforced by EEOC Types of Discrimination Prohibited Practices Coverage Charge Handling Resolving a Charge Remedies Recordkeeping EEO Data Collections \"EEO Is The Law\" Poster Training Other Employment Issues Other Government Resources for Business Business.USA.gov is the U.S. government's official web portal to support business start-ups, growth, financing and exporting. It is designed to provide access to online resources and services of Federal, state, and local Government as well as those of non-profit and educational organizations supporting businesses."
    ],
    questions: [{
      question_statement: "What does the Equal Employment Opportunity Commission protect against?",
      question_type: "MCQ",
      answer: "employment discrimination",
      options: ["Workplace Discrimination", "Protected Classes"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "These laws protect employees and job applicants against employment discrimination when it involves: Unfair treatment because of race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability or genetic information. Equal Employment Opportunity Commission enforces Federal laws prohibiting employment discrimination."
    }, {
      question_statement: "What is a sex discrimination?",
      question_type: "MCQ",
      answer: "pregnancy",
      options: ["Pregnancies", "Breastfeeding", "Fertility Issues"],
      options_algorithm: "sense2vec",
      extra_options: ["Childbirth", "Hysterectomy", "Miscarry"],
      context: "These laws protect employees and job applicants against employment discrimination when it involves: Unfair treatment because of race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability or genetic information. Harassment by managers, co-workers, or others in the workplace, because of race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information."
    }, {
      question_statement: "What is the most common reason for discrimination?",
      question_type: "MCQ",
      answer: "disability",
      options: ["Disabilities", "Chronic Illness", "Medical Issue"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "These laws protect employees and job applicants against employment discrimination when it involves: Unfair treatment because of race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability or genetic information. Harassment by managers, co-workers, or others in the workplace, because of race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information. Denial of a reasonable workplace accommodation that the employee needs because of religious beliefs or disability."
    }, {
      question_statement: "What is the most discriminatory trait in the workplace?",
      question_type: "MCQ",
      answer: "sex",
      options: ["Multiple Partners"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "These laws protect employees and job applicants against employment discrimination when it involves: Unfair treatment because of race, color, religion, sex (including pregnancy, gender identity, and sexual orientation), national origin, age (40 or older), disability or genetic information. Harassment by managers, co-workers, or others in the workplace, because of race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information."
    }, {
      question_statement: "Who is a \discrimination\" employee?",
      question_type: "MCQ",
      answer: "job applicant",
      options: ["Applicant", "Potential Employee", "Job Candidate"],
      options_algorithm: "sense2vec",
      extra_options: ["Hiring Managers"],
      context: "An employee or job applicant who believes that he or she has been discriminated against at work can file a \"Charge of Discrimination.\""
    }, {
      question_statement: "What is the only law that requires employees and applicants to file a Charge of Discrimination with us before they can file a job discrimination lawsuit against their employer?",
      question_type: "MCQ",
      answer: "equal pay act",
      options: ["Title Vii", "Civil Rights Act", "Sex Discrimination"],
      options_algorithm: "sense2vec",
      extra_options: ["Act", "Federal Law", "Equal Protection Clause", "Flsa", "Fourteenth Amendment", "Private Employers"],
      context: "All of the laws enforced by EEOC, except for the Equal Pay Act, require employees and applicants to file a Charge of Discrimination with us before they can file a job discrimination lawsuit against their employer."
    }, {
      question_statement: "Who do all of the laws enforced by EEOC require employees and applicants to file a Charge of Discrimination with us before they can file a job discrimination lawsuit against?",
      question_type: "MCQ",
      answer: "employer",
      options: ["Independent Contractor", "Salaried Employee", "Severance"],
      options_algorithm: "sense2vec",
      extra_options: ["Business Owner", "Taxable Benefit", "Benefit Package"],
      context: "All of the laws enforced by EEOC, except for the Equal Pay Act, require employees and applicants to file a Charge of Discrimination with us before they can file a job discrimination lawsuit against their employer."
    }, {
      question_statement: "Who is the charging party?",
      question_type: "MCQ",
      answer: "employer",
      options: ["Independent Contractor", "Salaried Employee", "Severance"],
      options_algorithm: "sense2vec",
      extra_options: ["Business Owner", "Taxable Benefit", "Benefit Package"],
      context: "The charging party has alleged that an employer has discriminated against him or her and it is the EEOC's job to investigate the matter to determine whether there is reasonable cause to believe that discrimination has occurred."
    }, {
      question_statement: "What is the charge against an employer?",
      question_type: "MCQ",
      answer: "discrimination",
      options: ["Prejudice", "Minority Groups", "Unequal Treatment"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "The charging party has alleged that an employer has discriminated against him or her and it is the EEOC's job to investigate the matter to determine whether there is reasonable cause to believe that discrimination has occurred. The fact that the EEOC has taken a charge does not mean that the government is accusing anyone of discrimination."
    }, {
      question_statement: "What is the EEOC taking?",
      question_type: "MCQ",
      answer: "charge",
      options: ["Charging", "Pay", "Flat Fee"],
      options_algorithm: "sense2vec",
      extra_options: ["Convenience Fee"],
      context: "The fact that the EEOC has taken a charge does not mean that the government is accusing anyone of discrimination."
    }, {
      question_statement: "What is the name of the organization that collects employee data from some employers?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "Other Requirements The laws enforced by EEOC require employers to keep certain records, regardless of whether a charge has been filed against them. The EEOC also collects workforce data from some employers, regardless of whether a charge has been filed against the company."
    }, {
      question_statement: "Who has additional recordkeeping obligations when a charge has been filed?",
      question_type: "MCQ",
      answer: "employers",
      options: ["Employment", "Job Seekers", "Government Jobs"],
      options_algorithm: "sense2vec",
      extra_options: ["Prospective Employees", "Business Owners", "Unpaid Internships"],
      context: "Other Requirements The laws enforced by EEOC require employers to keep certain records, regardless of whether a charge has been filed against them. The EEOC also collects workforce data from some employers, regardless of whether a charge has been filed against the company. When a charge has been filed, employers have additional recordkeeping obligations."
    }, {
      question_statement: "What are the federal laws prohibiting?",
      question_type: "MCQ",
      answer: "job discrimination",
      options: ["Housing Discrimination", "Discriminatory Practices"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Employers are required to post notices describing the Federal laws prohibiting job discrimination based on race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information."
    }, {
      question_statement: "What are the laws that prohibit discrimination based on race, religion, sex, national origin, age, disability, and genetic information?",
      question_type: "MCQ",
      answer: "federal laws",
      options: ["State Laws", "Federal Courts"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Employers are required to post notices describing the Federal laws prohibiting job discrimination based on race, color, religion, sex (including pregnancy), national origin, age (40 or older), disability or genetic information."
    }, {
      question_statement: "What is the website for small businesses?",
      question_type: "MCQ",
      answer: "website",
      options: ["Site", "Webpage"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Small Businesses While the information in this section of our website applies to all employers, it has been specifically designed for small businesses which may not have a human resources department or a specialized EEO staff."
    }, {
      question_statement: "What is the most important aspect of the EEOC's laws?",
      question_type: "MCQ",
      answer: "compliance",
      options: ["Enforcement", "Federal Regulations", "Applicable Laws"],
      options_algorithm: "sense2vec",
      extra_options: ["Provision", "Compliant", "Regulatory Agency"],
      context: "Employers who have questions about the laws enforced by EEOC or about compliance with those laws in specific workplace situations may contact one of our small business liaisons for assistance."
    }]
  },
  {
    url: `https://www.eeoc.gov/newsroom/eeoc-adds-new-section-clarifying-when-covid-19-may-be-disability-updating-technical`,
    search: `Coronavirus`,
    snippets: [
      "WASHINGTON – The U.S. Equal Employment Opportunity Commission (EEOC) updated its COVID-19 technical assistance today adding a new section to clarify under what circumstances COVID-19 may be considered a disability under the Americans with Disabilities Act (ADA) and the Rehabilitation Act. EEOC’s new questions and answers focus broadly on COVID-19 and the definition of disability under Title I of the ADA and Section 501 of the Rehabilitation Act, which both address employment discrimination. The updates also provide examples illustrating how an individual diagnosed with COVID-19 or a post-COVID condition could be considered to have a disability under the laws the EEOC enforces. “This update to our COVID-19 information provides an additional resource for employees and employers facing the varied manifestations of COVID-19,” said EEOC Chair Charlotte A. Burrows. “Like effects from other diseases, effects from COVID-19 can lead to a disability protected under the laws the EEOC enforces. Workers with disabilities stemming from COVID-19 are protected from employment discrimination and may be eligible for reasonable accommodations.” Key information includes: In some cases, an applicant’s or employee’s COVID-19 may cause impairments that are themselves disabilities under the ADA, regardless of whether the initial case of COVID-19 itself constituted an actual disability. An applicant or employee whose COVID-19 results in mild symptoms that resolve in a few weeks—with no other consequences—will not have an ADA disability that could make someone eligible to receive a reasonable accommodation. Applicants or employees with disabilities are not automatically entitled to reasonable accommodations under the ADA. They are entitled to a reasonable accommodation when their disability requires it, and the accommodation is not an undue hardship for the employer. But, employers can choose to do more than the ADA requires. An employer risks violating the ADA if it relies on myths, fears, or stereotypes about a condition and prevents an employee’s return to work once the employee is no longer infectious and, therefore, medically able to return without posing a direct threat to others. On July 26, 2021, the Department of Justice (DOJ) and the Department of Health and Human Services (HHS) issued Guidance on ‘Long COVID’ as a Disability Under the ADA, Section 504, and Section 1557. The DOJ/HHS Guidance focuses solely on long COVID. This new EEOC technical assistance focuses more broadly on COVID-19 and does so in the context of Title I of the ADA and section 501 of the Rehabilitation Act, which cover employment. To assist the public, the EEOC has updated its guidance on employment and COVID-19 approximately 20 times throughout the pandemic.",
      "The EEOC advances opportunity in the workplace by enforcing federal laws prohibiting employ­ment discrimination. More information is available at www.eeoc.gov. Stay connected with the latest EEOC news by subscribing to our email updates."
    ],
    questions: [{
      question_statement: "What is the Americans with Disabilities Act?",
      question_type: "MCQ",
      answer: "ada",
      options: ["Reasonable Accommodations", "Osha", "Emotional Support Animals"],
      options_algorithm: "sense2vec",
      extra_options: ["Disabilities Act", "Hipaa", "Mandated", "Federal Guidelines", "California Law", "Texas Law", "Other Statutes"],
      context: "Workers with disabilities stemming from COVID-19 are protected from employment discrimination and may be eligible for reasonable accommodations.” Key information includes: In some cases, an applicant’s or employee’s COVID-19 may cause impairments that are themselves disabilities under the ADA, regardless of whether the initial case of COVID-19 itself constituted an actual disability. Equal Employment Opportunity Commission (EEOC) updated its COVID-19 technical assistance today adding a new section to clarify under what circumstances COVID-19 may be considered a disability under the Americans with Disabilities Act (ADA) and the Rehabilitation Act. An employer risks violating the ADA if it relies on myths, fears, or stereotypes about a condition and prevents an employee’s return to work once the employee is no longer infectious and, therefore, medically able to return without posing a direct threat to others."
    }, {
      question_statement: "What are workers with disabilities stemming from COVID-19 protected from?",
      question_type: "MCQ",
      answer: "employment discrimination",
      options: ["Workplace Discrimination", "Protected Classes"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Workers with disabilities stemming from COVID-19 are protected from employment discrimination and may be eligible for reasonable accommodations.” Key information includes: In some cases, an applicant’s or employee’s COVID-19 may cause impairments that are themselves disabilities under the ADA, regardless of whether the initial case of COVID-19 itself constituted an actual disability. EEOC’s new questions and answers focus broadly on COVID-19 and the definition of disability under Title I of the ADA and Section 501 of the Rehabilitation Act, which both address employment discrimination."
    }, {
      question_statement: "What is the EEOC's technical assistance?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "Equal Employment Opportunity Commission (EEOC) updated its COVID-19 technical assistance today adding a new section to clarify under what circumstances COVID-19 may be considered a disability under the Americans with Disabilities Act (ADA) and the Rehabilitation Act. EEOC’s new questions and answers focus broadly on COVID-19 and the definition of disability under Title I of the ADA and Section 501 of the Rehabilitation Act, which both address employment discrimination. The updates also provide examples illustrating how an individual diagnosed with COVID-19 or a post-COVID condition could be considered to have a disability under the laws the EEOC enforces."
    }, {
      question_statement: "What is the EEOC's website?",
      question_type: "MCQ",
      answer: "eeoc",
      options: ["Nlrb", "Title Vii", "The Department Of Labor"],
      options_algorithm: "sense2vec",
      extra_options: ["Sex Discrimination", "Dol", "State Attorney General", "Federal Court"],
      context: "The EEOC advances opportunity in the workplace by enforcing federal laws prohibiting employment discrimination. Stay connected with the latest EEOC news by subscribing to our email updates. More information is available at www.eeoc.gov."
    }, {
      question_statement: "What is the EEOC's role in promoting opportunity?",
      question_type: "MCQ",
      answer: "workplace",
      options: ["Work Environment", "Fellow Employees", "Office Culture"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "The EEOC advances opportunity in the workplace by enforcing federal laws prohibiting employment discrimination."
    }, {
      question_statement: "Subscribe to the latest EEOC news by using what method?",
      question_type: "MCQ",
      answer: "email",
      options: ["Gmail Address"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Stay connected with the latest EEOC news by subscribing to our email updates."
    }, {
      question_statement: "What does the EEOC prohibit in the workplace?",
      question_type: "MCQ",
      answer: "discrimination",
      options: ["Prejudice", "Minority Groups", "Unequal Treatment"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "The EEOC advances opportunity in the workplace by enforcing federal laws prohibiting employment discrimination."
    }]
  },
  {
    url: `https://www.eeoc.gov/statutes/laws-enforced-eeoc`,
    search: `Title VII`,
    snippets: [
      "Title VII of the Civil Rights Act of 1964 (Title VII) This law makes it illegal to discriminate against someone on the basis of race, color, religion, national origin, or sex. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also requires that employers reasonably accommodate applicants' and employees' sincerely held religious practices, unless doing so would impose an undue hardship on the operation of the employer's business. The Pregnancy Discrimination Act This law amended Title VII to make it illegal to discriminate against a woman because of pregnancy, childbirth, or a medical condition related to pregnancy or childbirth. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The Equal Pay Act of 1963 (EPA) This law makes it illegal to pay different wages to men and women if they perform equal work in the same workplace. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit.",
      "The Age Discrimination in Employment Act of 1967 (ADEA) This law protects people who are 40 or older from discrimination because of age. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. Title I of the Americans with Disabilities Act of 1990 (ADA) This law makes it illegal to discriminate against a qualified person with a disability in the private sector and in state and local governments. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also requires that employers reasonably accommodate the known physical or mental limitations of an otherwise qualified individual with a disability who is an applicant or employee, unless doing so would impose an undue hardship on the operation of the employer's business. Sections 102 and 103 of the Civil Rights Act of 1991 Among other things, this law amends Title VII and the ADA to permit jury trials and compensatory and punitive damage awards in intentional discrimination cases. Sections 501 and 505 of the Rehabilitation Act of 1973 This law makes it illegal to discriminate against a qualified person with a disability in the federal government. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also requires that employers reasonably accommodate the known physical or mental limitations of an otherwise qualified individual with a disability who is an applicant or employee, unless doing so would impose an undue hardship on the operation of the employer's business.",
      "The Genetic Information Nondiscrimination Act of 2008 (GINA) Effective, November 21, 2009. This law makes it illegal to discriminate against employees or applicants because of genetic information. Genetic information includes information about an individual's genetic tests and the genetic tests of an individual's family members, as well as information about any disease, disorder or condition of an individual's family members (i.e. an individual's family medical history). The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit."
    ],
    questions: [{
      question_statement: "What is it called when a person complains about discrimination?",
      question_type: "MCQ",
      answer: "lawsuit",
      options: ["Civil Suit", "Court Case", "Litigation"],
      options_algorithm: "sense2vec",
      extra_options: ["Suing"],
      context: "The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit."
    }, {
      question_statement: "What is it called when a person complains about discrimination?",
      question_type: "MCQ",
      answer: "lawsuit",
      options: ["Civil Suit", "Court Case", "Litigation"],
      options_algorithm: "sense2vec",
      extra_options: ["Suing"],
      context: "The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit."
    }, {
      question_statement: "What is the most common reason for a person to retaliate against a person because they have filed a discrimination complaint, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit?",
      question_type: "MCQ",
      answer: "charge",
      options: ["Charging", "Pay", "Flat Fee"],
      options_algorithm: "sense2vec",
      extra_options: ["Convenience Fee"],
      context: "The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit. The law also makes it illegal to retaliate against a person because the person complained about discrimination, filed a charge of discrimination, or participated in an employment discrimination investigation or lawsuit."
    }, {
      question_statement: "Genetic information includes information about an individual's genetic tests and the genetic tests of an individual's what?",
      question_type: "MCQ",
      answer: "family members",
      options: ["Relatives", "Close Family", "Family/Friends"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Genetic information includes information about an individual's genetic tests and the genetic tests of an individual's family members, as well as information about any disease, disorder or condition of an individual's family members (i.e. Genetic information includes information about an individual's genetic tests and the genetic tests of an individual's family members, as well as information about any disease, disorder or condition of an individual's family members (i.e."
    }, {
      question_statement: "What is genetic information about?",
      question_type: "MCQ",
      answer: "tests",
      options: ["Other Test"],
      options_algorithm: "sense2vec",
      extra_options: [],
      context: "Genetic information includes information about an individual's genetic tests and the genetic tests of an individual's family members, as well as information about any disease, disorder or condition of an individual's family members (i.e. Genetic information includes information about an individual's genetic tests and the genetic tests of an individual's family members, as well as information about any disease, disorder or condition of an individual's family members (i.e."
    }]
  }]

  return s(articles, res)

})

module.exports = router