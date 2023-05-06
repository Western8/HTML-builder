const fs = require('fs');
const path = require('path');
const writeStream = fs.createWriteStream(path.join(__dirname, 'new_text.txt'));

process.stdout.write('Hello, human of the world!\n');
process.stdout.write('Enter something interesting: ');

const readStream = process.stdin;
readStream.on('data', (data) => {
  const str = data.toString();
  if (str.trim() === 'exit') {
    process.exit();
  }
  writeStream.write(str);
});

process.on('exit', () => process.stdout.write('Have a nice day and Goodbye!'));
process.on('SIGINT', () => process.exit());

