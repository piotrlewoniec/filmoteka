function showHideLoader(element) {
  if (element.style.display === 'block') {
    element.style.display = 'none';
  } else {
    element.style.display = 'block';
  }
}

function loadContent() {
  const loaderElement = document.getElementById('loader');
  showHideLoader(loaderElement); 

  
  fetchData()
    .then(data => {
      
      showHideLoader(loaderElement);

      renderData(data);
    })
    .catch(error => {
      
      showHideLoader(loaderElement);

      showError(error);
    });
}

function fetchData() {
  const apiUrl = `https://api.themoviedb.org/3/movie/12345?api_key=${apikeyTMDB}`;

  return fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      return data;
    });
}

function renderData(data) {
  console.log('Tytuł filmu:', data.title);
}

function showError(error) {
  console.error('Błąd ładowania danych:', error);
}
