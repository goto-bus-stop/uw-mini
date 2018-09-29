const html = require('./html')
const layout = require('./layout')

module.exports = ({ servers }) => layout(html`
  <ul>
    ${servers.map(({ publicKey, name }) => html`
      <li><a href="/${publicKey}">${name}</a></li>
    `)}
  </ul>
`)
