import nofilm from '../images/svg/nofilm.svg';
import noresult from '../images/svg/noresult.svg';

export function renderEmptyList(domEl) {
  const markup = `<li id="empty-wraper">
          <div class="imagewrapper">
          <img src="${nofilm}" alt="film babina"/>
        </div>
        <p class="film-card__title emptylist">Nothing has been added</p>
    </li>`;
  domEl.insertAdjacentHTML('afterbegin', markup);
}

export function renderEmptySearch(domEl) {
  const markup = `<li id="empty-wraper">
        <div class="imagewrapper">
          <img src="${noresult}" alt="sad smile"/>
        </div>
        <p class="film-card__title emptylist">Nothing found</p>
    </li>`;
  domEl.insertAdjacentHTML('afterbegin', markup);
}

export function renderNoMoreContent(domEl) {
  const markup = `<li id="no-content">
        <p class="film-card__title nomore-content">No more content</p>
    </li>`;
  domEl.insertAdjacentHTML('beforeend', markup);
}
