const inputs = document.querySelectorAll('.auth-form__text-input');
inputs.forEach(input => input.addEventListener('blur', onBlur));
inputs.forEach(input => input.addEventListener('input', onInput));

function onBlur(e) {
  if (e.target.value.length > 0 && !e.target.validity.valid) {
    e.target.classList.add('auth-form__text-input--filled');
  } else {
    e.target.classList.remove('auth-form__text-input--filled');
  }
}

function onInput(e) {
  const btn = document.querySelector('.controls__btn--sign-in')
  btn.disabled = true;
  if (!e.target.validity.valid && e.target.parentNode.style.cssText == "--clr: #ff6b01") return;
  if (!e.target.validity.valid && e.target.parentNode.style.cssText != "--clr: #ff6b01") {
    e.target.parentNode.style.cssText = "--clr: #ff6b01";
    return
  }
  if (inputs[0].validity.valid && inputs[1].validity.valid) {
    btn.disabled = false;
  }
  e.target.parentNode.style.cssText = "--clr: #32a57f";
}