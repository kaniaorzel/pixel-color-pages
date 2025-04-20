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
  image.quantize({colors: 4})
  image.resize({ w: 20 })
  await image.write('output.png')

  let colors = {}
  let ingrid = {}
  let coordinates = {}
  image.scan((x, y, idx) => {
    let color = (image.getPixelColor(x,y).toString(16)).substring(0,6)

    if(!(color in colors)) {
      let colorName = colorNamer("#"+color);
      let name = colorName.basic[0].name
      if(name == "white"){
        return
      }
      colors[color] = name
      if(!(name in coordinates)){
        coordinates[name] = ""
      }
    }

    coordinates[colors[color]] += "("+(x + 1)+","+(y+1)+"), "
    ingrid[(x+1)+"x"+(y+1)] = colors[color]
  });



  const path = __dirname + '/output.png'
  const img = fs.readFileSync(path);
  const base64 = Buffer.from(img).toString('base64');
  const data = 'data:image/png;base64,' + base64
  res.json({ data, ingrid, coordinates })
})

app.listen(port, () => {
  console.log(`API on port: ${port}`)
})
