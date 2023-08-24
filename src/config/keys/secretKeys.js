require('dotenv').config()

const localDatabase = process.env.DB
const onlineDatabase = process.env.O_DB
const PORT = process.env.PORT
const SECRET = process.env.SECRET
const Cloud_Name = process.env.Cloud_Name
const Cloud_Api = process.env.Cloud_API_Key
const Cloud_Secret = process.env.Cloud_API_Secret
const Flutter_Wave_Public_key = process.env.Flutter_Wave_Public_key
const Flutter_Wave_Secret_key = process.env.Flutter_Wave_Secret_key
const Flutter_Wave_Encryption_key = process.env.Flutter_Wave_Encryption_key
const BaseUrl = process.env.BaseUrl
const Flutter_Wave_Webhook_Secret_key =
    process.env.Flutter_Wave_Webhook_Secret_key
const Mail = process.env.Mail
const Mail_Password = process.env.Mail_Password

module.exports = {
    Mail,
    Mail_Password,
    BaseUrl,
    Flutter_Wave_Webhook_Secret_key,
    Flutter_Wave_Public_key,
    Flutter_Wave_Secret_key,
    Flutter_Wave_Encryption_key,
    localDatabase,
    onlineDatabase,
    PORT,
    SECRET,
    Cloud_Api,
    Cloud_Secret,
    Cloud_Name,
}
