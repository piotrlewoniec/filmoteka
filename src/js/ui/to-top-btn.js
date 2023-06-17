window.addEventListener('scroll', function() {
    const scrollButton = document.querySelector('.scroll-to-top-button');
    const screenHeight = window.innerHeight;
  
    if (window.scrollY > screenHeight) {
      scrollButton.style.display = 'block';
    } else {
      scrollButton.style.display = 'none';
    }
  });


