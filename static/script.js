const inputFile = document.getElementById('file');
file.addEventListener('change', () => {
  const data = new FormData()
  const file = inputFile.files[0]
  data.append('image', file, file.name)

  fetch('http://0.0.0.0:4000/upload', { 
    method: 'POST',
    body: data
  }).then(
    response => response.json() 
  ).then(
    success => console.log(success) 
  ).catch(
    error => console.log(error) 
  );
})
