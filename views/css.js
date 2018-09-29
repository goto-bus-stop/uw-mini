const CleanCss = require('clean-css')
const clean = new CleanCss({
  level: 2
})
const minify = clean.minify.bind(clean)

module.exports = function css (strings, ...values) {
  const result = minify(strings.reduce((acc, str, i) => {
    acc += str
    if (values.length > i) acc += values[i]
    return acc
  }, ''))

  if (result.errors.length > 0) {
    throw new Error(result.errors.join('\n'))
  }

  return result.styles
}
