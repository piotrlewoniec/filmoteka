import { axiosGetData } from '../apirest/axiosGetData';
import {
  defaultHeaderGet,
  genresUrl,
  genresUrlParams,
  trailerUrl,
  trailerParams,
} from '../config/stdquery';
import { apikeyTMDB } from '../config/apikey';

export async function renderMovieList(movieListContainer, movieList) {
  console.log(movieList);
  const genres = await fetchGenres();
  const movieCards = movieList.map(async movie => {
    const key = await getMovieTrailerKey(movie);
    return `
     <div class="movie-card"> 
       <img class="movie-card__poster" 
         src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
         alt="${movie.title}" 
         loading="lazy" 
         width="280" 
         height="398" 
         srcset="
           https://image.tmdb.org/t/p/w342${movie.poster_path} 280w,
           https://image.tmdb.org/t/p/w780${movie.poster_path} 560w,
           https://image.tmdb.org/t/p/original${movie.poster_path} 840w,
           https://image.tmdb.org/t/p/w342${movie.poster_path} 336w,
           https://image.tmdb.org/t/p/w780${movie.poster_path} 672w,
           https://image.tmdb.org/t/p/original${movie.poster_path} 1008w,
           https://image.tmdb.org/t/p/w500${movie.poster_path} 395w,
           https://image.tmdb.org/t/p/original${movie.poster_path} 790w,
           https://image.tmdb.org/t/p/original${movie.poster_path} 1185w
         "
         sizes="(min-width: 1280px) 395px, (min-width: 768px) 336px, 280px"
      />
     <ul class="movie-card__info">
       <li class="movie-card__title">${truncateTitle(movie.title)}</li>
       <li class="movie-card__genre">${getGenresNamesAndYear(
         genres,
         movie.genre_ids,
         movie.release_date,
       )}</li>
     </ul>
     <button type="button" class="movie-card__trailer-button" 
     data-trailer-key="${key}">Trailer
<svg class="movie-card__trailer-icon" width="24px" height="24px" viewBox="0 0 32 32">
</svg>
</button>
    </div>
      `;
  });
  const markup = await Promise.all(movieCards);
  movieListContainer.innerHTML = markup.join(' ');
  activateTrailerButtons();
  createTrailerButtonIcons();
}

async function fetchGenres() {
  const header = { ...defaultHeaderGet, ...genresUrl };
  const parameters = { ...genresUrlParams, api_key: apikeyTMDB };
  const genres = await axiosGetData(header, parameters);
  return new Map(genres.data.genres.map(genre => [genre.id, genre.name]));
}

function truncateTitle(title) {
  return title.length < 33 ? title : title.slice(0, 29) + '...';
}

function getGenresNamesAndYear(genres, genre_ids, release_date) {
  const genresNames = getGenresNames(genres, genre_ids);
  const year = new Date(release_date).getFullYear();
  return genresNames + ' | ' + year;
}

function getGenresNames(genres, genre_ids) {
  const genresList = genre_ids.map(id => genres.get(id));
  let filteredGenres = [];
  if (genresList.length > 2) {
    filteredGenres = genresList.slice(0, 2);
    filteredGenres.push('Other');
  } else {
    filteredGenres = genresList;
  }
  return filteredGenres.join(', ');
}

async function getMovieTrailerKey(movie) {
  const header = { ...defaultHeaderGet, ...trailerUrl };
  header.url = `${movie.id}/videos`;
  const parameters = { ...trailerParams, api_key: apikeyTMDB };
  const trailers = await axiosGetData(header, parameters);
  const trailer = trailers.data.results.find(
    trailer => trailer.official && trailer.type == 'Trailer',
  );
  return trailer != undefined ? trailer.key : '';
}

function activateTrailerButtons() {
  const trailerButtons = document.querySelectorAll('.movie-card__trailer-button');
  trailerButtons.forEach(trailerButton => {
    trailerButton.onclick = function (event) {
      event.preventDefault();
      showTrailer(trailerButton.dataset.trailerKey);
    };
  });
}

function createTrailerButtonIcons() {
  const svgs = document.querySelectorAll('.movie-card__trailer-icon');
  for (const svg of svgs) {
    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'm6 4 20 12L6 28z');
    svg.appendChild(path);
  }
}

function showTrailer(key) {
  const iframe = document.querySelector('#youtube-player');
  loadTrailer(key, iframe);
  showTrailerModal(iframe);
}

function loadTrailer(key, iframe) {
  iframe.src = `https://www.youtube.com/embed/${key}`;
}

function showTrailerModal(iframe) {
  const backdrop = document.querySelector('.trailer-backdrop');
  backdrop.classList.remove('is-hidden');
  backdrop.onclick = function () {
    backdrop.classList.add('is-hidden');
    iframe.src = '';
  };
}
