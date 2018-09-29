const fastify = require('fastify')
const plugin = require('fastify-plugin')
const compress = require('fastify-compress')
const fetch = require('isomorphic-fetch')
const ess = require('event-source-stream')
const ytdl = require('ytdl-core')
const inflight = require('inflight')

const ANNOUNCE_URL = 'https://announce.u-wave.net'

const app = fastify({
  logger: true
})

app.register(compress)
app.register(plugin(async (fastify) => {
  const events = ess(`${ANNOUNCE_URL}/events`, { json: true })
  const response = await fetch(ANNOUNCE_URL)
  const { servers } = await response.json()

  events.on('data', (data) => {
    const i = servers.findIndex((server) => server.publicKey === data.publicKey)
    if (i !== -1) {
      servers.push(data)
    } else {
      servers[i] = data
    }
  })

  fastify.decorate('servers', {
    getter: () => servers
  })
}))

app.register(async (fastify) => {
  fastify.get('/', async (req, reply) => {
    const { servers } = fastify

    reply.type('text/html')
    reply.send(require('./views/list')({ servers }))
  })

  fastify.get('/:publicKey', async (req, reply) => {
    const { servers } = fastify
    const { publicKey } = req.params
    const server = servers.find((s) => s.publicKey === publicKey)
    const nowResponse = await fetch(`${server.apiUrl.replace(/\/$/, '')}/now`)
    const now = await nowResponse.json()

    const { name, socketUrl } = server
    const { time, booth, users } = now
    const { media } = booth ? booth.media : {}

    let audioUrl = null
    if (media) {
      if (media.sourceType === 'soundcloud') {
        audioUrl = `${media.sourceData.streamUrl}${
          /\?/.test(media.sourceData.streamUrl) ? '&' : '?'
        }client_id=9d883cdd4c3c54c6dddda2a5b3a11200`
      } else if (media.sourceType === 'youtube') {
        const format = await getYouTubeAudio(media.sourceID)
        audioUrl = format.url
      }
    }

    const seek = booth ? Math.round((time - booth.playedAt) / 1000) : null
    const user = booth ? users.find((u) => u._id === booth.userID) : null

    reply.type('text/html')
    reply.send(require('./views/server')({
      title: name,
      socketUrl,
      booth,
      audioUrl,
      seek,
      user
    }))
  })

  fastify.get('/youtube/:sourceID', async (req, reply) => {
    const format = await getYouTubeAudio(req.params.sourceID)
    reply.type('application/json')
    reply.send({ src: format.url })
  })
})

start()
async function start () {
  try {
    await app.listen(3000)
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

function getYouTubeInfo (sourceID, opts, callback) {
  callback = inflight(sourceID, callback)
  if (!callback) return
  ytdl.getInfo(sourceID, opts, callback)
}

function getYouTubeAudio (sourceID) {
  const opts = { quality: 'highestaudio' }
  return new Promise((resolve, reject) => {
    getYouTubeInfo(sourceID, opts, (err, info) => {
      if (err) return reject(err)
      const format = ytdl.chooseFormat(info.formats, opts)
      if (format instanceof Error) {
        reject(format)
      } else {
        resolve(format)
      }
    })
  })
}
