const express     = require('express')
require('express-async-errors')
const config      = require('./server/utils/config')
const mongoose    = require('mongoose')
const cors        = require('cors')
const blogRouter  = require('./server/controllers/blogs')
const userRouter  = require('./server/controllers/users')
const loginRouter = require('./server/controllers/login')
const middleware  = require('./server/utils/middleware')
const path        = require('path')
const app         = express()

const mongoUrl = config.MONGODB_URI

console.log('Connecting to MongoDB')
mongoose.connect(mongoUrl, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
})
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.log('Error while connecting to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())
app.use(middleware.tokenExtractor)
app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)
if (process.env.NODE_ENV !== 'production') {
  const testingRouter = require('./server/controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.get('/health', (_req, res) => {
  res.send('ok')
})
app.use(express.static(path.join(__dirname, 'dist')))
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})
app.use(middleware.errorHandler)

module.exports = app
