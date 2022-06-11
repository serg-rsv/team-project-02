import loaderTpl from '~/templates/loader.hbs';

const loader = {
	
	show(el, place) { 
		if (place) {
			el.insertAdjacentHTML(place, loaderTpl());
		} else {
			el.insertAdjacentHTML('afterBegin', loaderTpl());
		}
	},
	hide() {
		if (!document.querySelector('.loader')) {
			return;
		}
		document.querySelector('.loader').remove();
	}
}

export default loader;