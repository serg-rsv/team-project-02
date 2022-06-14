// функция для проверки валидности полей формы и визуального отображения изменений
export function autorizationFormUiValid() {

// Ищем поля ввода в форме авторизации и навешимаем на них события потери фокуса и изменения значения по вводу

  const inputs = document.querySelectorAll('.auth-form__text-input');
  inputs.forEach(input => input.addEventListener('blur', onBlur));
  inputs.forEach(input => input.addEventListener('input', onInput));

  // Функция обработчика потери фокуса полем ввода. Если валидация поля формы успешная, добавляем класс к полю ввода, который применит стили для подсветки поля.
  function onBlur(e) {
    if (e.target.value.length > 0 && !e.target.validity.valid) {
      e.target.classList.add('auth-form__text-input--filled');
    } else {
      e.target.classList.remove('auth-form__text-input--filled');
    }
  }

  // Функция обработчика изменения значения поля ввода. 
  function onInput(e) {

  // Ищем кнопку авторизации
    const btn = document.querySelector('.controls__btn--sign-in')
    btn.disabled = true;
  // Если поля формы введены не верно, выходим из функции
    if (!e.target.validity.valid && e.target.parentNode.style.cssText == "--clr: #ff6b01") return;
  // Если поля формы введены неверно, но стиль остался, как для верных, то меняем его на соответствующий
    if (!e.target.validity.valid && e.target.parentNode.style.cssText != "--clr: #ff6b01") {
      e.target.parentNode.style.cssText = "--clr: #ff6b01";
      return
    }
  // Если валидация полей формы успешная, включаем кнопку авторизации
    if (inputs[0].validity.valid && inputs[1].validity.valid) {
      btn.disabled = false;
    }
  // Если валидация полей формы успешная, меняем стиль поля ввода на соответствующий
    e.target.parentNode.style.cssText = "--clr: #32a57f";
  }
}