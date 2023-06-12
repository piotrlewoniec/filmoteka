import { renderMoviePlaceholders } from './ui/noApi';
import { axiosGetData } from './apirest/axiosGetData';
import {
  defaultHeaderGet,
  trendingMovieTOP20Url,
  trendingMovieTOP20Params,
} from './config/stdquery';
import { apikeyTMDB } from './config/apikey';
import { renderMovieList } from './ui/cardgen';

const movieListContainer = document.querySelector('.movie-list-container');

renderMoviePlaceholders(movieListContainer);

const trendingMoviesGet = async () => {
  const header = { ...defaultHeaderGet, ...trendingMovieTOP20Url };
  const parameters = { ...trendingMovieTOP20Params, api_key: apikeyTMDB };
  const movies = await axiosGetData(header, parameters);
  return movies;
};

trendingMoviesGet()
  .then(movies => renderMovieList(movieListContainer, movies.data.results))
  .catch(error => console.log(error));
