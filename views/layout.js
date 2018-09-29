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
  #progress { width: 100%; }
  #thumbnail { width: 100%; }

  @media (min-width: 768px) {
    body { width: 600px; margin: auto }
    #thumbnail { filter: blur(3px); -webkit-filter: blur(3px) }
  }
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
