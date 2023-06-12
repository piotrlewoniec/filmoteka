import Notiflix from 'notiflix';
import { renderMoviePlaceholders } from './noApi';
import { axiosGetData } from '../apirest/axiosGetData';
import { renderMovieList } from './cardgen';

const header = {};
const parameters = {};
const moviesContainer = {};

//const header = { ...defaultHeaderGet, ...searchMovieUrl };
//const parameters = { ...searchMovieParams, api_key: apikeyTMDB, query: searchQuery, page: 1 };

export function setPagination({
  headerRef,
  parametersRef,
  movieListContainer,
  paginationContainerRef,
  currentPageRef,
  totalPagesRef,
}) {
  header = headerRef;
  parameters = parametersRef;
  moviesContainer = movieListContainer;
  console.log('kuki');
  console.log(
    headerRef,
    parametersRef,
    movieListContainer,
    paginationContainerRef,
    currentPageRef,
    totalPagesRef,
  );
  renderPaginationButtons({
    paginationContainer: paginationContainerRef,
    currentPage: currentPageRef,
    totalPages: totalPagesRef,
  });
}

async function fetchMovies(page) {
  // Dodajemy notyfikację przed pobraniem filmów
  Notiflix.Loading.pulse('Pobieranie filmów...');
  let currentPageLocal, totalPagesLocal;
  try {
    parameters.page = page;
    const serverData = await axiosGetData(header, parameters);
    const movies = serverData.data;
    currentPageLocal = movies.page;
    totalPagesLocal = movies.total_pages;
    // movies.total_results

    moviesContainer.innerHTML = ''; // Wyczyszczenie wyników
    renderMoviePlaceholders(moviesContainer);
    renderMovieList(moviesContainer, movies.results);
    renderPaginationButtons({ currentPage: currentPageLocal, totalPages: totalPagesLocal });

    // Ukrywamy notyfikację po pobraniu filmów
    Notiflix.Loading.remove();
  } catch (error) {
    // Wyświetlamy notyfikację o błędzie
    Notiflix.Notify.failure('Wystąpił błąd podczas pobierania filmów');

    // Ukrywamy notyfikację po błędzie
    Notiflix.Loading.remove();
  }
}

function renderPaginationButtons({ paginationContainer, currentPage, totalPages }) {
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
