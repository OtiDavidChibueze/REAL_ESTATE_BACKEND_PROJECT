// Database Config
import logger from './logger.js';
import mongoose from 'mongoose';
import { database } from './keys/secretKeys.js';

const connectToDatabase = () => {
    try {
        mongoose.connect(database, { useUnifiedTopology: true, useNewUrlParser: true });
        logger.info(`connected to database`)

    } catch (err) {
        logger.error(`Database_Connection -> Error: ${err.message}`)
    }
}

export default connectToDatabase;




