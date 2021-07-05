const config      = require('./utils/config')
const mongoose    = require('mongoose')
const bodyParser  = require('body-parser')
const cors        = require('cors')
const colors      = require('./utils/colors')
const blogRouter  = require('./controllers/blogs')
const userRouter  = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware  = require('./utils/middleware')
const express     = require('express')
const path        = require('path')
const app         = express()

const mongoUrl = config.MONGODB_URI
const blogserverText = colors.blue('[Blog Server]')

app.use(cors())
app.use(bodyParser.json())

console.log(`${blogserverText} connecting to MongoDB`)
mongoose.connect(mongoUrl, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => {
        console.log(`${blogserverText} connected to MongoDB`)
    })
    .catch((error) => {
        console.log(`${blogserverText} error while connecting to MongoDB`, error.message)
    })

app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

if (process.env.NODE_ENV === 'test') {
    const testingRouter = require('./controllers/testing')
    app.use('/api/testing', testingRouter)
}

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'build')))
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'build', 'index.html'))
    })
}

app.use(middleware.errorHandler)

module.exports = app
