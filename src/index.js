const express = require("express")
const cors = require('cors')
const fileUpload = require('express-fileupload')
const { Jimp } = require('jimp');
const fs = require('fs');


const app = express()
app.use(cors())
app.use(fileUpload())
app.use(express.static('static'))
const port = 4000

app.get('/', (req, res) => {
  res.send('.')
})

app.post('/upload', async (req, res) => {
  const inputImage = req.files.image
  const image = await Jimp.read(inputImage.data)
  image.posterize(4)
  image.resize({ w: 40 })
  await image.write('output.png')

  const path = __dirname + '/output.png'
  const img = fs.readFileSync(path);
  const base64 = Buffer.from(img).toString('base64');
  const data = 'data:image/png;base64,' + base64
  res.json({ data })
})

app.listen(port, () => {
  console.log(`API on port: ${port}`)
})
