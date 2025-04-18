const express = require("express")
const cors = require('cors')
const fileUpload = require('express-fileupload')

const app = express()
app.use(cors())
app.use(fileUpload())
const port = 4000

app.get('/', (req, res) => {
  res.send('.')
})

app.post('/upload', (req, res) => {
  const image = req.files.image
  console.log(image)
  res.json({})
})

app.listen(port, () => {
  console.log(`API on port: ${port}`)
})
