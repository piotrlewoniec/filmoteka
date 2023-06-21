import { renderMoviePlaceholders } from './ui/noapi';
import { axiosGetData } from './apirest/axios-data';
import {
  defaultHeaderGet,
  trendingMovieTOP20Url,
  trendingMovieTOP20Params,
} from './config/stdquery';
import { apikeyTMDB } from './config/apikey';
import { renderMovieList } from './ui/cardgen';
import { setPagination } from './ui/pagination';
import { localStorageSave, localStorageLoad } from './system/localstorage';
import Notiflix from 'notiflix';

const movieListContainer = document.querySelector('.movie-list-container');
const paginationContainer = document.querySelector('.pagination');
const configVariable = 'filmotekaconfig';

if (configVariable in localStorage) {
  const configVariableLocal = localStorageLoad(configVariable);
  configVariableLocal.mylibrary = false;
  localStorageSave(configVariable, configVariableLocal);
}

renderMoviePlaceholders(movieListContainer);

const trendingMoviesGet = async () => {
  Notiflix.Loading.pulse('Movies info download...');
  const header = { ...defaultHeaderGet, ...trendingMovieTOP20Url };
  const parameters = { ...trendingMovieTOP20Params, api_key: apikeyTMDB, page: 1 };
  const movies = await axiosGetData(header, parameters);
  const data = {
    header: header,
    parameters: parameters,
    movieListContainer: movieListContainer,
    paginationContainer: paginationContainer,
    movies: movies,
  };
  return data;
};

trendingMoviesGet()
  .then(data => displayResult(data))
  .catch(error => displayError(error));

function displayResult(data) {
  Notiflix.Loading.remove();
  renderMovieList(movieListContainer, data.movies.data.results);

  setPagination({
    headerRef: data.header,
    parametersRef: data.parameters,
    movieListContainer: data.movieListContainer,
    paginationContainerRef: data.paginationContainer,
    currentPageRef: data.movies.data.page,
    totalPagesRef: 500, //data.movies.data.total_pages
    isLocalStorageRef: false,
  });
}

function displayError(error) {
  Notiflix.Notify.failure('Error downloading movies');
  Notiflix.Loading.remove();
}
