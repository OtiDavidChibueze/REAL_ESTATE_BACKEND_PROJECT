import dotenv from 'dotenv'
dotenv.config();

const database = process.env.DB;
const PORT = process.env.PORT
const SECRET = process.env.SECRET

export {
    database,
    PORT,
    SECRET
}


