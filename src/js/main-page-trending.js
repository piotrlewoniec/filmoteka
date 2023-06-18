import { renderMoviePlaceholders } from './ui/noApi';
import { axiosGetData } from './apirest/axiosGetData';
import {
  defaultHeaderGet,
  trendingMovieTOP20Url,
  trendingMovieTOP20Params,
} from './config/stdquery';
import { apikeyTMDB } from './config/apikey';
import { renderMovieList } from './ui/cardgen';
import { setPagination } from './ui/pagination';

const movieListContainer = document.querySelector('.movie-list-container');
const paginationContainer = document.querySelector('.pagination');

renderMoviePlaceholders(movieListContainer);

const trendingMoviesGet = async () => {
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
  .catch(error => console.log(error));

function displayResult(data) {
  renderMovieList(movieListContainer, data.movies.data.results);
  setPagination({
    headerRef: data.header,
    parametersRef: data.parameters,
    movieListContainer: data.movieListContainer,
    paginationContainerRef: data.paginationContainer,
    currentPageRef: data.movies.data.page,
    totalPagesRef: data.movies.data.total_pages,
    isLocalStorageRef: false,
  });
}
