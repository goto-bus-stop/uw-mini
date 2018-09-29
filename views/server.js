const fs = require('fs')
const escape = require('escape-html')
const terser = require('terser')
const html = require('./html')
const layout = require('./layout')
const unfetch = fs.readFileSync(require.resolve('unfetch/polyfill'), 'utf8')
const script = terser.minify(
  fs.readFileSync(require.resolve('./server-browser'), 'utf8'),
  { mangle: { toplevel: true }, compress: true }
).code

const Media = ({
  hidden = false,
  artist,
  title,
  thumbnail
}) => html`
  <div${hidden ? ' hidden' : ''}>
    <h2>
      <span id="artist">${escape(artist)}</span> – <span id="title">${escape(title)}</span>
    </h2>

    <img id="thumbnail" src="${escape(thumbnail)}" alt="">
  </div>
`

module.exports = ({
  title,
  socketUrl,
  audioUrl,
  booth,
  seek
}) => layout(html`
  <a href="/">« Back</a>

  <h1>${escape(title)}</h1>

  <button id="beginPlaying">
    Start audio playback
  </button>

  ${Media(booth ? {
    artist: booth.media.artist,
    title: booth.media.title,
    thumbnail: booth.media.media.sourceType === 'youtube'
      ? `https://i.ytimg.com/vi/${booth.media.media.sourceID}/default.jpg`
      : booth.media.media.thumbnail
  } : {
    hidden: true,
    artist: '',
    title: '',
    thumbnail: ''
  })}

  <audio src="${escape(audioUrl)}" id="audio"></audio>
  <progress id="progress"
    max="${booth ? booth.media.end - booth.media.start : 1}"
    value="${booth ? seek : 0}">
  </progress>

  <script id="unfetch">${unfetch}</script>
  <script id="listen">
    S=${JSON.stringify({
      socketUrl,
      seek: booth ? booth.media.start + seek : null
    })};${script}
  </script>
`)
