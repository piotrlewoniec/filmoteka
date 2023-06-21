import { localStorageSave, localStorageLoad } from '../system/localstorage';

const changeThemeButtons = document.querySelectorAll('.movie-list-change-theme');
const configVariable = 'filmotekaconfig';
changeThemeButtons.forEach(button => addChangeThemeEventListener(button));

function addChangeThemeEventListener(changeThemeButton) {
  changeThemeButton.addEventListener('click', event => {
    if (event.currentTarget.dataset.theme == 'onDark') {
      setDarkMode();
      if (configVariable in localStorage) {
        const configVariableLocal = localStorageLoad(configVariable);
        configVariableLocal.night = true;
        localStorageSave(configVariable, configVariableLocal);
      }
    } else {
      setLightMode();
      if (configVariable in localStorage) {
        const configVariableLocal = localStorageLoad(configVariable);
        configVariableLocal.night = false;
        localStorageSave(configVariable, configVariableLocal);
      }
    }
  });
}

function setDarkMode() {
  const section = document.querySelector('.movie-list-section');
  const container = document.querySelector('.movie-list-container');
  const buttonIconDay = document.querySelector('.icon-day');
  const buttonIconNight = document.querySelector('.icon-night');
  const body = document.querySelector('body');
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  // event.currentTarget.classList.add('is-hidden');
  section.classList.add('dark-mode');
  container.classList.add('dark-mode');
  body.style.backgroundColor = '#0e0d0d';
  buttonIconDay.classList.remove('is-hidden');
  buttonIconNight.classList.add('is-hidden');
  paginationButtons.forEach(button => {
    button.classList.add('dark-mode');
  });
}

function setLightMode() {
  const section = document.querySelector('.movie-list-section');
  const container = document.querySelector('.movie-list-container');
  const buttonIconDay = document.querySelector('.icon-day');
  const buttonIconNight = document.querySelector('.icon-night');
  const body = document.querySelector('body');
  const paginationButtons = document.querySelectorAll('.pagination-btn');
  section.classList.remove('dark-mode');
  container.classList.remove('dark-mode');
  body.style.backgroundColor = '#fff';
  buttonIconDay.classList.add('is-hidden');
  buttonIconNight.classList.remove('is-hidden');
  paginationButtons.forEach(button => {
    button.classList.remove('dark-mode');
  });
}

if (configVariable in localStorage) {
  const configVariableLocal = localStorageLoad(configVariable);
  if (configVariableLocal.night === true) {
    setDarkMode();
    // setTimeout(setDarkMode, 1000);
  } else {
    setLightMode();
    // setTimeout(setLightMode, 1000);
  }
}
