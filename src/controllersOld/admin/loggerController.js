const path = require('path');
const fs = require('fs');
const directoryPath = path.join('src/logs');

//For Register Page
const loggerView = (req, res) => {
    const allFiles = fromDir(directoryPath, '.log');
    console.log(allFiles)
    res.render("admin/pages/logger", {allFiles});
}

const loggerViewDetail = (req, res) => {
    
    const loggerDetail = fs.readFile('../../logs/'+req.query.fileName, "utf8", (err, file) => {
        return file
    });
    console.log('Files detafa',path.join(req.query.fileName))
    res.render("admin/pages/logger-detail", {loggerDetail});
}

function fromDir(startPath, filter) {

    //console.log('Starting from dir '+startPath+'/');

    if (!fs.existsSync(startPath)) {
        console.log("no dir ", startPath);
        return;
    }

    var files = fs.readdirSync(startPath);
    var allFiles = []
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(startPath, files[i]);
        var stat = fs.lstatSync(filename);
        if (stat.isDirectory()) {
            fromDir(filename, filter); //recurse
        } else if (filename.endsWith(filter)) {
            allFiles.push(filename);
        };
    };
    return allFiles
}

module.exports =  {
    loggerView, loggerViewDetail
};