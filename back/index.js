import http from 'http'

const port = process.env.PORT || 2400;

const server = http.createServer((req, res) => {
  if (req.method !== 'POST') {
    res.end(`{ "error" : "${http.STATUS_CODES[413]}" }`)
  }
  res.end(JSON.stringify({
    statusCode: 200
  }))
})

server.listen(port, () => console.log(`Ready on http://localhost:${port}`))
