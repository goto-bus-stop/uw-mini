module.exports = function html (strings, ...values) {
  return strings.reduce((acc, str, i) => {
    acc += str
    if (values.length > i) acc += values[i]
    return acc
  }, '')
}
