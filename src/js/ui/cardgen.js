import { axiosGetData } from '../apirest/axiosGetData';
import { defaultHeaderGet, genresUrl, genresUrlParams } from '../config/stdquery';
import { apikeyTMDB } from '../config/apikey';

export async function renderMovieList(movieListContainer, movieList) {
  const genres = await getGenres();
  const markup = movieList
    .map(movie => {
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
    </div>
      `;
    })
    .join(' ');
  movieListContainer.innerHTML = markup;
}

async function getGenres() {
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
