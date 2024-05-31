const http = require('http');
const { parse } = require('url');
const { readFileSync } = require('fs');

const hostname = '0.0.0.0';
const port = 3000;

let prompt = "Initial Prompt";

const server = http.createServer((req, res) => {
  const path = parse(req.url).pathname;
  
  if (req.method === 'POST' && path === '/update-prompt') {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString(); 
    });
    req.on('end', () => {
      prompt = JSON.parse(body).prompt; 
      console.log({prompt})
      res.writeHead(200, {'Content-Type': 'text/plain'});
      res.end(`Prompt updated to: ${prompt}`);
    });
  } else {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end(`Current Prompt: ${prompt}`);
  }
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
