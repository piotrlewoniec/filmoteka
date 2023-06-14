import { axiosGetData } from '../apirest/axiosGetData';
import {
  defaultHeaderGet,
  searchMovieDetailsUrl,
  searchMovieDetailsParams,
} from '../config/stdquery';
import { apikeyTMDB } from '../config/apikey';

const movieListContainer = document.querySelector('.movie-list-container');

movieListContainer.addEventListener('click', showMovieModal);

async function showMovieModal(event) {
  if (event.target.type === 'button') {
    return;
  }
  const header = { ...defaultHeaderGet, ...searchMovieDetailsUrl };
  header.url = `${event.target.dataset.movieid}`;
  const parameters = { ...searchMovieDetailsParams, api_key: apikeyTMDB };
  const response = await axiosGetData(header, parameters);
  console.log(`${response.data.original_title}`);
  const backdrop = document.querySelector('.movie-backdrop');
  const movieWindowContent = document.querySelector('.movie-modal');
  backdrop.classList.remove('is-hidden');
  movieWindowContent.insertAdjacentHTML(
    'beforeend',
    `<div class="movie-modal__info">
      <button class="button-close">
      <svg class="button-close__info" width="30px" height="30px" viewBox="0 0 32 32">
            </svg>
      </button>
      <div class="movie-info__container">
      <img class="" 
         src="https://image.tmdb.org/t/p/w500${response.data.poster_path}"
         alt="${response.data.title}" 
         loading="lazy" 
         width="240" 
         height="357" 
     
         sizes="(min-width: 1280px) 395px, (min-width: 768px) 336px, 280px"
      />
      <div class="movie-info__data"
      <h2 class="movie-info__title">${response.data.title}<h2>
      <ul class="movie-info">
        <li class="movie-info__vote">Vote / Votes ${response.data.vote_average} / ${response.data.vote_count}</li>
        <li class="movie-info__popularity">Popularity ${response.data.popularity}</li>
        <li class="movie-info__original">Original Title ${response.data.original_title}</li>
        <li class="movie-info__genre">Genre </li>
      </ul>
      <p class="movie-info__about">
      <h3>ABOUT</h3>
       ${response.data.overview}</p>

      <ul class="movie-info__buttons">
        <li>
        <button class="watched-button" type="button">Add to Watched</button>
        </li>
        <li>
        <button class="queue-button" type="button">Add to Queue</button>
        </li>
      </ul>
      </div>
      </div>
      </div>`,
  );
  createModalButtonIcon();
  const closeModalBtn = document.querySelector('.button-close');
  closeModalBtn.onclick = function () {
    backdrop.classList.add('is-hidden');
    movieWindowContent.innerHTML = '';
  };
}

function createModalButtonIcon() {
  const svg = document.querySelector('.button-close__info');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M8 8L22 22, M8 22L22 8');
  svg.appendChild(path);
}

// const movieCards = document.querySelectorAll('.movie-card');
// for (const movieCard of movieCards) {
//   movieCard.addEventListener('click', event => showMovieModal(event));
// }

// function showMovieModal(event) {
//   if (event.target.type == 'button') {
//     return;
//   }
//   const backdrop = document.querySelector('.movie-backdrop');
//   const movieWindowContent = document.querySelector('.movie-modal');
//   backdrop.classList.remove('is-hidden');
//   movieWindowContent.insertAdjacentHTML(
//     'beforeend',
//     `<div>

// <p>informacje o filmie - BEZ DELEGACJI</p> </div>`,
//   );
//   backdrop.onclick = function () {
//     backdrop.classList.add('is-hidden');
//     movieWindowContent.innerHTML = '';
//   };
// }
