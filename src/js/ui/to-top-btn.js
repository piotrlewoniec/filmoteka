const scrollButton = document.querySelector('.scroll-to-top-button');
scrollButton.style.display = 'none';
window.addEventListener('scroll', function () {
  const screenHeight = window.innerHeight;

  if (window.scrollY > screenHeight) {
    scrollButton.style.display = 'block';
  } else {
    scrollButton.style.display = 'none';
  }
});
