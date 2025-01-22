const multer = require('multer')
const fs = require('fs')

module.exports = {
    uploader: (directory, fileNamePrefix) => {
        // lokasi penyimpanan file
        let defaultDir = './public'

        // disk storage untuk menyimpan file dari FE ke directory BE
        const storage = multer.diskStorage({
            destination: (req, res, cb) => {  // cb = callback
                const pathDir = defaultDir + directory

                if (fs.existsSync(pathDir)) {
                    console.log('Directori sudah ada')
                    cb(null, pathDir)
                } else {
                    fs.mkdir(pathDir, { recursive: true }, err => cb(err, pathDir))
                }
            },
            filename: (req, file, cb) => {
                let ext = file.originalname.split('.')
                let filename = fileNamePrefix + Date.now() + '.' + ext[ext.length - 1]
                cb(null, filename)
            }
        })

        const fileFilter = (req, file, cb) => {
            const ext = /\.(jpg|jpeg|png|gif|pdf|txt|JPG|JPEG|PNG|GIF|PDF|TXT)/
            if (!file.originalname.match(ext)) {
                return cb(new Error('Tipe file tidak valid'), false)
            }
            cb(null, true)
        }

        return multer({
            storage,
            fileFilter
        })
    }
}