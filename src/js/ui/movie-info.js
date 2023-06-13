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
    `<div class="movie-modal__info">
      <button class="button-close">
      <svg class="button-close__info" width="30px" height="30px">
      <use href="./images/decorations/icons.svg#icon-close"></use>
      </svg>
      </button>
      <p>Tu pojawią się informacje o filmie :)</p> </div>`,
  );
  const closeModalBtn = document.querySelector('.button-close');
  closeModalBtn.onclick = function () {
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
