const API_KEY = '5ce599886a4c0703a030654068991e03';
const BASE_URL = 'https://api.themoviedb.org/3/';
const form = document.querySelector(".input-box");
const search = document.querySelector(".header_input");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    const apiBaseUrl = '${BASE_URL}${search.value}'
    if (search.value){
        getMovies (apiBaseUrl);
    };
});

