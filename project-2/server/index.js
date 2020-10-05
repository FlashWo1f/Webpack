if (typeof window === 'undefined') {
  global.window = {}
}

const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server')

const renderMarkUp = (str) => 
  `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <div id="root">${str}</div>
  </body>
  </html>`


const server = (port) => {
  const app = express()
  app.use(express.static('dist'))

  app.get('/search', (req, res) => {
    const html = renderMarkUp(renderToString(SSR))
    res.status(200).send(html)
  })
  app.listen(port, () => {
    console.log('server is running on port', port)
  })
}
server(process.env.POST || 3000)



