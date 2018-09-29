const escape = require('escape-html')
const html = require('./html')
const layout = require('./layout')

module.exports = ({ servers }) => layout('üWave', html`
  <h2>üWave</h2>
  <ul>
    ${servers.map(({ publicKey, name, subtitle }) => html`
      <li><a href="/${publicKey}">${escape(name)}</a>: ${escape(subtitle)}</li>
    `).join('')}
  </ul>
`)
