if (typeof window === 'undefined') {
  global.window = {}
}

const fs = require('fs')
const path = require('path')
const express = require('express')
const { renderToString } = require('react-dom/server')
const SSR = require('../dist/search-server')
const template = fs.readFileSync(path.join(__dirname, '../dist/search.html'), 'utf-8')

// 这个<!-- HTML_PLACEHOLDER -->是约定俗成的
const renderMarkUp = (str) => template.replace('<!-- HTML_PLACEHOLDER -->', str)


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



