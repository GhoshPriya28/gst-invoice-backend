// import multer and the FileStorage engine
var _ = require('lodash');
var path = require('path');
var multer = require('multer');
var FileStorage = require('../../helpers/storage/FileStorage');

// setup a new instance of the FileStorage engine 
var storage = FileStorage({
square: true,
responsive: true,
greyscale: true,
quality: 90
});

var limits = {
files: 1, // allow only 1 file per request
fileSize: 1024 * 1024, // 1 MB (max file size)
};

var fileFilter = function(req, file, cb) {
// supported image file mimetypes
var allowedMimes = ['image/jpeg', 'image/pjpeg', 'image/png', 'image/gif'];

if (_.includes(allowedMimes, file.mimetype)) {
// allow supported image files
cb(null, true);
} else {
// throw error for invalid files
cb(new Error('Invalid file type. Only jpg, png and gif image files are allowed.'));
}
};

// setup multer
var fileUpload = multer({
storage: storage,
limits: limits,
fileFilter: fileFilter
});