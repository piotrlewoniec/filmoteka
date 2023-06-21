import Notiflix from 'notiflix';
import debounce from 'lodash.debounce';
import { renderMoviePlaceholders } from './ui/noapi';
import { axiosGetData } from './apirest/axios-data';
import { defaultHeaderGet, searchMovieUrl, searchMovieParams } from './config/stdquery';
import { apikeyTMDB } from './config/apikey';
import { renderMovieList } from './ui/cardgen';
import { setPagination } from './ui/pagination';

const movieListContainer = document.querySelector('.movie-list-container');
const paginationContainer = document.querySelector('.pagination');
const searchForm = document.querySelector('.header__form-item');
const searchInput = document.querySelector('.header__form-input');
const formContainer = document.querySelector('.header__form');
const debounceDelay = 500;

Notiflix.Notify.init();
function clearMovieList() {
  movieListContainer.innerHTML = '';
}

searchForm.addEventListener('input', debounce(searchMovie, debounceDelay));
searchForm.addEventListener('submit', searchMovie);

async function searchMovie(event) {
  event.preventDefault();
  const searchQuery = searchInput.value.trim();
  if (searchQuery === '') {
    return;
  }
  Notiflix.Loading.pulse('Movies info download...');
  try {
    const header = { ...defaultHeaderGet, ...searchMovieUrl };
    const parameters = { ...searchMovieParams, api_key: apikeyTMDB, query: searchQuery, page: 1 };
    const serverData = await axiosGetData(header, parameters);
    Notiflix.Loading.remove();
    const movies = serverData.data;
    const formCopy = formContainer.firstElementChild;
    formContainer.replaceChildren();
    formContainer.appendChild(formCopy);
    // movies.page
    // movies.total_pages
    // movies.total_results
    if (movies.results.length === 0) {
      formContainer.insertAdjacentHTML(
        'beforeend',
        `<p class="header__form-alert">
          Search result not successful. Enter the correct movie name and try again
        </p>`,
      );
      Notiflix.Notify.failure(
        'Search result not successful. Enter the correct movie name and try again',
      );
      clearMovieList();
      paginationContainer.innerHTML = '';
      return;
    }
    clearMovieList();
    paginationContainer.innerHTML = '';
    renderMoviePlaceholders(movieListContainer);
    renderMovieList(movieListContainer, movies.results);
    if (movies.total_pages > 1) {
      setPagination({
        headerRef: header,
        parametersRef: parameters,
        movieListContainer: movieListContainer,
        paginationContainerRef: paginationContainer,
        currentPageRef: movies.page,
        totalPagesRef: movies.total_pages,
        isLocalStorageRef: false,
      });
    }
  } catch (error) {
    Notiflix.Notify.failure('Error downloading movies');
    Notiflix.Loading.remove();
  }
  searchInput.focus();
}
