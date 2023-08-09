import dotenv from 'dotenv'
dotenv.config();

const database = process.env.DB;
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const Cloud_Name = process.env.Cloud_Name
const Cloud_Api = process.env.Cloud_API_Key
const Cloud_Secret = process.env.Cloud_API_Secret

export {
    database,
    PORT,
    SECRET,
    Cloud_Api,
    Cloud_Secret,
    Cloud_Name
}


