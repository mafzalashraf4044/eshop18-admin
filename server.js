const isProduction = process.env.NODE_ENV === 'production';
const path = require('path');
const express = require('express');

const portNumber = 3000;
let app;

const gzipFiles = ['.js'];
app = express();
app.get(gzipFiles, (req, res) => {
  res.set('Content-Encoding', 'gzip');
  next();
});
app.get('/fonts/*.ttf', (req, res) => {
  res.sendFile(path.join(__dirname, `build/${req.url}`));
});
app.get('/images/*.png', (req, res) => {
  res.sendFile(path.join(__dirname, `build/${req.url}`));
});
app.get('*.js', (req, res) => {
  res.sendFile(path.join(__dirname, `build/${req.url}`));
});
app.get('*.css', (req, res) => {
  res.sendFile(path.join(__dirname, `build/${req.url}`));
});
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'build/index.html'));
});

app.listen(portNumber, (err) => {
  if (err) {
    return console.error(err);
  }
  console.log(`Listening at http://localhost:${portNumber}`);
});
