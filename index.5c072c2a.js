function e(e){return e&&e.__esModule?e.default:e}var t="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:"undefined"!=typeof window?window:"undefined"!=typeof global?global:{},a={},r={},n=t.parcelRequired76b;null==n&&((n=function(e){if(e in a)return a[e].exports;if(e in r){var t=r[e];delete r[e];var n={id:e,exports:{}};return a[e]=n,t.call(n.exports,n,n.exports),n.exports}var i=new Error("Cannot find module '"+e+"'");throw i.code="MODULE_NOT_FOUND",i}).register=function(e,t){r[e]=t},t.parcelRequired76b=n);var i=n("7IoHk"),o=n("3PnVH"),s=n("8hXaC"),l=n("3A25W"),c=n("a0S8g"),d=n("caO0w"),u=n("iQDRY");const f=document.querySelector(".movie-list-container"),m=document.querySelector(".pagination"),p=document.querySelector(".header__form-item"),g=document.querySelector(".header__form-input");e(i).Notify.init(),p.addEventListener("submit",(async t=>{t.preventDefault();const a=g.value.trim();if(""!==a)try{const t={...l.defaultHeaderGet,...l.searchMovieUrl},r={...l.searchMovieParams,api_key:c.apikeyTMDB,query:a,page:1},n=(await(0,s.axiosGetData)(t,r)).data;0===n.results.length&&e(i).Notify.failure("Search result not successful. Enter the correct movie name and try again"),f.innerHTML="",(0,o.renderMoviePlaceholders)(f),(0,d.renderMovieList)(f,n.results),(0,u.setPagination)({headerRef:t,parametersRef:r,movieListContainer:f,paginationContainerRef:m,currentPageRef:n.page,totalPagesRef:n.total_pages})}catch(t){e(i).Notify.failure("Search result not successful. Enter the correct movie name and try again")}}));o=n("3PnVH"),s=n("8hXaC"),l=n("3A25W"),c=n("a0S8g"),d=n("caO0w"),u=n("iQDRY");const v=document.querySelector(".movie-list-container"),h=document.querySelector(".pagination");(0,o.renderMoviePlaceholders)(v);(async()=>{const e={...l.defaultHeaderGet,...l.trendingMovieTOP20Url},t={...l.trendingMovieTOP20Params,api_key:c.apikeyTMDB,page:1},a=await(0,s.axiosGetData)(e,t);return{header:e,parameters:t,movieListContainer:v,paginationContainer:h,movies:a}})().then((e=>function(e){(0,d.renderMovieList)(v,e.movies.data.results),(0,u.setPagination)({headerRef:e.header,parametersRef:e.parameters,movieListContainer:e.movieListContainer,paginationContainerRef:e.paginationContainer,currentPageRef:e.movies.data.page,totalPagesRef:e.movies.data.total_pages})}(e))).catch((e=>console.log(e))),n("4RzmW");
//# sourceMappingURL=index.5c072c2a.js.map
