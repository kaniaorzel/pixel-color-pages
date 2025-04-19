const express = require("express")
const cors = require('cors')
const colorNamer = require('color-namer')
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
  image.resize({ w: 200 })
  image.quantize({colors: 6})
  image.resize({ w: 20 })
  await image.write('output.png')

  let colors = {}
  image.scan((x, y, idx) => {
    const color = image.getPixelColor(x,y)
    const colorName = colorNamer("#"+(color).toString(16));
    const name = colorName.basic[0].name
    if(colors[name] == undefined) {
      colors[name] = ""
    }

    colors[name] += "("+x+","+y+"), "
  });


  const path = __dirname + '/output.png'
  const img = fs.readFileSync(path);
  const base64 = Buffer.from(img).toString('base64');
  const data = 'data:image/png;base64,' + base64
  res.json({ data, colors })
})

app.listen(port, () => {
  console.log(`API on port: ${port}`)
})
