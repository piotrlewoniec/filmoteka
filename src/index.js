import './sass/main.scss';
import './js/footer';
import { localStorageSave } from './js/system/localstorage';
const configVariable = 'filmotekaconfig';
const configDeafult = { night: false, mylibrary: false, queue: false };
if (configVariable in localStorage === false) {
  localStorageSave(configVariable, configDeafult);
}
