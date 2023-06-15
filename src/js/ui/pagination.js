import Notiflix from 'notiflix';
import { renderMoviePlaceholders } from './noApi';
import { axiosGetData } from '../apirest/axiosGetData';
import { renderMovieList } from './cardgen';

let header = {};
let parameters = {};
let moviesContainer = {};
let paginationContainer = {};

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
  paginationContainer = paginationContainerRef;
  paginationContainer.classList.add('pagination-container'); // Dodanie klasy 'pagination-container'
  renderPaginationButtons(currentPageRef, totalPagesRef);
  window.scrollBy({
    top: -document.body.offsetHeight,
    behavior: 'smooth',
  });
}

// Dodajemy notyfikację przed pobraniem filmów
async function fetchMovies(page) {
  Notiflix.Loading.pulse('Pobieranie filmów...');
  let currentPageLocal, totalPagesLocal;
  try {
    parameters.page = page;
    const serverData = await axiosGetData(header, parameters);
    const movies = serverData.data;
    currentPageLocal = movies.page;
    totalPagesLocal = movies.total_pages;

    moviesContainer.innerHTML = ''; // Wyczyszczenie wyników
    renderMoviePlaceholders(moviesContainer);
    renderMovieList(moviesContainer, movies.results);
    renderPaginationButtons(currentPageLocal, totalPagesLocal);
    window.scrollBy({
      top: -document.body.offsetHeight,
      behavior: 'smooth',
    });

    // Ukrywamy notyfikację po pobraniu filmów
    Notiflix.Loading.remove();
  } catch (error) {
    // Wyświetlamy notyfikację o błędzie
    Notiflix.Notify.failure('Wystąpił błąd podczas pobierania filmów');

    // Ukrywamy notyfikację po błędzie
    Notiflix.Loading.remove();
  }
}

function renderPaginationButtons(currentPage, totalPages) {
  paginationContainer.innerHTML = ''; // Wyczyszczenie paginacji

  const isMobile = window.innerWidth <= 768; // Warunek dla urządzeń mobilnych

  const visibleButtons = isMobile ? 4 : 7; // Liczba widocznych przycisków
  let startPage = Math.max(currentPage - Math.floor(visibleButtons / 2), 1);
  let endPage = Math.min(startPage + visibleButtons - 1, totalPages);

  if (endPage - startPage < visibleButtons - 1) {
    startPage = Math.max(endPage - visibleButtons + 1, 1);
  }

  paginationContainer.appendChild(
    createNavigationButton(
      getArrowSvg('left'),
      currentPage - 1,
      currentPage > 1,
      currentPage !== 1,
      'btn-arrow',
    ),
  );

  if (startPage > 1) {
    paginationContainer.appendChild(createPaginationButton(1));
    if (startPage > 2 && !isMobile) {
      paginationContainer.appendChild(createDots());
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    if (isMobile) {
      if (i === 100 || i > startPage + 3) continue; // Pominięcie przycisku 1000 oraz przycisków powyżej startPage + 3 na urządzeniach mobilnych
    } else {
      if (i === 1000) continue; // Pominięcie przycisku 1000 na nie-mobilnych urządzeniach
    }
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
    if (endPage < totalPages - 1 && !isMobile) {
      paginationContainer.appendChild(createDots());
    }

    paginationContainer.appendChild(createPaginationButton(totalPages));
  }

  paginationContainer.appendChild(
    createNavigationButton(
      getArrowSvg('right'),
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
  button.innerHTML = text;
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

function getArrowSvg(direction) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  // svg.setAttribute('class', 'xx');
  svg.setAttribute('width', '16px');
  svg.setAttribute('height', '16px');
  svg.setAttribute('viewBox', '0 0 32 32');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  if (direction === 'left') {
    path.setAttribute(
      'd',
      'M12.586 27.414l-10-10c-0.781-0.781-0.781-2.047 0-2.828l10-10c0.781-0.781 2.047-0.781 2.828 0s0.781 2.047 0 2.828l-6.586 6.586h19.172c1.105 0 2 0.895 2 2s-0.895 2-2 2h-19.172l6.586 6.586c0.39 0.39 0.586 0.902 0.586 1.414s-0.195 1.024-0.586 1.414c-0.781 0.781-2.047 0.781-2.828 0z',
    );
  } else if (direction === 'right') {
    path.setAttribute(
      'd',
      'M19.414 27.414l10-10c0.781-0.781 0.781-2.047 0-2.828l-10-10c-0.781-0.781-2.047-0.781-2.828 0s-0.781 2.047 0 2.828l6.586 6.586h-19.172c-1.105 0-2 0.895-2 2s0.895 2 2 2h19.172l-6.586 6.586c-0.39 0.39-0.586 0.902-0.586 1.414s0.195 1.024 0.586 1.414c0.781 0.781 2.047 0.781 2.828 0z',
    );
  }

  svg.appendChild(path);

  return svg.outerHTML;
}
