const inputFile = document.getElementById('file');
const output = document.getElementById('output');
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
      console.log(json) 
    }
  ).then(
    success => console.log(success) 
  ).catch(
    error => console.log(error) 
  );
})
