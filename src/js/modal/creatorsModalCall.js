import { startListenModal } from '../Fedorenko/team-modal';

document.addEventListener('DOMContentLoaded', function () {
  /* Записываем в переменные массив элементов-кнопок и подложку.
      Подложке зададим id, чтобы не влиять на другие элементы с классом overlay*/
  let modalButton = document.querySelector('.js-open-modal'),
    overlay = document.querySelector('.js-overlay-modal'),
    closeButton = document.querySelector('#team-close-button');
  console.log('object :>> ', closeButton);

  /* Перебираем массив кнопок */
  /* Назначаем каждой кнопке обработчик клика */
  modalButton.addEventListener('click', function (e) {
    /* Предотвращаем стандартное действие элемента. Так как кнопку разные
            люди могут сделать по-разному. Кто-то сделает ссылку, кто-то кнопку.
            Нужно подстраховаться. */
    e.preventDefault();

    /* При каждом клике на кнопку мы будем забирать содержимое атрибута data-modal
            и будем искать модальное окно с таким же атрибутом. */
    let modalId = this.getAttribute('data-modal'),
      modalElem = document.querySelector('.modal-creators[data-modal="' + modalId + '"]');

    /* После того как нашли нужное модальное окно, добавим классы
            подложке и окну чтобы показать их. */
    modalElem.classList.add('active');
    overlay.classList.add('active');
    startListenModal();
  }); // end click

  closeButton.addEventListener('click', function (e) {
    const parentModal = e.target.closest('.modal-creators');
    console.log('e.target :>> ', e.target);
    parentModal.classList.remove('active');
    overlay.classList.remove('active');
    startListenModal(stop);
  });

  document.body.addEventListener('keydown', function (e) {
    let key = e.code;
    if (key !== 'Escape') return;
    const modalWindow = document.querySelector('.modal-creators.active');
    if (!modalWindow) return;
    modalWindow.classList.remove('active');
    document.querySelector('.overlay').classList.remove('active');
    startListenModal(stop);
  });

  overlay.addEventListener('click', function () {
    document.querySelector('.modal-creators.active').classList.remove('active');
    this.classList.remove('active');
    startListenModal(stop);
  });
});
