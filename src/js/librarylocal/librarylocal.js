import { localStorageSave, localStorageLoad } from '../system/localstorage';
import { axiosGetData } from '../apirest/axios-data';
import {
  defaultHeaderGet,
  searchMovieDetailsUrl,
  searchMovieDetailsParams,
} from '../config/stdquery';
import { apikeyTMDB } from '../config/apikey';
import { renderMovieList } from '../ui/cardgen';
import { renderMoviePlaceholder } from '../ui/noapi';
import { setPaginationLocalStorage } from '../ui/pagination';
import Notiflix from 'notiflix';

function localStorageCreate(libraryName) {
  localStorageSave(libraryName, []);
}

export function localStorageGetMovieStatus(libraryName, movieid) {
  if (libraryName in localStorage) {
    const libraryLocal = localStorageLoad(libraryName);
    const movie = libraryLocal.find(movie => movie.movieid === movieid);
    return movie;
  }
}

export function localStorageAddMovie(libraryName, movieid, setStatus) {
  if (libraryName in localStorage === false) {
    localStorageCreate(libraryName);
  }
  if (libraryName in localStorage) {
    const libraryLocal = localStorageLoad(libraryName);
    if (setStatus === 'watchedStatus') {
      libraryLocal.push({ movieid: movieid, watched: true, queue: false });
    } else if (setStatus === 'toWatchStatus') {
      libraryLocal.push({ movieid: movieid, watched: false, queue: true });
    }
    localStorageSave(libraryName, libraryLocal);
  }
}

export function localStorageRemoveMovie(libraryName, movieid) {
  if (libraryName in localStorage) {
    const libraryLocal = localStorageLoad(libraryName);
    const elementIndex = libraryLocal.findIndex(element => element.movieid === movieid);
    if (elementIndex > -1) {
      libraryLocal.splice(elementIndex, 1);
      localStorageSave(libraryName, libraryLocal);
    }
  }
}

export function localStorageUpdateMovie(libraryName, movieid, setStatus) {
  if (libraryName in localStorage) {
    const libraryLocal = localStorageLoad(libraryName);
    const elementIndex = libraryLocal.findIndex(element => element.movieid === movieid);
    if (elementIndex > -1) {
      if (setStatus === 'watchedStatus') {
        libraryLocal[elementIndex].watched = libraryLocal[elementIndex].watched ? false : true;
        // libraryLocal.push({ movieid: movieid, watched: true, queue: false });
      } else if (setStatus === 'toWatchStatus') {
        libraryLocal[elementIndex].queue = libraryLocal[elementIndex].queue ? false : true;
      }
      localStorageSave(libraryName, libraryLocal);
    }
  }
}

export function localStorageLoadSelectedMovies(libraryName, movieStatus) {
  if (libraryName in localStorage) {
    const libraryLocal = localStorageLoad(libraryName);
    let libraryLocalToDisplay = [];
    if (movieStatus === 'watched') {
      libraryLocalToDisplay = libraryLocal.filter(movie => movie.watched);
    } else if (movieStatus === 'queue') {
      libraryLocalToDisplay = libraryLocal.filter(movie => movie.queue);
    }
    return libraryLocalToDisplay;
  } else return [];
}

export async function fetchMoviesDetails(moviesSelected) {
  const arrayOfPromises = moviesSelected.map(async movie => {
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
  const moviesDetails = serverData.map(data => data.data);
  return moviesDetails;
}

export async function localStorageLoadMovies(
  libraryName,
  movieStatus,
  movieListContainer,
  paginationContainer,
) {
  const moviesToDisplay = localStorageLoadSelectedMovies(libraryName, movieStatus);
  const maxMoviesPerPage = 20;
  let moviesPageCount = 0;
  movieListContainer.innerHTML = '';
  paginationContainer.innerHTML = '';
  if (moviesToDisplay.length === 0) {
    renderMoviePlaceholder(movieListContainer);
    return;
  }
  if (moviesToDisplay.length <= maxMoviesPerPage) {
    Notiflix.Loading.pulse('Movies info download...');
    try {
      const movies = await fetchMoviesDetails(moviesToDisplay);
      renderMovieList(movieListContainer, movies);
      Notiflix.Loading.remove();
      return;
    } catch {
      Notiflix.Notify.failure('Error downloading movies');
      Notiflix.Loading.remove();
      return;
    }
  } else if (moviesToDisplay.length % maxMoviesPerPage !== 0) {
    moviesPageCount = Math.trunc(moviesToDisplay.length / maxMoviesPerPage) + 1;
  } else if (moviesToDisplay.length % maxMoviesPerPage === 0) {
    moviesPageCount = moviesToDisplay.length / maxMoviesPerPage;
  }
  setPaginationLocalStorage({
    moviesArrayRef: moviesToDisplay,
    movieListContainer: movieListContainer,
    paginationContainerRef: paginationContainer,
    currentPageRef: 1,
    totalPagesRef: moviesPageCount,
    isLocalStorageRef: true,
  });
}
