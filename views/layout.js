const html = require('./html')

module.exports = (content) => html`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <title>üWave</title>
  </head>
  <body>
    ${content}
  </body>
  </html>
`
