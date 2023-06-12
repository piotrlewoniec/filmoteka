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
  include_adult: true,
};
