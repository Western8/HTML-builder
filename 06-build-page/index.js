const fs = require('fs');
const path = require('path');
const srcTemplate = path.join(__dirname, 'template.html');
const srcComponents = path.join(__dirname, 'components');
const srcStyles = path.join(__dirname, 'styles');
const srcAssets = path.join(__dirname, 'assets');
const destDir = path.join(__dirname, 'project-dist');
const destIndex = path.join(destDir, 'index.html');
const destStyles = path.join(destDir,'style.css');
const destAssets = path.join(destDir,'assets');
// const writeStreamIndex = fs.createWriteStream(destIndex);
const writeStreamStyles = fs.createWriteStream(destStyles);
let html = '';

function showError(err) {
  if (err) {throw err;}
}

//fs.mkdir(destDir, {recursive: true}, showError);
//fs.mkdir(destAssets, {recursive: true}, showError);

fs.mkdir(destDir, {recursive: true}, () => {
  fs.mkdir(destAssets, {recursive: true}, () => {

    const readStreamTemplate = fs.createReadStream(srcTemplate, 'utf-8');
    readStreamTemplate.on('data', (chunck) => {
      html += chunck;
    });
    readStreamTemplate.on('end', () => {
    
      fs.readdir(srcComponents, {withFileTypes: true}, (err, files) => {
        const filesHmtl = files.filter(item => (item.isFile() && (path.extname(item.name) === '.html'))); 
        filesHmtl.forEach(dirent => {
          const basename = path.basename(dirent.name, path.extname(dirent.name));
          const tag = `{{${basename}}}`;
          let tagReplace = '';
          const readStreamComp = fs.createReadStream(path.join(srcComponents, dirent.name), 'utf-8');
          readStreamComp.on('data', (chunck) => {
            tagReplace += chunck;
          });
          readStreamComp.on('end', () => {
            html = html.replace(tag, tagReplace);
            const writeStreamIndex = fs.createWriteStream(destIndex);
            writeStreamIndex.write(html);
          });
        });
      });
    });
    
    fs.readdir(srcStyles, {withFileTypes: true},(err, files) => {
      const filesCss = files.filter(item => (item.isFile() && (path.extname(item.name) === '.css'))); 
      filesCss.forEach(dirent => {
        const readStreamStyles = fs.createReadStream(path.join(srcStyles, dirent.name), 'utf-8');
        readStreamStyles.pipe(writeStreamStyles);
      });
    });
    
    function copyFiles(src, dest) {
      fs.readdir(src, {withFileTypes: true}, (err, files) => {
        files.forEach(file => {
          const srcSub = path.join(src, file.name);
          const destSub = path.join(dest, file.name);
          if (file.isDirectory()) {
            fs.mkdir(destSub, {recursive: true}, () => {
              copyFiles(srcSub, destSub);
            });
          } else {
            fs.copyFile(srcSub, destSub, showError);
          }
        });
      });
    }
    copyFiles(srcAssets, destAssets);

  });
});