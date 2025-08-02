const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Test server is working on port 3000\n');
});

server.listen(3000, () => {
  console.log('Test server running at http://localhost:3000/');
});

// Keep the process alive
process.on('SIGINT', () => {
  console.log('Shutting down...');
  server.close();
  process.exit(0);
});