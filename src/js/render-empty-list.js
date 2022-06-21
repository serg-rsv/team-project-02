export default function renderEmptyList(domEl) {
  const markup = `<li id="empty-wraper">
        <p class="film_title emptylist">Nothing has been added</p>
    </li>`;
  domEl.insertAdjacentHTML('afterbegin', markup);
}
