const escape = require('escape-html')
const html = require('./html')
const layout = require('./layout')

module.exports = ({ servers }) => layout(html`
  <ul>
    ${servers.map(({ publicKey, name, subtitle }) => html`
      <li><a href="/${publicKey}">${escape(name)}</a>: ${escape(subtitle)}</li>
    `)}
  </ul>
`)
