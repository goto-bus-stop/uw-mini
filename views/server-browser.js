var audio$ = document.getElementById('audio')
var title$ = document.getElementById('title')
var artist$ = document.getElementById('artist')
var thumbnail$ = document.getElementById('thumbnail')
var progress$ = document.getElementById('progress')
var socket = new WebSocket(S.socketUrl)
socket.onmessage = onmessage

audio$.addEventListener('timeupdate', function () {
  progress$.value = audio$.currentTime
  progress$.textContent = formatDuration(audio$.currentTime)
})

document.addEventListener('DOMContentLoaded', function () {
  if (S.seek) {
    audio$.currentTime = S.seek
  }
  audio$.play()
})

function onmessage (event) {
  if (event.data === '-') return
  var data = JSON.parse(event.data)
  if (data.command === 'advance') {
    advance(data.data)
  }
}

function advance (booth) {
  if (!booth) return
  var entry = booth.media
  var media = entry.media
  var start = Date.now()
  if (media.sourceType === 'soundcloud') {
    var srcThunk = function (cb) {
      cb(null, media.sourceData.streamUrl + '&client_id=9d883cdd4c3c54c6dddda2a5b3a11200')
    }
  } else if (media.sourceType === 'youtube') {
    var srcThunk = function (cb) {
      fetch('/youtube/' + media.sourceID)
        .then(function (response) { return response.json() })
        .then(function (format) { cb(null, format.src) }, cb)
    }
  }
  srcThunk(function (err, src) {
    if (err) {
      audio$.stop()
    } else {
      progress$.max = entry.end - entry.start
      progress$.value = 0
      progress$.textContent = '0:00'
      title$.textContent = entry.title
      artist$.textContent = entry.artist
      thumbnail$.src = media.sourceType === 'youtube'
        ? 'https://i.ytimg.com/vi/' + media.sourceID + '/default.jpg'
        : media.thumbnail

      audio$.src = src
      audio$.currentTime = entry.start + Math.round((Date.now() - start) / 1000)
      audio$.play()
    }
  })
}

function formatDuration (n) {
  return p(Math.floor(n / 60)) + ':' + p(Math.floor(n % 60))
}
function p (n) { return n < 10 ? '0' + n : n }
