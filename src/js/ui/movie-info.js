import {
  localStorageGetMovieStatus,
  localStorageAddMovie,
  localStorageRemoveMovie,
  localStorageUpdateMovie,
  localStorageLoadMovies,
} from '../librarylocal/librarylocal';

import { axiosGetData } from '../apirest/axiosGetData';
import {
  defaultHeaderGet,
  searchMovieDetailsUrl,
  searchMovieDetailsParams,
} from '../config/stdquery';
import { apikeyTMDB } from '../config/apikey';

const movieListContainer = document.querySelector('.movie-list-container');

const libraryLocalName = 'mvmylib';

movieListContainer.addEventListener('click', showMovieModal);

async function showMovieModal(event) {
  if (event.target.type === 'button') {
    return;
  }
  const header = { ...defaultHeaderGet, ...searchMovieDetailsUrl };
  header.url = `${event.target.dataset.movieid}`;
  const parameters = { ...searchMovieDetailsParams, api_key: apikeyTMDB };
  const response = await axiosGetData(header, parameters);
  const backdrop = document.querySelector('.movie-backdrop');
  const movieWindowContent = document.querySelector('.movie-modal');
  const btnWatchedCaption = setBtnName(libraryLocalName, response.data.id, 'watchedStatus');
  const btnToWatchCaption = setBtnName(libraryLocalName, response.data.id, 'toWatchStatus');
  backdrop.classList.remove('is-hidden');
  movieWindowContent.insertAdjacentHTML(
    'beforeend',
    `<button class="button-close">
      <svg class="button-close__info" width="30px" height="30px" viewBox="0 0 32 32">
            </svg>
      </button>
      <img class="movie-info__img" 
         src="https://image.tmdb.org/t/p/w500${response.data.poster_path}"
         alt="${response.data.title}" 
         loading="lazy" 
         width="240" 
         height="357" 
                 srcset="
           https://image.tmdb.org/t/p/w342${response.data.poster_path} 240w,
           https://image.tmdb.org/t/p/w780${response.data.poster_path} 560w,
           https://image.tmdb.org/t/p/original${response.data.poster_path} 840w,
           https://image.tmdb.org/t/p/w342${response.data.poster_path} 264w,
           https://image.tmdb.org/t/p/w780${response.data.poster_path} 672w,
           https://image.tmdb.org/t/p/original${response.data.poster_path} 1008w,
           https://image.tmdb.org/t/p/w500${response.data.poster_path} 375w,
           https://image.tmdb.org/t/p/original${response.data.poster_path} 790w,
           https://image.tmdb.org/t/p/original${response.data.poster_path} 1185w
         "
         sizes="(min-width: 1280px) 375px, (min-width: 768px) 264px, 240px"
      />
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
              <p class="movie-info__headline">ABOUT</p>
              <p class="movie-info__about">${response.data.overview}</p>
              <ul class="movie-info__buttons">
                  <li>
                      <button class="movie-info__btn movie-info__btn--watched" type="button" data-action="watched" >${btnWatchedCaption}</button>
                  </li>
                  <li>
                      <button class="movie-info__btn" type="button" data-action="queue" >${btnToWatchCaption}</button>
                  </li>
              </ul>
  </div>
        `,
  );
  createModalButtonIcon();
  const closeModalBtn = document.querySelector('.button-close');
  closeModalBtn.onclick = function () {
    backdrop.classList.add('is-hidden');
    document.onkeydown = '';
    movieWindowContent.innerHTML = '';
  };

  document.onkeydown = function (evt) {
    evt = evt || window.event;
    let isEscape = false;
    if ('key' in evt) {
      isEscape = evt.key === 'Escape' || evt.key === 'Esc';
    } else {
      isEscape = evt.keyCode === 27;
    }
    if (isEscape) {
      closeModalBtn.onclick();
    }
  };

  const btnWatched = document.querySelector("[data-action='watched']");
  const btnToWatch = document.querySelector("[data-action='queue']");

  btnWatched.onclick = function () {
    if (btnWatched.innerText.toLowerCase() === 'add to watched') {
      const movie = localStorageGetMovieStatus(libraryLocalName, response.data.id);
      if (movie !== undefined) {
        localStorageUpdateMovie(libraryLocalName, response.data.id, 'watchedStatus');
        btnWatched.innerText = 'Remove from Watched';
      } else {
        localStorageAddMovie(libraryLocalName, response.data.id, 'watchedStatus');
        btnWatched.innerText = 'Remove from Watched';
      }
      refreshLibrary('watched');
      return;
    }
    if (btnWatched.innerText.toLowerCase() === 'remove from watched') {
      const movie = localStorageGetMovieStatus(libraryLocalName, response.data.id);
      if (movie.queue === true) {
        localStorageUpdateMovie(libraryLocalName, response.data.id, 'watchedStatus');
        btnWatched.innerText = 'Add to Watched';
      } else {
        localStorageRemoveMovie(libraryLocalName, response.data.id);
        btnWatched.innerText = 'Add to Watched';
      }
      refreshLibrary('watched');
      return;
    }
  };

  btnToWatch.onclick = function () {
    if (btnToWatch.innerText.toLowerCase() === 'add to queue') {
      const movie = localStorageGetMovieStatus(libraryLocalName, response.data.id);
      if (movie !== undefined) {
        localStorageUpdateMovie(libraryLocalName, response.data.id, 'toWatchStatus');
        btnToWatch.innerText = 'Remove from Queue';
      } else {
        localStorageAddMovie(libraryLocalName, response.data.id, 'toWatchStatus');
        btnToWatch.innerText = 'Remove from Queue';
      }
      refreshLibrary('queue');
      return;
    }
    if (btnToWatch.innerText.toLowerCase() === 'remove from queue') {
      const movie = localStorageGetMovieStatus(libraryLocalName, response.data.id);
      if (movie.watched === true) {
        localStorageUpdateMovie(libraryLocalName, response.data.id, 'toWatchStatus');
        btnToWatch.innerText = 'Add to Queue';
      } else {
        localStorageRemoveMovie(libraryLocalName, response.data.id);
        btnToWatch.innerText = 'Add to Queue';
      }
      refreshLibrary('queue');
      return;
    }
  };
}

function setBtnName(libraryName, movieid, btnType) {
  const movie = localStorageGetMovieStatus(libraryName, movieid);
  let btnName = '';
  if (movie !== undefined) {
    if (btnType === 'watchedStatus') {
      btnName = movie.watched ? 'Remove from Watched' : 'Add To Watched';
    } else if (btnType === 'toWatchStatus') {
      btnName = movie.queue ? 'Remove from Queue' : 'Add To Queue';
    }
  } else {
    switch (btnType) {
      case 'watchedStatus':
        btnName = 'Add To Watched';
        break;
      case 'toWatchStatus':
        btnName = 'Add To Queue';
        break;
      default:
        btnName = 'ooo';
    }
  }
  return btnName;
}

function createModalButtonIcon() {
  const svg = document.querySelector('.button-close__info');

  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  path.setAttribute('d', 'M8 8L22 22, M8 22L22 8');
  svg.appendChild(path);
}

function refreshLibrary(setStatus) {
  if (currentFileName() === 'my-library.html') {
    //resolve jak sprawdzić które są wyświetlane filmy watched czy towatch?? dodajemy zmienna eksportowaną?
    localStorageLoadMovies(libraryLocalName, setStatus, movieListContainer);
  }
}

function currentFileName() {
  let path = document.location.pathname;
  let page = path.split('/').pop();
  return page;
}

// <img class="movie-info__img"
// src="https://image.tmdb.org/t/p/w500${response.data.poster_path}"
// alt="${response.data.title}"
// loading="lazy"
// width="240"
// height="357"
// data-movieid="${movie.id}"
// srcset="
//   https://image.tmdb.org/t/p/w342${response.data.poster_path} 240w,
//   https://image.tmdb.org/t/p/w780${response.data.poster_path} 560w,
//   https://image.tmdb.org/t/p/original${response.data.poster_path} 840w,
//   https://image.tmdb.org/t/p/w342${response.data.poster_path} 264w,
//   https://image.tmdb.org/t/p/w780${response.data.poster_path} 672w,
//   https://image.tmdb.org/t/p/original${response.data.poster_path} 1008w,
//   https://image.tmdb.org/t/p/w500${response.data.poster_path} 375w,
//   https://image.tmdb.org/t/p/original${response.data.poster_path} 790w,
//   https://image.tmdb.org/t/p/original${response.data.poster_path} 1185w
// "
// sizes="(min-width: 1280px) 375px, (min-width: 768px) 264px, 240px"
// />
