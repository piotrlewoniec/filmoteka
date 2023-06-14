export const defaultHeaderGet = {
  method: 'get',
  accept: 'application/json',
};

export const genresUrl = {
  baseURL: 'https://api.themoviedb.org/3/genre/movie/list',
};

export const genresUrlParams = {
  language: 'en',
};

export const trailerUrl = {
  baseURL: 'https://api.themoviedb.org/3/movie/',
  url: '',
};

export const trailerParams = {
  language: 'en-US',
};

export const trendingMovieTOP20Url = {
  baseURL: 'https://api.themoviedb.org/3/trending/movie/day',
};
export const trendingMovieTOP20Params = {
  language: 'en-US',
};

export const searchMovieUrl = {
  baseURL: 'https://api.themoviedb.org/3/search/movie',
};
export const searchMovieParams = {
  language: 'en-US',
  include_adult: false,
};

export const searchMovieDetailsUrl = {
  baseURL: 'https://api.themoviedb.org/3/movie/',
  url: '',
};

export const searchMovieDetailsParams = {
  language: 'en-US',
};
