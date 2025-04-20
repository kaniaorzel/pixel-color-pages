const inputFile = document.getElementById('file');
const type = document.getElementById('type');
const output = document.getElementById('output');
const colors = document.getElementById('colors');
const grid = document.getElementById('grid');
let outputJson = {}


function render(){
  let isInGrid = type.value == "in-grid"
  colors.innerHTML = '';
  if(!isInGrid){
    colors.innerHTML = JSON.stringify(outputJson, null, "<br />");
  }

  gridOutput = "<table>"
  gridOutput += "<tr>"
  gridOutput += "<td></td>"
  for(let x = 1; x <= 20; ++x){
      gridOutput += "<td>"+x+"</td>"
  }

  gridOutput += "</tr>"
  for(let y = 1; y <= 25; ++y){
    gridOutput += "<tr>"
    gridOutput += "<td>"+y+"</td>"

    for(let x = 1; x <= 20; ++x){
      gridOutput += "<td>"
      gridOutput += isInGrid ? '' : ""

      gridOutput += "</td>"
    }
    gridOutput += "<td>"+y+"</td>"
    gridOutput += "</tr>"
  }
  gridOutput += "<tr>"
  gridOutput += "<td></td>"
  for(let x = 1; x <= 20; ++x){
      gridOutput += "<td>"+x+"</td>"
  }

  gridOutput += "</tr>"
  gridOutput += "</table>"


  grid.innerHTML = gridOutput
}


file.addEventListener('change', () => {
  const data = new FormData()
  const file = inputFile.files[0]
  data.append('image', file, file.name)

  fetch('/upload', { 
    method: 'POST',
    body: data
  }).then(
    async response => {
      const json = await response.json() 
      output.src = json.data
      outputJson = json.coordinates 
      render()
    }
  ).then(
    success => console.log(success) 
  ).catch(
    error => console.log(error) 
  );
})

type.addEventListener('change', () => {
  render();
})

