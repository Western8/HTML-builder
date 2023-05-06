const fs = require('fs');
const path = require('path');
const dirSrc = path.join(__dirname, 'files');
const dirDest = path.join(__dirname, 'files-copy');

function showError(err) {
  if (err) {
    throw err;
  }  
}

function copyFiles() {
  fs.readdir(dirSrc, (err, files) => {
    files.forEach(file => {
      fs.copyFile(path.join(dirSrc, file), path.join(dirDest, file), () => {});
    })
  });
}

fs.access(dirDest, (err) => {
  if (err) {
    fs.mkdir(dirDest, {recursive: true}, showError);
    copyFiles();
  } else {
    fs.readdir(dirDest, (err, files) => {
      files.forEach(file => {fs.unlink(path.join(dirDest, file), showError)})
      copyFiles();
      });
  };
})
