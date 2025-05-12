const inputFile = document.getElementById('file');
const type = document.getElementById('type');
const output = document.getElementById('output');
const colorsList = document.getElementById('colorsList');
const grid = document.getElementById('grid');
const generate = document.getElementById('generate');
const throbber = document.getElementById('throbber');
const result = document.getElementById('result');
const size = document.getElementById('size');
const colors = document.getElementById('colors');
let outputJson = {}


function render(){
  throbber.classList.add('hide')
  result.classList.remove('hide')
  let width = size.value
  let isInGrid = type.value == "in-grid"
  colorsList.innerHTML = '';
  if(!isInGrid){
    colorsList.innerHTML = JSON.stringify(outputJson.coordinates, null, "<br />");
  }

  let colorsArray = []
  if(isInGrid){
    colorsArray = Object.keys(outputJson.coordinates)
    colorsArray.forEach((key, index) => {
     colorsList.innerHTML += index + " - " + key + "<br />"
    })
  }
  let alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  gridOutput = "<table>"
  gridOutput += "<tr>"
  gridOutput += "<td></td>"
  for(let x = 0; x <= width; ++x){
      gridOutput += "<td>"+alphabet[x]+"</td>"
  }

  gridOutput += "</tr>"
  for(let y = 1; y <= width*1.2; ++y){
    gridOutput += "<tr>"
    gridOutput += "<td>"+y+"</td>"

    for(let x = 1; x <= width; ++x){
      gridOutput += "<td>"
      let value = colorsArray.indexOf(outputJson.ingrid[x+"x"+y])
      gridOutput += isInGrid && value >= 0 ? value : ""

      gridOutput += "</td>"
    }
    gridOutput += "<td>"+y+"</td>"
    gridOutput += "</tr>"
  }
  gridOutput += "<tr>"
  gridOutput += "<td></td>"
  for(let x = 0; x <= width; ++x){
      gridOutput += "<td>"+alphabet[x]+"</td>"
  }

  gridOutput += "</tr>"
  gridOutput += "</table>"


  grid.innerHTML = gridOutput
}


generate.addEventListener('click', (e) => {
  e.preventDefault()


  const data = new FormData()
  const file = inputFile.files[0]

  if(file === undefined){
    alert('File cannot be empty!')
    return
  }

  data.append('image', file, file.name)
  data.append('size', size.value)
  data.append('colors', colors.value)
  
  throbber.classList.remove('hide')
  result.classList.add('hide')

  fetch('/upload', { 
    method: 'POST',
    body: data
  }).then(
    async response => {
      const json = await response.json() 
      output.src = json.data
      outputJson = json
      render()
    }
  ).catch(
    error => {
      console.log(error) 
      alert(error)
    }
  );
})


