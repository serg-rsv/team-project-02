import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';

/**
 *
 * @param {*} data - Обязательный атрибут. Принимает разметку, которую необходимо отобразить в модальном окне.
 * Например функцию хендлбарса с разметкой.
 * @param {string} selector - Необязательный атрибут. Принимает селектор, валидный для document.querySelector.
 * Например '.form_close-button' или '[data-modal-close]'. Обязательно в кавычках. Это ссылка на кнопку закрытия
 * модального окна, если она предусмотрена.
 * @returns
 */

export function modalCall(data, selector) {
  const instance = basicLightbox.create(data, {
    onShow: () => document.body.classList.add('modal-open'),
    onClose: () => document.body.classList.remove('modal-open'),
  });
  instance.show();
  const markup =
    '<div class="background-container"><div class="stars"></div><div class="twinkling"></div></div>';
  document.querySelector('.basicLightbox').insertAdjacentHTML('beforeend', markup);
  document.body.addEventListener('keydown', onEscapeKeyDown);

  if (!selector) {
    return;
  }

  const newItem = document.querySelector(selector);
  newItem.addEventListener('click', () => instance.close());

  function onEscapeKeyDown(e) {
    if (e.key === 'Escape') {
      instance.close();
      document.body.removeEventListener('keydown', onEscapeKeyDown);
    }
  }

  // ========== Prokoptsov ================//
  // роблю ретурн instance, щоб закрити потів модалку з авторизацією
  return instance;
}
