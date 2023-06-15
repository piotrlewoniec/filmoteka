import { localStorageSave, localStorageLoad } from './system/localstorage';
import { localStorageLoadMovies } from './librarylocal/librarylocal';
import { renderMoviePlaceholder } from './ui/noApi';
import { setPagination } from './ui/pagination';

const libraryLocalName = 'mvmylib';
import { mvmylibdemo } from './config/mvmylibdemo';
//localStorageSave(libraryLocalName, mvmylibdemo);

const movieListContainer = document.querySelector('.movie-list-container');
const paginationContainer = document.querySelector('.pagination');
const btnWatched = document.querySelector('#watched');
const btnQueue = document.querySelector('#queue');

btnWatched.addEventListener('click', () => {
  localStorageLoadMovies(libraryLocalName, 'watched', movieListContainer);
});
btnQueue.addEventListener('click', () => {
  localStorageLoadMovies(libraryLocalName, 'queue', movieListContainer);
});

if (libraryLocalName in localStorage) {
  localStorageLoadMovies(libraryLocalName, 'watched', movieListContainer);
} else {
  renderMoviePlaceholder(movieListContainer);
}

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

/*
    const maxMoviesPerPage = 20;
    mvmylibToDisplay
0..19  20 
20..39 20 
40...59 20
tab.length/20 
Math.trunc(
if (mvmylibToDisplay.length <=20 ){
renderMovieList(movieListContainer, movies);
} else {

}



    */
