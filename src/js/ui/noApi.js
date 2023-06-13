export function renderMoviePlaceholders(movieListContainer) {
  const placeholders = [];
  for (let i = 0; i < 20; i++) {
    placeholders.push(`<div class="movie-card--placeholder">
        <h3 class="movie-card--placeholder__title">Movie Poster Placeholder</h3>
      </div>`);
  }
  movieListContainer.innerHTML = placeholders.join(' ');
}
