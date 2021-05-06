import express from 'express'
import bodyParser from 'body-parser'

import router from './router'

const port = parseInt(process.env.PORT, 10) || 3000

const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

global.downloadPath = `${__dirname}/tmp`

router(app)

app.listen(port, err => {
    if (err) throw err
    console.log(`🚀 Ready at http://localhost:${port}`)
})