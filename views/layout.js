const escape = require('escape-html')
const html = require('./html')
const css = require('./css')

const style = css`
  body {
    background: #151515;
    color: #fff;
    font: 12pt Helvetica, Arial, sans-serif;
  }

  a, a:visited { color: #9d2053; }
`

module.exports = (title, content) => html`
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>${escape(title)}</title>
    <style>${style}</style>
  </head>
  <body>
    ${content}
  </body>
  </html>
`
