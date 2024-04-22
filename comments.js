// Create web server
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const comments = [
  { name: 'Tom', message: 'Today is a sunny day!', dateTime: '2020-10-10' },
  { name: 'Jerry', message: 'Hello, Tom!', dateTime: '2020-10-10' },
  { name: 'Spike', message: 'Wow! It\'s a big cake!', dateTime: '2020-10-10' },
  { name: 'Tyke', message: 'Hi, Jerry!', dateTime: '2020-10-10' },
  { name: 'Butch', message: 'Good morning!', dateTime: '2020-10-10' },
];

http.createServer((req, res) => {
  const { pathname } = url.parse(req.url);
  const filePath = path.join(__dirname, pathname);

  if (pathname === '/') {
    fs.readFile(filePath, 'utf-8', (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;
      }

      const commentsHTML = comments.map(comment => {
        return `
          <div style="border-bottom: 1px solid #ccc; margin-bottom: 20px;">
            <div>${comment.name} said: <span style="color: #f60;">${comment.message}</span></div>
            <div style="color: #666;">${comment.dateTime}</div>
          </div>
        `;
      }).join('');

      data = data.replace('<!--#comments#-->', commentsHTML);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(data);
    });
  } else if (pathname === '/comment') {
    const comment = {
      name: 'Tom',
      message: 'Today is a rainy day!',
      dateTime: '2020-10-10',
    };
    comments.unshift(comment);

    res.writeHead(302, { 'Location': '/' });
    res.end();
  } else {
    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
        return;