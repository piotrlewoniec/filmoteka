import { localStorageSave, localStorageLoad } from './system/localstorage';
import { renderMoviePlaceholder } from './ui/noApi';
import { axiosGetData } from './apirest/axiosGetData';
import {
  defaultHeaderGet,
  searchMovieDetailsUrl,
  searchMovieDetailsParams,
} from './config/stdquery';
import { apikeyTMDB } from './config/apikey';
import { renderMovieList } from './ui/cardgen';
import { setPagination } from './ui/pagination';

import { mvmylibdemo } from './config/mvmylibdemo';
localStorageSave('mvmylib', mvmylibdemo);

const movieListContainer = document.querySelector('.movie-list-container');
const paginationContainer = document.querySelector('.pagination');
const btnWatched = document.querySelector('#watched');
const btnQueue = document.querySelector('#queue');

btnWatched.addEventListener('click', () => {
  loadFromStorage('watched');
});
btnQueue.addEventListener('click', () => {
  loadFromStorage('queue');
});

async function loadFromStorage(movieInLib) {
  if ('mvmylib' in localStorage) {
    const mvmylibLocal = localStorageLoad('mvmylib');
    let mvmylibToDisplay = [];
    if (movieInLib === 'watched') {
      mvmylibToDisplay = mvmylibLocal.filter(movie => movie.watched);
    } else if (movieInLib === 'queue') {
      mvmylibToDisplay = mvmylibLocal.filter(movie => movie.queue);
    }
    if (mvmylibToDisplay.length === 0) {
      renderMoviePlaceholder(movieListContainer);
      return;
    }
    const arrayOfPromises = mvmylibToDisplay.map(async movie => {
      const header = { ...defaultHeaderGet, ...searchMovieDetailsUrl };
      header.url = `${movie.movieid}`;
      const parameters = { ...searchMovieDetailsParams, api_key: apikeyTMDB };
      const response = await axiosGetData(header, parameters);
      return response;
    });
    let serverData = await Promise.all(arrayOfPromises);
    for (let element of serverData) {
      element.data.genre_ids = element.data.genres.map(genre => genre.id);
    }
    const movies = serverData.map(data => data.data);
    renderMovieList(movieListContainer, movies);
    // console.log(movies);
    /*
    setPagination({
      headerRef: data.header,
      parametersRef: data.parameters,
      movieListContainer: movieListContainer,
      paginationContainerRef: paginationContainer,
      currentPageRef: data.movies.data.page,
      totalPagesRef: data.movies.data.total_pages,
    });
    */
  }
}

if ('mvmylib' in localStorage) {
  loadFromStorage('watched');
} else {
  renderMoviePlaceholder(movieListContainer);
}
