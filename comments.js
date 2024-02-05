// Create web server

// Import modules
const http = require('http'); // http module
const fs = require('fs'); // file system module
const path = require('path'); // path module
const url = require('url'); // url module
const qs = require('querystring'); // querystring module
const mime = require('mime-types'); // mime-types module
const comments = require('./comments.json'); // Import comments.json file

// Create a server
const server = http.createServer((req, res) => {
  // Parse the request url
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;
  const query = parsedUrl.query;

  // Log the request url
  console.log(`${req.method} ${req.url}`);

  // Serve static files
  if (pathname.startsWith('/static/')) {
    const filePath = path.join(__dirname, pathname);
    const contentType = mime.lookup(filePath);
    fs.readFile(filePath, (err, data) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
      } else {
        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      }
    });
  }

  // Serve the home page
  else if (pathname === '/') {
    fs.readFile('./index.html', (err, data) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      } else {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
      }
    });
  }

  // Serve the comments
  else if (pathname === '/comments') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(comments));
  }

  // Add a comment
  else if (pathname === '/add-comment') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', () => {
      const comment = qs.parse(body);
      comments.push(comment);
      fs.writeFile('./comments.json', JSON.stringify(comments), (err) => {
        if (err) {
          res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 Internal Server Error');
        }
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(comment));
        }
        );
    }
    );
    }
    // Serve 404 Not Found
    else {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
    }
    }
    );