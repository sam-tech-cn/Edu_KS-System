const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const passport = require('passport')
const app = express()
const port = process.env.PORT || 3000

// user body-parser
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// use passport
app.use(passport.initialize())
require('./config/passport')(passport)

// db
const db = require('./config/keys').mongoURI
mongoose.connect(db,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true
    }).then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err))

// import routes
const user = require('./routes/user')
const project = require('./routes/project')
const notification = require('./routes/notification')
const log = require('./routes/log')

// use routes
app.use('/api/user', user)
app.use('/api/project', project)
app.use('/api/notification', notification)
app.use('/api/log', log)

app.listen(port, () => console.log(`KS-System Edu App is listening on port ${port}!`))