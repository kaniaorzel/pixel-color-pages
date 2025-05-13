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
  const size = Number(req.body.size)
  const colorsNumber = Number(req.body.colors)
  const image = await Jimp.read(inputImage.data)
  image.resize({ w: 100 })
  image.quantize({colors: colorsNumber})
  image.resize({ w: size })
  await image.write('output.png')

  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  let colors = {}
  let ingrid = {}
  let coordinates = {}
  let colorNameCache = {}
  image.scan((x, y, idx) => {
    let color = (image.getPixelColor(x,y).toString(16)).substring(0,6)

    let name = colorNameCache[color] 
    if(name == undefined){
      let colorName = colorNamer("#"+color).basic;
      for(let i = 0; i <= 5; i++){
        if (colorName[i] == undefined){
          break;
        }

        name = colorName[i].name
        if(name == "white"){
          break
        }
        if(!(name in colors)) {
          break;
        }
      }
      colorNameCache[color] = name 
    }

    colors[color] = name
    if(!(name in coordinates)){
      coordinates[name] = ""
    }

    coordinates[colors[color]] += alphabet[x]+(y+1)+" "
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
