import formTpl from '~/templates/form.hbs';
export function autorisationFormCall() {
	const modal = basicLightbox.create(formTpl());
	modal.show();
	document.querySelector('.form_close-button').addEventListener('click', () => modal.close());
}
