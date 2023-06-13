const movieListContainer = document.querySelector('.movie-list-container');

movieListContainer.addEventListener('click', showMovieModal);

function showMovieModal(event) {
  if (event.target.type === 'button') {
    return;
  }
  const backdrop = document.querySelector('.movie-backdrop');
  const movieWindowContent = document.querySelector('.movie-modal');
  backdrop.classList.remove('is-hidden');
  movieWindowContent.insertAdjacentHTML(
    'beforeend',
    `<div>
<p>informacje o filmie - DELEGACJA</p> </div>`,
  );
  backdrop.onclick = function () {
    backdrop.classList.add('is-hidden');
    movieWindowContent.innerHTML = '';
  };
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
