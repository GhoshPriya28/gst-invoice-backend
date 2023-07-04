const multer  = require('multer')
var fs = require('fs-extra')
const path  = require('path')
var folderName = ''
exports.upload = () => {
  return imageUpload = multer({
    storage: multer.diskStorage({
      destination: function (req, file, cb) {
        folderName = req.body.channelId
        console.log('This is channel id from ios',req.body.channelId)
        const path = `./public/uploads/${folderName}/`;
        fs.exists(path, exist => {
          if (!exist) {
            fs.mkdirs(path, error => cb(error, path))
          }
          return cb(null, path)
        })
      },

      // By default, multer removes file extensions so let's add them back
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
      }
    }),
    limits: { fileSize: 10000000 },
    fileFilter: function (req, file, cb) {
      if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF|jfif|JFIF|pdf|PDF|doc|DOC|docx|DOCX|txt|TXT|mp4|MP4|x-m4v|X-M4V|mkv|MKV|mov|MOV|qt|QT|mp3|MP3|wav|WAV|mpeg|MPEG|aac|ACC|webp|WEBP|bmp|BMP|flv|FLV|WEBM|webm|mkv|MKV|avi|AVI)$/)) {
        req.fileValidationError = 'Only .png, .jpg and .jpeg format allowed!';
        return cb(null, false, req.fileValidationError);
      }
      cb(null, true);
    }
  })
}