// Index File
import logger from './src/config/logger.js';
import server from './src/routes/app.js'
import { PORT } from './src/config/keys/secretKeys.js';
import connectToDatabase from './src/config/database.js'

// connect to database
connectToDatabase();

// connect to port ...
const port = PORT || 8080

// listening to ......
server.listen(port, () => {
    logger.info(`listening to post : ${port}`)
})
