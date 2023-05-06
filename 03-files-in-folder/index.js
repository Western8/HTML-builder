const fs = require('fs');
const path = require('path');
const dirName = path.join(__dirname, 'secret-folder');

const dir = fs.readdir(dirName, {withFileTypes: true},(err, files) => {
  const onlyFiles = files.filter(item => item.isFile()); 
  onlyFiles.forEach(dirent => {
    const name = path.basename(dirent.name, path.extname(dirent.name));
    const ext = path.extname(dirent.name).replace('.', '');
    const fullPath = path.join(dirName, dirent.name);
    fs.stat(fullPath, (err, stats) => {
      size = stats.size;
      const str = `${name} - ${ext} - ${size}b`;
      console.log(str);
    });
  })
});