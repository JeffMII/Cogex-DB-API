const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')

const usersRouter = require('./routes/users')
const newsRouter = require('./routes/news')
const quizzesRouter = require('./routes/quizzes')
const categoriesRouter = require('./routes/categories')
const utilityRouter = require('./routes/utility')
const { e } = require('./helpers/mysql.helper')

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'jade')

app.use(logger('dev'))
app.use(express.json({limit: '500kb'}))
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

app.use('/users', usersRouter)
app.use('/news', newsRouter)
app.use('/quizzes', quizzesRouter)
app.use('/categories', categoriesRouter)
app.use('/utility', utilityRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404))
})

// error handler
app.use(function(err, req, res, next) { e(err, res) })

module.exports = app