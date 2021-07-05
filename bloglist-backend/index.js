const app    = require('./app')
const http   = require('http')
const config = require('./utils/config')
const colors = require('./utils/colors')

const blogserverText = colors.blue('[Blog Server]')
const server = http.createServer(app)

server.listen(config.PORT, () => {
    console.log(`${blogserverText} Server running on port ${config.PORT}`)
})
