// Index File
const logger = require('./src/config/logger.js')
const server = require('./src/routes/app.js')
const { PORT } = require('./src/config/keys/secretKeys.js')
const connectToDatabase = require('./src/config/database.js')

// connect to database
connectToDatabase()

// connect to port ...
const port = PORT || 8080

// listening to ......
server.listen(port, () => {
    logger.info(`listening to post : ${port}`)
})
