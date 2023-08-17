// Database Config
const logger = require('./logger.js')
const mongoose = require('mongoose')
const { localDatabase, onlineDatabase } = require('./keys/secretKeys.js')

module.exports = () => {
    try {
        mongoose.connect(onlineDatabase, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
        })
        logger.info(`connected to onlineDatabase`)
    } catch (err) {
        logger.error(`onlineDatabase_Connection -> Error: ${err.message}`)
    }
}
