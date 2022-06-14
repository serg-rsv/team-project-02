// Функція реалізації безкінечної прокрутки за пошуком по тредовим фільмам
export async function renderTrendingInfinity() { 
  	const movies = await TmdbApiService.fetchTrendingMovies()			// робимо запит на сервер і отримує масив з даними про фіільми,які в тренді
	renderMainPage(movies); 		// викликаємо функцію рендеруючу сторінки з запиту
	if (movies.length < 20 || TmdbApiService.getTrendingPage() > TmdbApiService.getTrendingTotalPage()) return; 		//перевірка чи є необхідність викликати наступну сторінку
    loadMore(renderTrendingInfinity); // викликаємо функцію запуску безкінечної прокрутки
}

// Функція реалізації безкінечної прокрутки за пошуком по конкретному запиту
export async function renderQueryInfinity(query) {
  	const movies = await TmdbApiService.fetchSearchMovie(query); // робимо запит на сервер і отримує масив з даними про фіільми,які влаштовують наш пошук
	renderMainPage(movies); 			// викликаємо функцію рендеруючу сторінки з запиту
	if (movies.length < 20 || TmdbApiService.getSearchMoviePage() >= TmdbApiService.getSearchMovieTotalPage()) return;   //перевірка чи є необхідність викликати наступну сторінку
    loadMore(renderQueryInfinity, query);   // викликаємо функцію запуску безкінечної прокрутки, де query - атрибут для колбек функціі в LoadMore 
}


/**
 * 
 * @param {function} callback - Функція, яка буде викликана після того, як другий параметр (селектор) з'явиться на екрані.
 * @param {string} query - запит. Необов'язковий параметр, потрібен в якості атрибуту функциї callback.
 * @param {string} selector - Селектор елементу, після якого буде додано нові дані. Обсервер чекає, доки цей елемент з'явиться на сторінці. По замовчанню '.products__cards-item:last-child'.
 */
export function loadMore(callback, query, selector='.products__cards-item:last-child') {
	const observer = new IntersectionObserver((entries, observer) => {
		entries.forEach((entry) => {
			if (entry.isIntersecting) {
				observer.unobserve(entry.target);
        callback(query);
			}
		});
	}, {
		threshold: 0.5, // Процентне відношення елемента до відображення на екрані.
	});
	
observer.observe(document.querySelector(selector));
}

export { renderTrendingInfinity, renderQueryInfinity, loadMore };