async function getData() {
  try {
    const response = await axios(
      {
        method: 'get',
        baseURL: 'https://pixabay.com/api',
        params: {
          key: '34529652-cc8793dd1496f54354573213f',
          image_type: 'photo',
          orientation: 'horizontal',
          safesearch: true,
          per_page: 40,
          page: pagination,
          q: searchString,
        },
      },
      { signal: AbortSignal.timeout(5000) },
    );
    if (response.data.hits.length !== 0) {
      searchedDataLocal = response.data;
    } else {
      searchedDataLocal = -1;
    }
    if (searchedDataLocal === -1 && !loadMore) {
      Notiflix.Notify.info(
        'Sorry, there are no images matching your search query. Please try again.',
      );
    } else if (searchedDataLocal === -1 && loadMore) {
      pointerObj.loadMoreBtn.style.display = 'none';
      Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
    } else {
      pointerObj.searchedData = searchedDataLocal;
      if (pagination < 13) {
        pointerObj.loadMoreBtn.style.display = '';
      }
      if (pagination === 1) {
        Notiflix.Notify.success(`Hooray! We found ${pointerObj.searchedData.totalHits} images.`);
      }
      pointerObj.galleryDisplay(loadMore);
    }
  } catch (error) {
    const errorMn = error.toJSON();
    Notiflix.Notify.failure(`${errorMn}`);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      Notiflix.Notify.failure(`${error.response.data}`);
      Notiflix.Notify.failure(`${error.response.status}`);
      Notiflix.Notify.failure(`${error.response.headers}`);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      Notiflix.Notify.failure(`${error.request}`);
    } else {
      // Something happened in setting up the request that triggered an Error
      Notiflix.Notify.failure(`Error ${error.message}`);
    }
    Notiflix.Notify.failure(`${error.config}`);
  }
}
