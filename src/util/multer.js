// Multer Config
const multer = require('multer')
const path = require('path')

const multerStorage = multer.diskStorage({})

const myFileFilter = (req, file, cb) => {
    let ext = path.extname(file.originalname)
    if (ext !== '.jpeg' && ext !== '.jpg' && ext !== '.png') {
        // Allow only JPEG and JPG formats
        cb(new Error('Only JPEG, JPG and PNG files are allowed'), false)
        return
    }
    cb(null, true)
}

const upload = multer({
    storage: multerStorage,
    fileFilter: myFileFilter,
})

module.exports = { upload }
