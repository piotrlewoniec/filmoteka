const movieListContainer = document.querySelector('.movie-list-container');

movieListContainer.addEventListener('click', showMovieModal);

function showMovieModal() {
  const backdrop = document.querySelector('.movie-backdrop');
  const movieWindowContent = document.querySelector('.movie-modal');
  backdrop.classList.remove('is-hidden');
  movieWindowContent.insertAdjacentHTML(
    'beforeend',
    `<div>
<p>informacje o filmie</p> </div>`,
  );
  backdrop.onclick = function () {
    backdrop.classList.add('is-hidden');
    movieWindowContent.innerHTML = '';
  };
}
