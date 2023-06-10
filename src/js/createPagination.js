import axios from 'axios';
const moviesContainer = document.getElementById('movies');
const paginationContainer = document.querySelector('.pagination');
let currentPage = 1;
let totalPages = 0;

function fetchMovies(page) {
  axios
    .get('https://api.themoviedb.org/3/movie/changes', {
      params: {
        page: page,
        api_key: '201a0d25c5ee0bd75c195a2bbfd9dec7',
      },
    })
    .then(function (response) {
      moviesContainer.innerHTML = ''; // Wyczyszczenie wyników

      response.data.results.forEach(function (movie) {
        const movieElement = document.createElement('div');
        movieElement.textContent = movie.title;
        moviesContainer.appendChild(movieElement);
      });

      // Aktualizacja informacji o stronach
      currentPage = response.data.page;
      totalPages = response.data.total_pages;

      renderPaginationButtons();
    })
    .catch(function (error) {
      console.error(error);
    });
}

function renderPaginationButtons() {
  paginationContainer.innerHTML = ''; // Wyczyszczenie paginacji

  const visibleButtons = 7;
  let startPage = Math.max(currentPage - Math.floor(visibleButtons / 2), 1);
  let endPage = Math.min(startPage + visibleButtons - 1, totalPages);

  if (endPage - startPage < visibleButtons - 1) {
    startPage = Math.max(endPage - visibleButtons + 1, 1);
  }

  paginationContainer.appendChild(
    createNavigationButton('<', currentPage - 1, currentPage > 1, currentPage !== 1, 'btn-arrow'),
  );

  if (startPage > 1) {
    paginationContainer.appendChild(createPaginationButton(1));
    if (startPage > 2) {
      paginationContainer.appendChild(createDots());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    const button = createPaginationButton(i);
    if (i === currentPage) {
      button.classList.add('active');
    }
    button.addEventListener('click', function () {
      fetchMovies(i);
    });
    paginationContainer.appendChild(button);
  }

  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      paginationContainer.appendChild(createDots());
    }

    paginationContainer.appendChild(createPaginationButton(totalPages));
  }

  paginationContainer.appendChild(
    createNavigationButton(
      '>',
      currentPage + 1,
      currentPage < totalPages,
      currentPage !== totalPages,
      'btn-arrow',
    ),
  );

  const button1 = paginationContainer.querySelector('button[data-page="1"]');
  if (button1) {
    button1.addEventListener('click', function () {
      if (currentPage !== 1) {
        fetchMovies(1);
      }
    });
  }

  const buttonLast = paginationContainer.querySelector('button[data-page="' + totalPages + '"]');
  if (buttonLast) {
    buttonLast.addEventListener('click', function () {
      if (currentPage !== totalPages) {
        fetchMovies(totalPages);
      }
    });
  }
}

function createPaginationButton(page) {
  const button = document.createElement('button');
  button.textContent = page;
  button.setAttribute('data-page', page);
  button.classList.add('pagination-btn');
  return button;
}

function createNavigationButton(text, page, enabled, visible, className) {
  const button = document.createElement('button');
  button.textContent = text;
  button.disabled = !enabled;
  button.style.visibility = visible ? 'visible' : 'hidden';
  button.setAttribute('data-page', page);
  button.classList.add(className);
  button.addEventListener('click', function () {
    fetchMovies(page);
  });
  return button;
}

function createDots() {
  const dots = document.createElement('span');
  dots.textContent = '...';
  dots.classList.add('dots');
  return dots;
}

fetchMovies(currentPage);
