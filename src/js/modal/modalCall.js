import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';


/**
 * 
 * @param {*} data - Обязательный атрибут. Принимает данные, которые необходимо отобразить в модальном окне. Например функцию хендлбарса с разметкой
 * @param {string} selector - Необязательный атрибут. Принимает селектор, валидный для document.querySelector. Например '.form_close-button' или '[data-modal-close]'. Обязательно в кавычках. Это ссылка на кнопку закрытия модального окна, если она предусмотрена.
 * @returns 
 */

export function modalCall(data, selector) {
  const instance = basicLightbox.create(data);
  console.log('selector :>> ', `'${selector}'`);
  instance.show();
  document.body.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      instance.close();
    }
  })
  if (!selector) {
    return;
  }
  const newItem = document.querySelector(selector);
  newItem.addEventListener('click', () => instance.close());
}