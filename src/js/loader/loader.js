import loaderTpl from '~/templates/loader.hbs';
const loaderInit = (el, whereInEl) => el.insertAdjacentHTML(whereInEl, loaderTpl());
export default loaderInit;