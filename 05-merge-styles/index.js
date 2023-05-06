const fs = require('fs');
const path = require('path');
const dirSrc = path.join(__dirname, 'styles');
const dest = path.join(__dirname, 'project-dist','bundle.css');
const writeStream = fs.createWriteStream(dest);

fs.readdir(dirSrc, {withFileTypes: true},(err, files) => {
  const filesCss = files.filter(item => (item.isFile() && (path.extname(item.name) === '.css'))); 
  filesCss.forEach(dirent => {
    const readStream = fs.createReadStream(path.join(dirSrc, dirent.name), 'utf-8');
    readStream.pipe(writeStream);
  });
});