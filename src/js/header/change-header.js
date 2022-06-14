// import * as basicLightbox from 'basiclightbox';
// import 'basiclightbox/src/styles/main.scss';
// import formTpl from '~/templates/form.hbs';

const refs = {
  header: document.querySelector('header'),
  containerHeader: document.querySelector('header>.container'),
  headerBox: document.querySelector('.header-box'),
  homeBtn: document.querySelectorAll('[data-load="home"]'),
  libraryBtn: document.querySelector('[data-load="library"]'),
  inputBox: document.querySelector('.input-box'),
  inputBoxLib: document.querySelector('.input-box-lib'),
};

refs.homeBtn.forEach(btn => btn.addEventListener('click', homeRender));
refs.libraryBtn.addEventListener('click', libraryRender);

function homeRender() {
  const { header, containerHeader, headerBox, homeBtn, libraryBtn, inputBox, inputBoxLib } = refs;

  if (!header.classList.contains('header-lib')) return;

  header.classList.remove('header-lib');
  containerHeader.classList.remove('container-lib');
  headerBox.classList.remove('header-box-lib');
  homeBtn[1].classList.add('current');
  libraryBtn.classList.remove('current');
  inputBox.classList.remove('visually-hidden');
  inputBoxLib.classList.add('visually-hidden');
}

function libraryRender(modal) {
  const { header, containerHeader, headerBox, homeBtn, libraryBtn, inputBox, inputBoxLib } = refs;

  // if (modal) {
  //   autorisationFormCall();
  //   autorizationFormUiValid();
  // }
  
  if (header.classList.contains('header-lib')) return;

  header.classList.add('header-lib');
  containerHeader.classList.add('container-lib');
  headerBox.classList.add('header-box-lib');
  homeBtn[1].classList.remove('current');
  libraryBtn.classList.add('current');
  inputBox.classList.add('visually-hidden');
  inputBoxLib.classList.remove('visually-hidden');  
}
export { homeRender, libraryRender };
 