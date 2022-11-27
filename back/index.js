import http from 'http'

const host = process.env.LISTEN_HOST || 'localhost';
const port = process.env.PORT || 2400;
const apiKey = process.env.OMDB_API_KEY || '';
const ombdapi = `http://www.omdbapi.com/?apikey=${apiKey}`;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Headers', '*');
  switch (req.method) {
    case 'OPTIONS':
      res.writeHead(204)
      res.end();
      break;
    case 'POST':
      let body = '';
      req.on('data', chunk => body += chunk);
      req.on('end', () => {
        const json = JSON.parse(body);
        let omdbSearch = ombdapi;
        for (const key in json) {
          if (Object.hasOwnProperty.call(json, key)) {
            omdbSearch += `&${key}=${encodeURIComponent(json[key])}`;
          }
        }

        let omdbBody = '';
        http.get(omdbSearch, {},
          (omdb) => {
            omdb.on('data', chunk => omdbBody += chunk);
            omdb.on('error', error => {
              res.writeHead(500, { 'content-type': 'application/json' });
              res.end(JSON.stringify({error: error}));
            })
            omdb.on('end', () => {
              res.writeHead(200, { 'content-type': 'application/json' });
              res.end(omdbBody);
            });
          });
      });
      break;
    default:
      res.writeHead(418, { 'content-type': 'application/json' })
      res.end(JSON.stringify({
        error: http.STATUS_CODES[418]
      }))
      break;
  }
})

server.listen(port, host,
  () => console.log(`Ready on http://${host}:${port}`));
