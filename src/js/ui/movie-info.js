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
    `<button class="button-close">
      <svg class="button-close__info" width="30px" height="30px" viewBox="0 0 32 32">
            </svg>
      </button>
      <img class="movie-info__img" src="https://image.tmdb.org/t/p/w500${response.data.poster_path}"
    alt="${response.data.title}" loading="lazy" width="240" height="357"
    sizes="(min-width: 1280px) 395px, (min-width: 768px) 264px, 280px" />
<div class="movie-info__data">
    <h2 class="movie-info__title">${response.data.title}<h2>
            <div class="movie-info__details">
                <ul class="movie-info__params">
                    <li class="movie-info__params-item">Vote / Votes</li>
                    <li class="movie-info__params-item">Popularity</li>
                    <li class="movie-info__params-item">Original Title</li>
                    <li class="movie-info__params-item">Genre</li>
                </ul>
                <ul class="movie-info__results">
                    <li class="movie-info__results-item"><span class="movie-info__results-item--vote">${parseFloat(
                      response.data.vote_average.toFixed(1),
                    )}</span> / <span class="movie-info__results-item--count">${
      response.data.vote_count
    }</span></li>
                    <li class="movie-info__results-item">${response.data.popularity}</li>
                    <li class="movie-info__results-item">${response.data.original_title}</li>
                    <li class="movie-info__results-item">${response.data.genres
                      .map(genre => genre.name)
                      .join(', ')}</li>
                </ul>
            </div>
            <h3 class="movie-info__headline">ABOUT</h3>
            <p class="movie-info__about">${response.data.overview}</p>
            <ul class="movie-info__buttons">
                <li>
                    <button class="movie-info__btn movie-info__btn--watched" type="button">Add to Watched</button>
                </li>
                <li>
                    <button class="movie-info__btn" type="button">Add to Queue</button>
                </li>
            </ul>
</div>
      `,
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
