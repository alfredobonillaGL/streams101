#!/usr/bin/env node
const fs = require('fs');
const server = require('http').createServer();

const isStreamed = process.argv.find(arg => arg === '--stream')
const isSmall = process.argv.find(arg => arg === '--small')
const filename = isSmall ? './small.file' : './big.file'

const readFile = res => {
  const src = fs.readFile(filename, (err, data) => {
    console.log(`Reading ${filename}...`)
    if (err) throw err;
    res.end(data, () => console.log('Process complete.'));
  })
}

const streamFile = res => {
  console.log(`Streaming ${filename}...`)
  const src = fs.createReadStream(filename);
  src.pipe(res);
  src.on('end', () => console.log('Process complete.'))
}

console.log('Server is running...')

server.on('request', (req, res) => {
  if (req.url !== '/favicon.ico') {
    if (isStreamed) streamFile(res) 
    else readFile(res) 
  }
});
server.listen(8000);
