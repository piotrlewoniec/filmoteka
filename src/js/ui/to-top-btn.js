window.addEventListener('scroll', function() {
  const button = document.querySelector('.scroll-to-top-button');
  const scrollPosition = window.scrollY;

 
  if (scrollPosition > window.innerHeight) {
    button.classList.add('show');
  } else {
    button.classList.remove('show');
  }
});

document.querySelector('.scroll-to-top-button').addEventListener('click', function() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});







