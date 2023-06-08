import './sass/main.scss';
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const movieListContainer = document.querySelector('.movie-list-container');

const config = {
  headers: {
    accept: 'application/json',
  },
  params: {
    api_key: '201a0d25c5ee0bd75c195a2bbfd9dec7',
  },
};

loadPopularMovies();

async function loadPopularMovies() {
  const genres = await fetchGenres();
  const movies = await fetchPopularMovies();
  renderMovieList(movies.data.results, genres);
}

async function fetchPopularMovies() {
  return axios.get('https://api.themoviedb.org/3/trending/movie/day?language=en-US', config);
}

async function fetchGenres() {
  const genres = await axios.get(
    'https://api.themoviedb.org/3/genre/movie/list?language=e',
    config,
  );
  return new Map(genres.data.genres.map(genre => [genre.id, genre.name]));
}

async function renderMovieList(movieList, genres) {
  console.log(movieList);
  const markup = movieList.map(movie => {
    return `
     <div class="movie-card"> 
       <img class="movie-card__poster" src="
https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${
      movie.title
    }" loading="lazy" width="280" height="398" />
     <ul class="movie-card__info">
       <li class="movie-card__title">${movie.title}</li>
       <li class="movie-card__genre">${getGenresNamesAndYear(
         genres,
         movie.genre_ids,
         movie.release_date,
       )}</li>
     </ul>
    </div>
      `;
  });
  movieListContainer.innerHTML = markup;
  console.log(movieListContainer);
}

function getGenresNamesAndYear(genres, genre_ids, release_date) {
  const genresNames = genre_ids.map(id => genres.get(id)).join(', ');
  const year = new Date(release_date).getFullYear();
  return genresNames + ' | ' + year;
}
