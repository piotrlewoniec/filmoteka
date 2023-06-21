import Notiflix from 'notiflix';
import { renderMoviePlaceholders } from './noapi';
import { axiosGetData } from '../apirest/axios-data';
import { renderMovieList } from './cardgen';
import { fetchMoviesDetails } from '../librarylocal/librarylocal';
import { localStorageLoad } from '../system/localstorage';

const configVariable = 'filmotekaconfig';
let header = {};
let parameters = {};
let moviesContainer = {};
let paginationContainer = {};
let moviesArray;
let currentPage = 1;
let moviesPageCount = 0;
let isLocalStorage = false;

export function setPagination({
  headerRef,
  parametersRef,
  movieListContainer,
  paginationContainerRef,
  currentPageRef,
  totalPagesRef,
  isLocalStorageRef,
}) {
  header = headerRef;
  parameters = parametersRef;
  moviesContainer = movieListContainer;
  paginationContainer = paginationContainerRef;
  isLocalStorage = isLocalStorageRef;
  currentPage = currentPageRef;
  moviesPageCount = totalPagesRef;
  paginationContainer.classList.add('pagination-container'); // Dodanie klasy 'pagination-container'
  renderPaginationButtons(currentPageRef, totalPagesRef);
  window.scrollBy({
    top: -document.body.offsetHeight,
    behavior: 'smooth',
  });
  // Reload pagination on screen size change
  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    // if (!e.matches) return;
    renderPaginationButtons(currentPage, moviesPageCount);
  });
}

export function setPaginationLocalStorage({
  moviesArrayRef,
  movieListContainer,
  paginationContainerRef,
  currentPageRef,
  totalPagesRef,
  isLocalStorageRef,
}) {
  moviesArray = moviesArrayRef;
  moviesContainer = movieListContainer;
  paginationContainer = paginationContainerRef;
  currentPage = currentPageRef;
  moviesPageCount = totalPagesRef;
  isLocalStorage = isLocalStorageRef;
  paginationContainer.classList.add('pagination-container'); // Dodanie klasy 'pagination-container'
  renderPaginationButtons(currentPageRef, totalPagesRef);
  fetchMovies(currentPageRef);
  window.scrollBy({
    top: -document.body.offsetHeight,
    behavior: 'smooth',
  });
  // Reload pagination on screen size change
  window.matchMedia('(min-width: 768px)').addEventListener('change', e => {
    // if (!e.matches) return;
    renderPaginationButtons(currentPage, moviesPageCount);
  });
}

async function fetchMovies(page) {
  Notiflix.Loading.pulse('Movies info download...');
  if (isLocalStorage) {
    const maxMoviesPerPage = 20;
    let startIndex = 0;
    let endIndex = 0;
    startIndex = maxMoviesPerPage * (page - 1);
    if (moviesArray.length % maxMoviesPerPage !== 0 && page === moviesPageCount) {
      endIndex = moviesArray.length;
    } else {
      endIndex = maxMoviesPerPage * page;
    }
    const moviesArrayFragment = moviesArray.slice(startIndex, endIndex);
    try {
      const moviesArrayFragmentDetails = await fetchMoviesDetails(moviesArrayFragment);
      moviesContainer.innerHTML = '';
      renderMovieList(moviesContainer, moviesArrayFragmentDetails);
      renderPaginationButtons(page, moviesPageCount);
      window.scrollBy({
        top: -document.body.offsetHeight,
        behavior: 'smooth',
      });
      currentPage = page;
      Notiflix.Loading.remove();
    } catch (error) {
      Notiflix.Notify.failure('Error downloading movies');
      Notiflix.Loading.remove();
    }
  } else {
    let currentPageLocal, totalPagesLocal;
    try {
      parameters.page = page;
      const serverData = await axiosGetData(header, parameters);
      const movies = serverData.data;
      currentPageLocal = movies.page;
      if (header.baseURL === 'https://api.themoviedb.org/3/trending/movie/day') {
        totalPagesLocal = 500;
      } else {
        totalPagesLocal = movies.total_pages;
      }
      moviesContainer.innerHTML = ''; // Wyczyszczenie wyników
      renderMoviePlaceholders(moviesContainer);
      renderMovieList(moviesContainer, movies.results);
      currentPage = currentPageLocal;
      moviesPageCount = totalPagesLocal;
      renderPaginationButtons(currentPageLocal, totalPagesLocal);
      window.scrollBy({
        top: -document.body.offsetHeight,
        behavior: 'smooth',
      });
      Notiflix.Loading.remove();
    } catch (error) {
      Notiflix.Notify.failure('Error downloading movies');
      Notiflix.Loading.remove();
    }
  }
}

function createDots(direction) {
  const button = document.createElement('button');
  button.textContent = '...';
  button.classList.add('pagination-btn', 'dots', `dots-${direction}`);
  button.addEventListener('click', function () {
    const currentPage = parseInt(
      paginationContainer.querySelector('.active').getAttribute('data-page'),
    );
    const offset = direction === 'left' ? -3 : 3;
    fetchMovies(currentPage + offset);
  });
  return button;
}

function renderPaginationButtons(currentPage, totalPages) {
  paginationContainer.innerHTML = ''; // Wyczyszczenie paginacji

  const isMobile = window.innerWidth <= 768; // Warunek dla urządzeń mobilnych
  const visibleButtons = isMobile ? 4 : 7;
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
      paginationContainer.appendChild(createDots('left'));
    }

    if (startPage === 2 && !isMobile) {
      paginationContainer.appendChild(createDots('left'));
    }
  }

  for (let i = startPage; i <= endPage; i++) {
    if (isMobile) {
      if (i === 100 || i > startPage + 3) continue;
    } else {
      if (i === 1000) continue;
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
      paginationContainer.appendChild(createDots('right'));
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

  const isDarkMode = () => {
    if (configVariable in localStorage) {
      const configVariableLocal = localStorageLoad(configVariable);
      if (configVariableLocal.night === false) {
        return false;
      } else {
        return true;
      }
    }
  };
  if (isDarkMode()) {
    for (const paginationItem of paginationContainer.querySelectorAll('button')) {
      paginationItem.classList.add('dark-mode');
    }
  } else {
    for (const paginationItem of paginationContainer.querySelectorAll('button')) {
      paginationItem.classList.remove('dark-mode');
    }
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

function getArrowSvg(direction) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
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
