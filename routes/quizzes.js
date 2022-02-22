const { Router } = require('express')
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args))
const { query } = require('../helpers/mysql.helper.js')

const router = Router()

router.get('/get/questions', async (req, res, next) => {
  // const url = 'https://fbe8-67-141-223-85.ngrok.io/generate/multiple-choice-questions'
  // const response = await fetch(url, { method: 'POST', body: JSON.stringify({ snippets: [
  //   `In the name of his murdered parents, Bruce Wayne wages eternal war on the criminals of Gotham City. He is vengeance. He is the night. He is Batman.`,
  //   `One of the most iconic fictional characters in the world, Batman has dedicated his life to an endless crusade, a war on all criminals in the name of his murdered parents, who were taken from him when he was just a child. Since that tragic night, he has trained his body and mind to near physical perfection to be a self-made Super Hero. He's developed an arsenal of technology that would put most armies to shame. And he's assembled teams of his fellow DC Super Heroes, like the Justice League, the Outsiders and Batman, Incorporated.`,
  //   `A playboy billionaire by day, Bruce Wayne’s double life affords him the comfort of a life without financial worry, a loyal butler-turned-guardian and the perfect base of operations in the ancient network of caves beneath his family’s sprawling estate. By night, however, he sheds all pretense, dons his iconic scalloped cape and pointed cowl and takes to the shadowy streets, skies and rooftops of Gotham City.`
  // ] }),
  //   headers: {'Content-Type': 'application/json'}
  // })
  // const json = await response.json()
  const questions = [{
    "questions": [
        {
            "answer": "Bruce wayne is the father of gotham city.",
            "context": "In the name of his murdered parents, Bruce Wayne wages eternal war on the criminals of Gotham City.",
            "extra_options": [
                "Lex Luthor",
                "Clark Kent",
                "Thomas Wayne",
                "Tony Stark",
                "Oliver Queen",
                "Riddler"
            ],
            "id": 1,
            "options": [
                "Dick Grayson",
                "Batman",
                "Joker"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who is the father of Bruce Wayne?",
            "question_type": "MCQ"
        },
        {
            "answer": "Gotham city",
            "context": "In the name of his murdered parents, Bruce Wayne wages eternal war on the criminals of Gotham City.",
            "extra_options": [
                "Gcpd",
                "Jim Gordon",
                "Harvey Dent",
                "Starling City",
                "Joker",
                "The Court Of Owls"
            ],
            "id": 2,
            "options": [
                "Gotham",
                "Metropolis",
                "Bruce Wayne"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What city is Bruce Wayne fighting in?",
            "question_type": "MCQ"
        },
        {
            "answer": "Batman",
            "context": "One of the most iconic fictional characters in the world, Batman has dedicated his life to an endless crusade, a war on all criminals in the name of his murdered parents, who were taken from him when he was just a child. And he's assembled teams of his fellow DC Super Heroes, like the Justice League, the Outsiders and Batman, Incorporated.",
            "extra_options": [],
            "id": 1,
            "options": [
                "Superman",
                "Nightwing",
                "Deadpool"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the most iconic fictional character in the world?",
            "question_type": "MCQ"
        },
        {
            "answer": "He has trained his body and mind to near physical perfection to be a self-made super hero.",
            "context": "Since that tragic night, he has trained his body and mind to near physical perfection to be a self-made Super Hero.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Super Villain",
                "Comic Book Hero",
                "Total Badass"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the ultimate goal of his life?",
            "question_type": "MCQ"
        },
        {
            "answer": "He's developed an arsenal of technology that would put most armies to shame.",
            "context": "He's developed an arsenal of technology that would put most armies to shame.",
            "extra_options": [
                "Man Utd",
                "Barca"
            ],
            "id": 3,
            "options": [
                "Chelsea",
                "Liverpool",
                "Tottenham"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What technology did he develop that would put most armies to shame?",
            "question_type": "MCQ"
        },
        {
            "answer": "He has trained his body and mind to near physical perfection to be a self-made super hero.",
            "context": "Since that tragic night, he has trained his body and mind to near physical perfection to be a self-made Super Hero.",
            "extra_options": [
                "Striving",
                "Excellence"
            ],
            "id": 4,
            "options": [
                "Beauty",
                "Flawlessness",
                "Perfect"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What has he trained his body and mind to achieve?",
            "question_type": "MCQ"
        },
        {
            "answer": "He sheds all pretense, dons his iconic scalloped cape and cowl and takes to the shadowy streets, skies and rooftops of gotham city.",
            "context": "By night, however, he sheds all pretense, dons his iconic scalloped cape and pointed cowl and takes to the shadowy streets, skies and rooftops of Gotham City.",
            "extra_options": [
                "Cultural Icon",
                "Unique",
                "Understated"
            ],
            "id": 1,
            "options": [
                "Recognizable",
                "Distinctive",
                "Throwback"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the scalloped cape and cowl that he wears at night?",
            "question_type": "MCQ"
        },
        {
            "answer": "The most shadowy part of gotham city is the sky and rooftops.",
            "context": "By night, however, he sheds all pretense, dons his iconic scalloped cape and pointed cowl and takes to the shadowy streets, skies and rooftops of Gotham City.",
            "extra_options": [
                "Cliffs",
                "Balconies",
                "Alleyways"
            ],
            "id": 2,
            "options": [
                "Roof Top",
                "Hilltops",
                "Tall Buildings"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the most shadowy part of Gotham City?",
            "question_type": "MCQ"
        },
        {
            "answer": "The iconic scalloped cape he wears at night.",
            "context": "By night, however, he sheds all pretense, dons his iconic scalloped cape and pointed cowl and takes to the shadowy streets, skies and rooftops of Gotham City.",
            "extra_options": [
                "Top Hat",
                "Tunic",
                "Angel Wings",
                "Robes",
                "Getup",
                "Jumpsuit"
            ],
            "id": 3,
            "options": [
                "Mask",
                "Headpiece",
                "Bandana"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the iconic scalloped cape he wears at night?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "songwriter",
            "context": "Michael Joseph Jackson (August 29, 1958 – June 25, 2009) was an American singer, songwriter and dancer.",
            "extra_options": [
                "Composer",
                "Max Martin",
                "Frontman"
            ],
            "id": 1,
            "options": [
                "Lyricist",
                "Singer",
                "Multi-Instrumentalist"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was Michael Jackson's career?",
            "question_type": "MCQ"
        },
        {
            "answer": "august",
            "context": "Michael Joseph Jackson (August 29, 1958 – June 25, 2009) was an American singer, songwriter and dancer.",
            "extra_options": [
                "March",
                "Last June"
            ],
            "id": 2,
            "options": [
                "July",
                "September",
                "April"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "When was Michael Joseph Jackson born?",
            "question_type": "MCQ"
        },
        {
            "answer": "dancer",
            "context": "Michael Joseph Jackson (August 29, 1958 – June 25, 2009) was an American singer, songwriter and dancer.",
            "extra_options": [
                "Business Woman",
                "Choreographer",
                "Circus Performer"
            ],
            "id": 3,
            "options": [
                "Ballerina",
                "Gymnast",
                "Singer"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was Michael Jackson's career?",
            "question_type": "MCQ"
        },
        {
            "answer": "thriller",
            "context": "His music videos, including those for 'Beat It', 'Billie Jean' and 'Thriller' from his 1982 album Thriller, are credited with breaking racial barriers and transforming the medium into an artform and promotional tool. His music videos, including those for 'Beat It', 'Billie Jean' and 'Thriller' from his 1982 album Thriller, are credited with breaking racial barriers and transforming the medium into an artform and promotional tool. Thriller became the best-selling album of all time, while Bad was the first album to produce five U.S.",
            "extra_options": [
                "Sci-Fi"
            ],
            "id": 1,
            "options": [
                "Usa:R](Https://En.Wikipedia.Org/Wiki/Motion Picture Association Of America Film Rating System#Ratings",
                "H",
                "Usa:Tv"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the best selling album of all time?",
            "question_type": "MCQ"
        },
        {
            "answer": "tito",
            "context": "The eighth child of the Jackson family, Jackson made his professional debut in 1964 with his elder brothers Jackie, Tito, Jermaine and Marlon as a member of the Jackson 5 (later known as the Jacksons).",
            "extra_options": [
                "Fidel",
                "Georges",
                "Lineker",
                "Huerta",
                "Chavez"
            ],
            "id": 3,
            "options": [
                "Marcos",
                "Nasser",
                "Mussolini"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the name of the elder brother of Jackson Jackson?",
            "question_type": "MCQ"
        },
        {
            "answer": "behalf",
            "context": "In both cases, the FBI found no evidence of criminal conduct on Jackson's behalf in either case.",
            "extra_options": [
                "Obligation",
                "Legal Representative",
                "Government Official",
                "Whomever",
                "Urging",
                "Good Faith"
            ],
            "id": 2,
            "options": [
                "Official Capacity",
                "Behest",
                "Incumbent"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "In both cases, the FBI found no evidence of criminal conduct on Jackson's what?",
            "question_type": "MCQ"
        },
        {
            "answer": "controversy",
            "context": "From the late 1980s, Jackson became a figure of controversy and speculation due to his changing appearance, relationships, behavior and lifestyle.",
            "extra_options": [
                "Negative Press",
                "Backlash"
            ],
            "id": 3,
            "options": [
                "Scandal",
                "Media Attention",
                "Controversies"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was Jackson's reputation for in the late 1980s?",
            "question_type": "MCQ"
        },
        {
            "answer": "relationships",
            "context": "From the late 1980s, Jackson became a figure of controversy and speculation due to his changing appearance, relationships, behavior and lifestyle.",
            "extra_options": [],
            "id": 4,
            "options": [
                "Friendships"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the main reason for Jackson's change in appearance?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "seniors",
            "context": "We have various “curriculum” wokshops (Exercise Only, Falls Prevention, and Nutrition) some of which are more appropriate than others for your particular group of seniors, depending on their level of physical and cognitive ability. Bingocize® combines exercise and health information with the familiar game of bingo, which has shown to be a great, fun way to get seniors moving and socializing.",
            "extra_options": [
                "Juniors",
                "First Years"
            ],
            "id": 1,
            "options": [
                "Freshmen",
                "Sophomores",
                "High School Students"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the most appropriate age group for bingocize?",
            "question_type": "MCQ"
        },
        {
            "answer": "ability levels",
            "context": "The program targets sedentary older adults at all ability levels, in a variety of settings, including certified nursing facilities, assisted living, independent living, and community senior centers.",
            "extra_options": [
                "Individual Classes",
                "Team Compositions"
            ],
            "id": 1,
            "options": [
                "Skill Levels",
                "Certain Skills",
                "Different Talents"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What are the sedentary older adults at?",
            "question_type": "MCQ"
        },
        {
            "answer": "winners",
            "context": "Small prizes (some included with program) are awarded to winners.",
            "extra_options": [
                "Actual Winner"
            ],
            "id": 1,
            "options": [
                "Losers",
                "Prizes",
                "Finalists"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who gets small prizes?",
            "question_type": "MCQ"
        },
        {
            "answer": "exercises",
            "context": "Participants rest while numbers are called for the bingo game, then complete more strategically inserted exercises or health education questions, rest during number calling, and so on. Participants (Bingocizers®) complete a series of strategically inserted exercises designed to increase or decrease the intensity and volume of exercise. Additional games are played until all planned exercises are completed.",
            "extra_options": [
                "Basic Lifts"
            ],
            "id": 3,
            "options": [
                "Excersises",
                "Muscle Groups",
                "Proper Form"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What are strategically inserted exercises?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "humans",
            "context": "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.",
            "extra_options": [],
            "id": 1,
            "options": [
                "Other Species",
                "Living Things"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the natural intelligence of animals?",
            "question_type": "MCQ"
        },
        {
            "answer": "environment",
            "context": "Leading AI textbooks define the field as the study of 'intelligent agents': any system that perceives its environment and takes actions that maximize its chance of achieving its goals.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Enviorment",
                "Ecosystems"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What does intelligent agents perceive?",
            "question_type": "MCQ"
        },
        {
            "answer": "intelligence",
            "context": "Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans. Artificial intelligence (AI) is intelligence demonstrated by machines, as opposed to natural intelligence displayed by animals including humans.",
            "extra_options": [
                "Mental Ability"
            ],
            "id": 3,
            "options": [
                "Intellect",
                "Smartness",
                "Sophistication"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is artificial intelligence?",
            "question_type": "MCQ"
        },
        {
            "answer": "humans",
            "context": "Some popular accounts use the term 'artificial intelligence' to describe machines that mimic 'cognitive' functions that humans associate with the human mind, such as 'learning' and 'problem solving', however, this definition is rejected by major AI researchers.",
            "extra_options": [],
            "id": 1,
            "options": [
                "Other Species",
                "Living Things"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What do some popular accounts use the term artificial intelligence to describe machines that mimic cognitive functions that humans associate with the human mind?",
            "question_type": "MCQ"
        },
        {
            "answer": "databases",
            "context": "AI research has tried and discarded many different approaches since its founding, including simulating the brain, modeling human problem solving, formal logic, large databases of knowledge and imitating animal behavior.",
            "extra_options": [
                "Database System",
                "Querying",
                "Sharepoint"
            ],
            "id": 1,
            "options": [
                "Sql",
                "Webservers",
                "Sql Database"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the most important thing that AI has tried to replicate since its founding?",
            "question_type": "MCQ"
        },
        {
            "answer": "funding",
            "context": "Artificial intelligence was founded as an academic discipline in 1956, and in the years since has experienced several waves of optimism, followed by disappointment and the loss of funding (known as an 'AI winter'), followed by new approaches, success and renewed funding. Artificial intelligence was founded as an academic discipline in 1956, and in the years since has experienced several waves of optimism, followed by disappointment and the loss of funding (known as an 'AI winter'), followed by new approaches, success and renewed funding.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Government Grants",
                "Funded",
                "Private Donations"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the loss of artificial intelligence?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "simba",
            "context": "The all-star cast includes Donald Glover as Simba, Beyoncé Knowles-Carter as Nala, James Earl Jones as Mufasa, Chiwetel Ejiofor as Scar, Seth Rogen as Pumbaa and Billy Eichner as Timon, and utilizes pioneering filmmaking techniques to bring treasured characters to life in a whole new way. With help from a curious pair of newfound friends, Simba will have to figure out how to grow up and take back what is rightfully his. The battle for Pride Rock is ravaged with betrayal, tragedy and drama, ultimately resulting in Simba’s exile.",
            "extra_options": [
                "Dog"
            ],
            "id": 1,
            "options": [
                "Mufasa",
                "Bambi",
                "Kovu"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who is Donald Glover?",
            "question_type": "MCQ"
        },
        {
            "answer": "mufasa",
            "context": "The all-star cast includes Donald Glover as Simba, Beyoncé Knowles-Carter as Nala, James Earl Jones as Mufasa, Chiwetel Ejiofor as Scar, Seth Rogen as Pumbaa and Billy Eichner as Timon, and utilizes pioneering filmmaking techniques to bring treasured characters to life in a whole new way. Simba idolizes his father, King Mufasa, and takes to heart his own royal destiny. Scar, Mufasa’s brother—and former heir to the throne—has plans of his own.",
            "extra_options": [
                "Lion King",
                "Scar"
            ],
            "id": 2,
            "options": [
                "Simba",
                "Nala",
                "Rafiki"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who is Simba's father?",
            "question_type": "MCQ"
        },
        {
            "answer": "savanna",
            "context": "Disney’s film journeys to the African savanna where a future king is born.",
            "extra_options": [
                "Plains",
                "Wild Horses",
                "Herds",
                "Antelopes",
                "Vegetation"
            ],
            "id": 3,
            "options": [
                "Grasslands",
                "Forests",
                "Mammoths"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Where is a future king born?",
            "question_type": "MCQ"
        },
        {
            "answer": "aladdin",
            "context": "Directed by Guy Ritchie, who brings his singular flair for fast-paced, visceral action to the fictitious port city of Agrabah, “Aladdin” is written by John August and Ritchie based on Disney’s “Aladdin.” The film stars Will Smith as the Genie; Mena Massoud as Aladdin; Naomi Scott as Jasmine; Marwan Kenzari as Jafar; Navid Negahban as the Sultan; Nasim Pedrad as Dalia; Billy Magnussen as Prince Anders; and Numan Acar as Hakim. Directed by Guy Ritchie, who brings his singular flair for fast-paced, visceral action to the fictitious port city of Agrabah, “Aladdin” is written by John August and Ritchie based on Disney’s “Aladdin.” The film stars Will Smith as the Genie; Mena Massoud as Aladdin; Naomi Scott as Jasmine; Marwan Kenzari as Jafar; Navid Negahban as the Sultan; Nasim Pedrad as Dalia; Billy Magnussen as Prince Anders; and Numan Acar as Hakim. Directed by Guy Ritchie, who brings his singular flair for fast-paced, visceral action to the fictitious port city of Agrabah, “Aladdin” is written by John August and Ritchie based on Disney’s “Aladdin.” The film stars Will Smith as the Genie; Mena Massoud as Aladdin; Naomi Scott as Jasmine; Marwan Kenzari as Jafar; Navid Negahban as the Sultan; Nasim Pedrad as Dalia; Billy Magnussen as Prince Anders; and Numan Acar as Hakim.",
            "extra_options": [
                "Cinderella",
                "Maleficent",
                "Mary Poppins"
            ],
            "id": 1,
            "options": [
                "Little Mermaid",
                "Mulan",
                "Peter Pan"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What role does Mena Massoud play in the film, \"Aladdin\"?",
            "question_type": "MCQ"
        },
        {
            "answer": "guy ritchie",
            "context": "Directed by Guy Ritchie, who brings his singular flair for fast-paced, visceral action to the fictitious port city of Agrabah, “Aladdin” is written by John August and Ritchie based on Disney’s “Aladdin.” The film stars Will Smith as the Genie; Mena Massoud as Aladdin; Naomi Scott as Jasmine; Marwan Kenzari as Jafar; Navid Negahban as the Sultan; Nasim Pedrad as Dalia; Billy Magnussen as Prince Anders; and Numan Acar as Hakim.",
            "extra_options": [
                "Danny Boyle",
                "Chris Nolan",
                "Taxi Driver",
                "Steven Soderbergh",
                "Fincher",
                "Wes Anderson"
            ],
            "id": 3,
            "options": [
                "Martin Scorsese",
                "Quentin Tarantino",
                "Spike Jonze"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who directed the movie \"Aladdin\"?",
            "question_type": "MCQ"
        },
        {
            "answer": "walt disney animation studios",
            "context": "Walt Disney Animation Studios, the studio behind 'Tangled' and 'Wreck-It Ralph,' presents 'Frozen,' a stunning big-screen comedy adventure.",
            "extra_options": [
                "Dreamworks",
                "Warner Bros.",
                "Lasseter",
                "Studio Ghibli",
                "Animated Film",
                "Miramax"
            ],
            "id": 1,
            "options": [
                "Pixar",
                "Walt Disney Pictures",
                "20Th Century Fox"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the studio behind 'Tangled' and 'Wreck-It Ralph'?",
            "question_type": "MCQ"
        },
        {
            "answer": "kristen bell",
            "context": "Fearless optimist Anna (voice of Kristen Bell) sets off on an epic journey—teaming up with rugged mountain man Kristoff (voice of Jonathan Groff) and his loyal reindeer Sven—to find her sister Elsa (voice of Idina Menzel), whose icy powers have trapped the kingdom of Arendelle in eternal winter.",
            "extra_options": [
                "Kristen Stewart",
                "Charlie Day",
                "Melissa Mccarthy",
                "Olivia Wilde",
                "Scarlett Johansson",
                "Ellen Page"
            ],
            "id": 2,
            "options": [
                "Amy Adams",
                "Zooey Deschanel",
                "Emma Stone"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who is Anna's voice actor?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "tesla coil",
            "context": "In 1891 he invented the Tesla coil, an induction coil widely used in radio technology.",
            "extra_options": [
                "Capacitor",
                "Vacuum Tubes",
                "Solar Panel",
                "Power Source",
                "Faraday Cage",
                "Servos",
                "Small Generator"
            ],
            "id": 2,
            "options": [
                "Transformer",
                "Electromagnets",
                "Computer Fan"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was the name of the induction coil invented by Tesla in 1891?",
            "question_type": "MCQ"
        },
        {
            "answer": "dynamos",
            "context": "He immigrated to the United States in 1884 and sold the patent rights to his system of alternating-current dynamos, transformers, and motors to George Westinghouse.",
            "extra_options": [
                "Te Machines",
                "Capacitor Banks",
                "Conduits",
                "Smelteries",
                "Magma Crucible"
            ],
            "id": 3,
            "options": [
                "Tesseracts",
                "Big Reactor",
                "Energy Cells"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the name of the system he created in 1884?",
            "question_type": "MCQ"
        },
        {
            "answer": "tesla",
            "context": "Tesla was from a family of Serbian origin.",
            "extra_options": [
                "Electric Cars",
                "Musk"
            ],
            "id": 1,
            "options": [
                "Model S",
                "Other Automakers",
                "Car Company"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was Tesla's name?",
            "question_type": "MCQ"
        },
        {
            "answer": "creativity",
            "context": "As he matured, he displayed remarkable imagination and creativity as well as a poetic touch.",
            "extra_options": [
                "Technical Skill"
            ],
            "id": 2,
            "options": [
                "Creativeness",
                "Ingenuity",
                "Dynamism"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was his greatest talent as a child?",
            "question_type": "MCQ"
        },
        {
            "answer": "origin",
            "context": "Tesla was from a family of Serbian origin.",
            "extra_options": [],
            "id": 3,
            "options": [
                "Ancestry",
                "Birth Place",
                "Proper Name"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the origin of Tesla?",
            "question_type": "MCQ"
        },
        {
            "answer": "graz",
            "context": "At Graz he first saw the Gramme dynamo, which operated as a generator and, when reversed, became an electric motor, and he conceived a way to use alternating current to advantage. Training for an engineering career, he attended the Technical University at Graz, Austria, and the University of Prague.",
            "extra_options": [
                "Düsseldorf",
                "Innsbruck",
                "Leipzig",
                "Helsinki",
                "München"
            ],
            "id": 1,
            "options": [
                "Heidelberg",
                "Bonn",
                "Prague"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Where did he see the Gramme dynamo?",
            "question_type": "MCQ"
        },
        {
            "answer": "tesla",
            "context": "In 1882 Tesla went to work in Paris for the Continental Edison Company, and, while on assignment to Strassburg in 1883, he constructed, after work hours, his first induction motor. Tesla sailed for America in 1884, arriving in New York with four cents in his pocket, a few of his own poems, and calculations for a flying machine.",
            "extra_options": [
                "Electric Cars",
                "Musk"
            ],
            "id": 2,
            "options": [
                "Model S",
                "Other Automakers",
                "Car Company"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was Tesla's nickname?",
            "question_type": "MCQ"
        },
        {
            "answer": "induction motor",
            "context": "Later, at Budapest, he visualized the principle of the rotating magnetic field and developed plans for an induction motor that would become his first step toward the successful utilization of alternating current. In 1882 Tesla went to work in Paris for the Continental Edison Company, and, while on assignment to Strassburg in 1883, he constructed, after work hours, his first induction motor.",
            "extra_options": [
                "Regenerative Braking",
                "Power Output",
                "Permanent Magnets",
                "Internal Combustion Engine",
                "Magnetic Induction"
            ],
            "id": 3,
            "options": [
                "Electric Motor",
                "Drive System",
                "Turbocharger"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What was Tesla's first step towards the successful use of alternating current?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "mind uploading",
            "context": "Mind uploading, also known as whole brain emulation (WBE), is the theoretical futuristic process of scanning a physical structure of the brain accurately enough to create an emulation of the mental state (including long-term memory and 'self') and transferring or copying it to a computer in a digital form.",
            "extra_options": [
                "Artificial Intelligence",
                "Ftl Travel",
                "Nanotech",
                "Simulated Universe",
                "Quantum Computing"
            ],
            "id": 1,
            "options": [
                "Strong Ai",
                "Technological Singularity",
                "Human Consciousness"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the process of scanning a physical structure of the brain accurately enough to create an emulation of the mental state (including long-term memory and'self') and transferring it to a computer in a digital form?",
            "question_type": "MCQ"
        },
        {
            "answer": "supercomputers",
            "context": "Substantial mainstream research in related areas is being conducted in animal brain mapping and simulation, development of faster supercomputers, virtual reality, brain–computer interfaces, connectomics, and information extraction from dynamically functioning brains.",
            "extra_options": [
                "Simulations"
            ],
            "id": 1,
            "options": [
                "Computing Power",
                "Super Computer",
                "Mainframes"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the fastest computer in the world?",
            "question_type": "MCQ"
        },
        {
            "answer": "mind uploading",
            "context": "Mind uploading may potentially be accomplished by either of two methods: copy-and-upload or copy-and-delete by gradual replacement of neurons (which can be considered as a gradual destructive uploading), until the original organic brain no longer exists and a computer program emulating the brain takes control over the body. In the case of the former method, mind uploading would be achieved by scanning and mapping the salient features of a biological brain, and then by storing and copying, that information state into a computer system or another computational device.",
            "extra_options": [
                "Artificial Intelligence",
                "Ftl Travel",
                "Nanotech",
                "Simulated Universe",
                "Quantum Computing"
            ],
            "id": 1,
            "options": [
                "Strong Ai",
                "Technological Singularity",
                "Human Consciousness"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the process of scanning and mapping the salient features of a biological brain?",
            "question_type": "MCQ"
        },
        {
            "answer": "copy",
            "context": "Mind uploading may potentially be accomplished by either of two methods: copy-and-upload or copy-and-delete by gradual replacement of neurons (which can be considered as a gradual destructive uploading), until the original organic brain no longer exists and a computer program emulating the brain takes control over the body. Mind uploading may potentially be accomplished by either of two methods: copy-and-upload or copy-and-delete by gradual replacement of neurons (which can be considered as a gradual destructive uploading), until the original organic brain no longer exists and a computer program emulating the brain takes control over the body.",
            "extra_options": [],
            "id": 3,
            "options": [
                "Copies"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Mind uploading can be accomplished by either of two methods: copy-and-upload or copy-and-delete by gradual replacement of neurons.",
            "question_type": "MCQ"
        },
        {
            "answer": "brain",
            "context": "Mind uploading may potentially be accomplished by either of two methods: copy-and-upload or copy-and-delete by gradual replacement of neurons (which can be considered as a gradual destructive uploading), until the original organic brain no longer exists and a computer program emulating the brain takes control over the body. Mind uploading may potentially be accomplished by either of two methods: copy-and-upload or copy-and-delete by gradual replacement of neurons (which can be considered as a gradual destructive uploading), until the original organic brain no longer exists and a computer program emulating the brain takes control over the body. In the case of the former method, mind uploading would be achieved by scanning and mapping the salient features of a biological brain, and then by storing and copying, that information state into a computer system or another computational device.",
            "extra_options": [
                "Neural Pathways",
                "Synapses",
                "Cerebellum"
            ],
            "id": 4,
            "options": [
                "Nervous System",
                "Frontal Lobe",
                "Sensory Input"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the original organic brain?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "chromosome",
            "context": "Telomeres are made of repetitive sequences of non-coding DNA that protect the chromosome from damage. A telomere is the end of a chromosome.",
            "extra_options": [],
            "id": 1,
            "options": [
                "Gene",
                "Defective Gene",
                "Alleles"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What does a telomere protect?",
            "question_type": "MCQ"
        },
        {
            "answer": "telomeres",
            "context": "Telomeres are made of repetitive sequences of non-coding DNA that protect the chromosome from damage. Eventually, the telomeres become so short that the cell can no longer divide. Each time a cell divides, the telomeres become shorter.",
            "extra_options": [
                "Normal Cells",
                "Dna Damage",
                "Apoptosis"
            ],
            "id": 2,
            "options": [
                "Telomerase",
                "Cell Division",
                "Senescence"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What are the repetitive sequences of non-coding DNA that protect the chromosome from damage?",
            "question_type": "MCQ"
        },
        {
            "answer": "cell",
            "context": "Eventually, the telomeres become so short that the cell can no longer divide. Each time a cell divides, the telomeres become shorter.",
            "extra_options": [],
            "id": 4,
            "options": [
                "Mitochondria"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "When a cell divides, the telomeres become shorter and the cell can no longer divide?",
            "question_type": "MCQ"
        },
        {
            "answer": "chromosomes",
            "context": "Along the chromosomes, which are long pieces of DNA...when you look at them as a picture, they look like lines.",
            "extra_options": [
                "Phenotype"
            ],
            "id": 1,
            "options": [
                "Gametes",
                "Y Chromosome",
                "Sex Cells"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What are long pieces of DNA?",
            "question_type": "MCQ"
        },
        {
            "answer": "cancer cells",
            "context": "And one of the interesting features that's understood now about telomeres is that in cancer cells, which have a more infinite capacity for self-division, one of the important changes that they make is that they keep their telomeres long, so that molecular clock goes away and those cells can keep dividing, even though they should get to the end of their lifespan. And that's one of the ways in which the cancer cells basically trick the human body into thinking that they should still keep replicating.",
            "extra_options": [],
            "id": 3,
            "options": [
                "Cancerous Cells",
                "Apoptosis",
                "Immune Response"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What cells have a more infinite capacity for self-division?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "quantum physics",
            "context": "Quantum physics is the study of matter and energy at the most fundamental level.",
            "extra_options": [
                "Cosmology",
                "Relativity",
                "Qft"
            ],
            "id": 2,
            "options": [
                "Quantum Mechanics",
                "String Theory",
                "Modern Physics"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the study of matter and energy at the most fundamental level?",
            "question_type": "MCQ"
        },
        {
            "answer": "properties",
            "context": "It aims to uncover the properties and behaviors of the very building blocks of nature.",
            "extra_options": [],
            "id": 4,
            "options": [
                "Single Property",
                "Objects",
                "I.E."
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What are the building blocks of nature?",
            "question_type": "MCQ"
        },
        {
            "answer": "photons",
            "context": "While many quantum experiments examine very small objects, such as electrons and photons, quantum phenomena are all around us, acting on every scale.",
            "extra_options": [
                "Charged Particles",
                "Normal Matter",
                "Em Radiation"
            ],
            "id": 1,
            "options": [
                "Single Photon",
                "Light Waves",
                "Electrons"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the most common quantum phenomenon?",
            "question_type": "MCQ"
        },
        {
            "answer": "impression",
            "context": "This may give the wrong impression that quantum phenomena are bizarre or otherworldly.",
            "extra_options": [
                "That",
                "General Assumption"
            ],
            "id": 3,
            "options": [
                "Evidently",
                "Assumed",
                "Actually"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the wrong impression that quantum phenomena are bizarre?",
            "question_type": "MCQ"
        },
        {
            "answer": "gravity",
            "context": "Physicists are exploring the potential of quantum science to transform our view of gravity and its connection to space and time.",
            "extra_options": [],
            "id": 1,
            "options": [
                "Gravitational Force",
                "Angular Momentum",
                "Air Resistance"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is quantum science trying to change our view of?",
            "question_type": "MCQ"
        },
        {
            "answer": "biology",
            "context": "Quantum discoveries have been incorporated into our foundational understanding of materials, chemistry, biology, and astronomy.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Biochemistry",
                "Neuroscience",
                "Sociology"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the most important astronomy field that has quantum discoveries been incorporated into?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "block chain",
            "context": "The integrity and the chronological order of the block chain are enforced with cryptography. The block chain is a shared public ledger on which the entire Bitcoin network relies. All confirmed transactions are included in the block chain.",
            "extra_options": [
                "Private Keys",
                "Factom",
                "Blockchain.Info"
            ],
            "id": 1,
            "options": [
                "Bitcoin Blockchain",
                "Public Ledger",
                "Transaction Data"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the shared public ledger on which the entire Bitcoin network relies?",
            "question_type": "MCQ"
        },
        {
            "answer": "spender",
            "context": "It allows Bitcoin wallets to calculate their spendable balance so that new transactions can be verified thereby ensuring they're actually owned by the spender.",
            "extra_options": [
                "Cluster Arrow",
                "Sweeping Wind",
                "Area Damage"
            ],
            "id": 2,
            "options": [
                "Multishot",
                "Fire Rune",
                "Rov"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who owns the Bitcoin wallet?",
            "question_type": "MCQ"
        },
        {
            "answer": "cryptography",
            "context": "The integrity and the chronological order of the block chain are enforced with cryptography.",
            "extra_options": [
                "Encryption Algorithms",
                "Big Data",
                "Quantum Computing",
                "Crypto"
            ],
            "id": 3,
            "options": [
                "Computer Security",
                "Distributed Systems",
                "Machine Learning"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "How are the integrity and chronological order of the block chain enforced?",
            "question_type": "MCQ"
        },
        {
            "answer": "bitcoin wallets",
            "context": "Bitcoin wallets keep a secret piece of data called a private key or seed, which is used to sign transactions, providing a mathematical proof that they have come from the owner of the wallet. A transaction is a transfer of value between Bitcoin wallets that gets included in the block chain.",
            "extra_options": [
                "Mycelium",
                "Coinbase",
                "Centralized Service",
                "Payment Processors"
            ],
            "id": 1,
            "options": [
                "Online Wallets",
                "Private Keys",
                "Blockchain.Info"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What keeps a secret piece of data called a private key or seed?",
            "question_type": "MCQ"
        },
        {
            "answer": "block chain",
            "context": "A transaction is a transfer of value between Bitcoin wallets that gets included in the block chain.",
            "extra_options": [
                "Private Keys",
                "Factom",
                "Blockchain.Info"
            ],
            "id": 2,
            "options": [
                "Bitcoin Blockchain",
                "Public Ledger",
                "Transaction Data"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the value of a transaction between Bitcoin wallets that gets included in?",
            "question_type": "MCQ"
        },
        {
            "answer": "transaction",
            "context": "A transaction is a transfer of value between Bitcoin wallets that gets included in the block chain. The signature also prevents the transaction from being altered by anybody once it has been issued.",
            "extra_options": [],
            "id": 3,
            "options": [
                "Payment",
                "Money Transfer",
                "Coinbase Account"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the transfer of value between Bitcoin wallets that gets included in the block chain?",
            "question_type": "MCQ"
        },
        {
            "answer": "signature",
            "context": "The signature also prevents the transaction from being altered by anybody once it has been issued.",
            "extra_options": [
                "Official Document",
                "Return Address",
                "Letterhead",
                "Handwritten",
                "Business Card"
            ],
            "id": 4,
            "options": [
                "Stamp",
                "Photocopy",
                "Id Number"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What prevents a transaction from being altered once it has been issued?",
            "question_type": "MCQ"
        },
        {
            "answer": "block chain",
            "context": "It enforces a chronological order in the block chain, protects the neutrality of the network, and allows different computers to agree on the state of the system. Mining also creates the equivalent of a competitive lottery that prevents any individual from easily adding new blocks consecutively to the block chain. In this way, no group or individuals can control what is included in the block chain or replace parts of the block chain to roll back their own spends.",
            "extra_options": [
                "Private Keys",
                "Factom",
                "Blockchain.Info"
            ],
            "id": 1,
            "options": [
                "Bitcoin Blockchain",
                "Public Ledger",
                "Transaction Data"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Mining enforces chronological order in what?",
            "question_type": "MCQ"
        },
        {
            "answer": "transactions",
            "context": "To be confirmed, transactions must be packed in a block that fits very strict cryptographic rules that will be verified by the network. Mining is a distributed consensus system that is used to confirm pending transactions by including them in the block chain.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Bitcoin Transaction",
                "Blockchain",
                "Public Ledger"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What must be packed in a block that fits very strict cryptographic rules that will be verified by the network?",
            "question_type": "MCQ"
        },
        {
            "answer": "mining",
            "context": "Mining also creates the equivalent of a competitive lottery that prevents any individual from easily adding new blocks consecutively to the block chain. Mining is a distributed consensus system that is used to confirm pending transactions by including them in the block chain.",
            "extra_options": [],
            "id": 3,
            "options": [
                "Mine",
                "Prospecting",
                "Trade Runs"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the equivalent of a competitive lottery?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "elon musk",
            "context": "Elon Musk is known for his high-profile companies like Tesla and SpaceX, but the billionaire also has a handful of unusual ventures.",
            "extra_options": [
                "Richard Branson",
                "Bill Gates",
                "Jeff Bezos"
            ],
            "id": 1,
            "options": [
                "Musk",
                "Elon",
                "Space X"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who is known for his high profile companies like Tesla and SpaceX?",
            "question_type": "MCQ"
        },
        {
            "answer": "tesla",
            "context": "Elon Musk is known for his high-profile companies like Tesla and SpaceX, but the billionaire also has a handful of unusual ventures.",
            "extra_options": [
                "Electric Cars",
                "Musk"
            ],
            "id": 2,
            "options": [
                "Model S",
                "Other Automakers",
                "Car Company"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the name of the company that Elon Musk founded?",
            "question_type": "MCQ"
        },
        {
            "answer": "skull",
            "context": "The chip Neuralink is developing is about the size of a coin, and would be embedded in a person's skull.",
            "extra_options": [
                "Chest Cavity",
                "Gash",
                "Bone",
                "Metal Rod",
                "Rib Cage",
                "Tree Trunk"
            ],
            "id": 1,
            "options": [
                "Eye Socket",
                "Cranium",
                "Eyeball"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the chip Neuralink is embedded in?",
            "question_type": "MCQ"
        },
        {
            "answer": "coin",
            "context": "The chip Neuralink is developing is about the size of a coin, and would be embedded in a person's skull.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Roulette Wheel",
                "Flip"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the size of the Neuralink chip?",
            "question_type": "MCQ"
        },
        {
            "answer": "wires",
            "context": "The wires are equipped with 1,024 electrodes which are able to monitor brain activity  and, theoretically, electrically stimulate the brain. From the chip, an array of tiny wires, each roughly 20 times thinner than a human hair, fan out into the patient's brain.",
            "extra_options": [
                "Wiring"
            ],
            "id": 3,
            "options": [
                "Cables",
                "Connectors",
                "Ground Wire"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What are equipped with 1,024 electrodes?",
            "question_type": "MCQ"
        },
        {
            "answer": "sewing machine",
            "context": "The robot would work by using a stiff needle to punch the flexible wires emanating from a Neuralink chip into a person's brain, a bit like a sewing machine.",
            "extra_options": [
                "Walking Foot",
                "Fabric Store",
                "Yarn",
                "Scrap Fabric"
            ],
            "id": 1,
            "options": [
                "Sewing",
                "Quilt",
                "Crochet"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the robot a bit like?",
            "question_type": "MCQ"
        },
        {
            "answer": "january",
            "context": "Neuralink released a video showcasing the robot in January 2021.",
            "extra_options": [
                "March",
                "April",
                "August"
            ],
            "id": 2,
            "options": [
                "February",
                "December",
                "July"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "When did Neuralink release a video of the robot?",
            "question_type": "MCQ"
        }
    ]
  }, {
    "questions": [
        {
            "answer": "filmmaker",
            "context": "THE SCREEN IS black, and then comes the first frame: Hayao Miyazaki, the greatest animated filmmaker since the advent of the form in the early 20th century and one of the greatest filmmakers of any genre, is seated in front of a cast-iron stove with a pipe running up toward the ceiling, flanked by windows propped half open.",
            "extra_options": [],
            "id": 1,
            "options": [
                "Film Director",
                "Screenwriter",
                "Cinematographer"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is Hayao Miyazaki's career?",
            "question_type": "MCQ"
        },
        {
            "answer": "apron",
            "context": "He wears an off-white apron whose narrow strap hooks around the neck and attaches with a single button on the left side — the same style of apron he has worn for years as a work and public uniform, a reminder that he is at once artist and artisan, ever on guard against daubs of paint — over a crisp white collared shirt, his white mustache and beard neat and trim, and his white hair blurring into a near halo as he gazes calmly at me through owlish black glasses, across the 6,700 miles from Tokyo to New York. He wears an off-white apron whose narrow strap hooks around the neck and attaches with a single button on the left side — the same style of apron he has worn for years as a work and public uniform, a reminder that he is at once artist and artisan, ever on guard against daubs of paint — over a crisp white collared shirt, his white mustache and beard neat and trim, and his white hair blurring into a near halo as he gazes calmly at me through owlish black glasses, across the 6,700 miles from Tokyo to New York.",
            "extra_options": [
                "Folding Chair",
                "Shirt Collar",
                "Briefcase",
                "Pant Leg",
                "Bottom Rope"
            ],
            "id": 2,
            "options": [
                "Clothesline",
                "Tablecloth",
                "Turnbuckles"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the same style of apron he has worn for years as a work and public uniform?",
            "question_type": "MCQ"
        },
        {
            "answer": "miyazaki",
            "context": "Our conversation has been brokered by the newly opened Academy Museum of Motion Pictures in Los Angeles, which mounted the first North American retrospective of his work in September, with Studio Ghibli’s cautious assent; Jessica Niebel, an exhibitions curator, cites him as an exemplar of an auteur who “has managed to stay true to himself” while making movies that are “approachable to people everywhere.” I know I am lucky to have this time, and yet it feels wrong to meet Miyazaki this way, at a distance (due to Covid-19 travel restrictions) and through a computer, a machine he has so famously shunned. It is a rare gift, as Miyazaki has long preferred not to speak to the press except when absolutely necessary (which is to say, when he’s prodded into promoting a film), and has not granted an interview to an English-language outlet since 2014.",
            "extra_options": [
                "David Cage",
                "Same Director",
                "Shinkai",
                "Wachowski"
            ],
            "id": 1,
            "options": [
                "Studio Ghibli",
                "Anno",
                "Hosoda"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who has long preferred not to speak to the press except when absolutely necessary?",
            "question_type": "MCQ"
        },
        {
            "answer": "motion pictures",
            "context": "Our conversation has been brokered by the newly opened Academy Museum of Motion Pictures in Los Angeles, which mounted the first North American retrospective of his work in September, with Studio Ghibli’s cautious assent; Jessica Niebel, an exhibitions curator, cites him as an exemplar of an auteur who “has managed to stay true to himself” while making movies that are “approachable to people everywhere.” I know I am lucky to have this time, and yet it feels wrong to meet Miyazaki this way, at a distance (due to Covid-19 travel restrictions) and through a computer, a machine he has so famously shunned.",
            "extra_options": [
                "Sound Recording",
                "Digital Technology",
                "Filmmakers"
            ],
            "id": 2,
            "options": [
                "Television Shows",
                "Silent Films",
                "Visual Media"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is the Academy Museum of?",
            "question_type": "MCQ"
        },
        {
            "answer": "studio ghibli",
            "context": "Our conversation has been brokered by the newly opened Academy Museum of Motion Pictures in Los Angeles, which mounted the first North American retrospective of his work in September, with Studio Ghibli’s cautious assent; Jessica Niebel, an exhibitions curator, cites him as an exemplar of an auteur who “has managed to stay true to himself” while making movies that are “approachable to people everywhere.” I know I am lucky to have this time, and yet it feels wrong to meet Miyazaki this way, at a distance (due to Covid-19 travel restrictions) and through a computer, a machine he has so famously shunned.",
            "extra_options": [
                "Princess Mononoke",
                "Animated Films"
            ],
            "id": 3,
            "options": [
                "Ghibli",
                "Hayao Miyazaki",
                "Same Director"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who gave Miyazaki a cautious assent?",
            "question_type": "MCQ"
        },
        {
            "answer": "miyazaki",
            "context": "From “My Neighbor Totoro” (1988), with its vision of gentle friendship between two children and an enormous growling forest creature whom only they can see, to the ecological epic “Princess Mononoke” (1997), whose title character, a human raised by wolves, first appears sucking blood out of a wound in her wolf mother’s side (the hero, an exiled prince, takes one look at her blood-smeared face and falls in love), to the phantasmagorical fable “Spirited Away” (2001), in which a timid girl must learn pluck and save her foolish parents (who’ve been transformed into pigs) by working at a bathhouse that caters to a raucous array of gods, Miyazaki renders the wildest reaches of imagination and the maddest swirls of motion — the stormy waves that turn into eel-like pursuers in “Ponyo” (2008), the houses rippling and bucking with the force of an earthquake in “The Wind Rises” (2013) — almost entirely by hand. And unlike Walt Disney, the only figure of comparable stature in animation, Miyazaki, who is now 80, has never retreated to the role of a corporate impresario, dictating from on high: At Studio Ghibli, the animation company he founded with the filmmaker Isao Takahata and the producer Toshio Suzuki in 1985, he’s always worked in the trenches, as part of a team of around a hundred employees devoted just to production, including key animators and background, cleanup and in-between artists, whose desks he used to make the rounds of daily for decades.",
            "extra_options": [
                "David Cage",
                "Same Director",
                "Shinkai",
                "Wachowski"
            ],
            "id": 1,
            "options": [
                "Studio Ghibli",
                "Anno",
                "Hosoda"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "Who is the only figure of comparable stature in animation?",
            "question_type": "MCQ"
        },
        {
            "answer": "animation",
            "context": "And unlike Walt Disney, the only figure of comparable stature in animation, Miyazaki, who is now 80, has never retreated to the role of a corporate impresario, dictating from on high: At Studio Ghibli, the animation company he founded with the filmmaker Isao Takahata and the producer Toshio Suzuki in 1985, he’s always worked in the trenches, as part of a team of around a hundred employees devoted just to production, including key animators and background, cleanup and in-between artists, whose desks he used to make the rounds of daily for decades. And unlike Walt Disney, the only figure of comparable stature in animation, Miyazaki, who is now 80, has never retreated to the role of a corporate impresario, dictating from on high: At Studio Ghibli, the animation company he founded with the filmmaker Isao Takahata and the producer Toshio Suzuki in 1985, he’s always worked in the trenches, as part of a team of around a hundred employees devoted just to production, including key animators and background, cleanup and in-between artists, whose desks he used to make the rounds of daily for decades.",
            "extra_options": [],
            "id": 2,
            "options": [
                "Animating"
            ],
            "options_algorithm": "sense2vec",
            "question_statement": "What is Walt Disney's only comparable stature in?",
            "question_type": "MCQ"
        }
    ]
  }]
  
  res.send({ result: questions, error: null })
})

// router.post('/extract/contents/yahoo', async (req, res, next) => {
//   const { news_json } = req.body

//   const url = news_json.newsSearchUrl
//   const response = await fetch(url, { method: 'GET' })
//   const raw = await response.text()
//   const root = HTMLParser.parse(raw)
//   const sites = root.querySelectorAll('a[data-author*=yahoo i]')

//   const load = sites.map(async (site) => {
//     const url = site.attributes.href
//     const response = await fetch(url, { method: 'GET' })
//     const raw = await response.text()
//     const root = HTMLParser.parse(raw)
//     const contents = root.querySelectorAll(`div[class=caas-body]>p`)

//     const text = contents.reduce((result, content) => {
//       const c = content.rawText.replaceAll('&quot;', '')
//                            .replaceAll('— ', '')
//                            .replaceAll('&#39;', '\'')
//                            .replaceAll('&amp;', '&')
//                            .replaceAll('&#8217;', '\'')
//       if (c.length > 20) result = [...result, c]
//       return result
//     }, [])

//     return { url, text }
//   })
//   news_json.contents = await Promise.all(load)

//   successResponse({ result: news_json, res })
// })

module.exports = router