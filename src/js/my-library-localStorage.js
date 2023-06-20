import { localStorageSave, localStorageLoad } from './system/localstorage';
import { localStorageLoadMovies } from './librarylocal/librarylocal';
import { renderMoviePlaceholder } from './ui/noapi';
import { setPagination } from './ui/pagination';

const libraryLocalName = 'mvmylib';
const configVariable = 'filmotekaconfig';
import { mvmylibdemo } from './config/mvmylibdemo';
//localStorageSave(libraryLocalName, mvmylibdemo);

const movieListContainer = document.querySelector('.movie-list-container');
const paginationContainer = document.querySelector('.pagination');
const btnWatched = document.querySelector('#watched');
const btnQueue = document.querySelector('#queue');

btnWatched.addEventListener('click', () => {
  localStorageLoadMovies(libraryLocalName, 'watched', movieListContainer, paginationContainer);
  btnWatched.classList.add('mylib-active');
  btnQueue.classList.remove('mylib-active');
  if (configVariable in localStorage) {
    const configVariableLocal = localStorageLoad(configVariable);
    configVariableLocal.mylibrary = true;
    configVariableLocal.queue = false;
    localStorageSave(configVariable, configVariableLocal);
  }
});
btnQueue.addEventListener('click', () => {
  localStorageLoadMovies(libraryLocalName, 'queue', movieListContainer, paginationContainer);
  btnWatched.classList.remove('mylib-active');
  btnQueue.classList.add('mylib-active');
  if (configVariable in localStorage) {
    const configVariableLocal = localStorageLoad(configVariable);
    configVariableLocal.mylibrary = true;
    configVariableLocal.queue = true;
    localStorageSave(configVariable, configVariableLocal);
  }
});

if (libraryLocalName in localStorage) {
  localStorageLoadMovies(libraryLocalName, 'watched', movieListContainer, paginationContainer);
  btnWatched.classList.add('mylib-active');
  btnQueue.classList.remove('mylib-active');
  setTimeout(() => {
    if (configVariable in localStorage) {
      const configVariableLocal = localStorageLoad(configVariable);
      configVariableLocal.mylibrary = true;
      configVariableLocal.queue = false;
      localStorageSave(configVariable, configVariableLocal);
    }
  }, 2000);
} else {
  renderMoviePlaceholder(movieListContainer);
}
