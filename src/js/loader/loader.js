import loaderTpl from '~/templates/loader.hbs';

const loader = {
	
	/**
	 * 
	 * @param {string} el - обвов'язковий параметр. Елемент, в якому буде відображатися лоадер. 
	 * @param {string} place - необов'язковий параметр. Місце, куди в елементі el вставляємо loader(якщо не вказати, то по замовчанню вставить спочатку елемнта).
	 */
	show(el, place) {
		if (!el) {
			el = document.body;
		}
		if (place) {
			el.insertAdjacentHTML(place, loaderTpl());
		} else {
			el.insertAdjacentHTML('afterBegin', loaderTpl());
		}
	},
	// Прибрати лоадер
	hide() {
		if (!document.querySelector('.loader')) {
			return;
		}
		document.querySelector('.loader').remove();
	}
}

export default loader;