require('dotenv').config()

const localDatabase = process.env.DB
const onlineDatabase = process.env.O_DB
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const Cloud_Name = process.env.Cloud_Name
const Cloud_Api = process.env.Cloud_API_Key
const Cloud_Secret = process.env.Cloud_API_Secret

module.exports = {
    localDatabase,
    onlineDatabase,
    PORT,
    SECRET,
    Cloud_Api,
    Cloud_Secret,
    Cloud_Name,
}
