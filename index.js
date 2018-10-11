require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const SnowTransfer = require('snowtransfer')
const snowtransfer = new SnowTransfer(process.env.TOKEN)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use((req, res, next) => {
  req.rest = snowtransfer
  if (req.headers['X-Audit-Log-Reason']) {
    if (req.method === 'GET' || req.path.includes('/bans') || req.path.includes('/prune')) {
      req.query.reason = req.headers['X-Audit-Log-Reason']
    } else {
      req.body.reason = req.headers['X-Audit-Log-Reason']
    }
  }
  next()
})
app.use('/api/v7', require('./routes/bots'))
app.use('/api/v7', require('./routes/channels'))
app.use('/api/v7', require('./routes/emojis'))
app.use('/api/v7', require('./routes/guilds'))
app.use('/api/v7', require('./routes/invites'))
app.use('/api/v7', require('./routes/users'))
app.use('/api/v7', require('./routes/voice'))
app.use('/api/v7', require('./routes/webhook'))
app.listen(process.env.REST_PORT, process.env.REST_HOST_LOCAL)
console.log(`App started on ${process.env.REST_HOST_LOCAL}:${process.env.REST_PORT}`)
