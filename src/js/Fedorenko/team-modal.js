import * as basicLightbox from 'basiclightbox';
import 'basiclightbox/src/styles/main.scss';

import teamCardTpl from '~/templates/team-card.hbs';
console.log('Hello');
const teamLink = document.querySelector('.js-team-link');
const data = [{
        id: '1',
        name: 'Сергій Рибак',
        description: 'Team Lead',
        image: 'https://i.ibb.co/1nNvV2q/Serhii.jpg',
        github: 'https://github.com/serg-rsv',
        linkdIn: 'https://www.linkedin.com/in/serhii-rybak-aaa300231/',
        mail: 'rybaksw@gmail.com',
    },
    {
        id: '2',
        name: 'Микола Тимощук',
        description: 'Scrum Master',
        image: 'https://i.ibb.co/8YQK80x/Nikolay.jpg',
        github: 'https://github.com/Nikolay-Tymoshchuk',
        linkdIn: 'https://www.linkedin.com/in/nikolay-timoshchuk-153384240/',
        mail: 'nikolaytymoshchuk@gmail.com',
    },
    {
        id: '3',
        name: 'Світлана Федоренко',
        description: 'Developer',
        image: 'https://i.ibb.co/TP00HH0/Sveta.jpg',
        github: 'https://github.com/Svetlana493',
        linkdIn: 'https://www.linkedin.com/in/svetlana-fedorenko-35a479231/',
        mail: 'fedorenkosvitlana726@gmail.com',
    },
    {
        id: '4',
        name: 'Дмитро Прокопцов',
        description: 'Developer',
        image: 'https://i.ibb.co/kGJFJBy/Dima.jpg',
        github: 'https://github.com/ProkoptsovD',
        linkdIn: 'https://www.linkedin.com/in/prokoptsovd',
        mail: 'fenderman1992@gmail.com',
    },
    {
        id: '5',
        name: 'Тетяна Михайленко',
        description: 'Developer',
        image: 'https://i.ibb.co/2y5PKtk/IMG-20210902-144410-1.jpg',
        github: 'https://github.com/Tata-git ',
        linkdIn: '',
        mail: 'fsd.tetiana@gmail.com',
    },
    {
        id: '6',
        name: 'Іван Скляр',
        description: 'Developer',
        image: 'https://i.ibb.co/jrV827N/Ivan.jpg',
        github: '  https://github.com/IvanSkliar',
        linkdIn: 'linkedin.com/in/ivan-skliar-404119228     ',
        mail: 'skliariv91@gmail.com ',
    },
    {
        id: '7',
        name: 'Ірина Гончар',
        description: 'Developer',
        image: 'https://i.ibb.co/NZTcJcL/Irina.jpg',
        github: 'https://github.com/irinaog',
        linkdIn: 'https://www.linkedin.com/in/irina-gonchar-170850241/',
        mail: 'goncharirina08@gmail.com',
    },
    {
        id: '8',
        name: 'Олександр Каплуненко',
        description: 'Developer',
        image: 'https://i.ibb.co/TT3RMgv/sasha.jpg',
        github: 'https://github.com/Kaplynenko',
        linkdIn: '',
        mail: 's.kaplynenko@gmail.com',
    },
    {
        id: '9',
        name: 'Тарас Бондар',
        description: 'Developer',
        image: 'https://i.ibb.co/kXScqRg/Taras.jpg',
        github: 'https://github.com/strelezzzz',
        linkdIn: 'linkedin.com/in/taras-bondar-468131119',
        mail: 'strelezzzz@gmai.com',
    },
];
teamLink.addEventListener('click', onTeamModalShow);

function onTeamModalShow() {
    const teamCardsMarkup = teamCardTpl(data);
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onCloseEsc);

    function onClick(e) {
        // e.target.classList.value === 'cards-container js-team list' ||
        e.target.classList.value === 'team__title' ||
            e.target.classList.value === 'team__title_accent' ||
            e.target.classList.value === 'basicLightbox' ?
            teamModal.close() :
            teamModal.show();

        if (localStorage.getItem('theme') === 'dark') {
            document.querySelector('.team-section').classList.add('dark-bg');
        }
    }

    function onCloseEsc(e) {
        e.code === 'Escape' ? teamModal.close() : teamModal.show();
    }

    const teamModal = basicLightbox.create(teamCardsMarkup, {
        onShow: () => {
            document.body.style.overflow = 'hidden';
        },
        onClose: () => {
            document.body.style.overflow = 'visible';
            document.removeEventListener('click', onClick);
            document.removeEventListener('keydown', onCloseEsc);
        },
    });

    teamModal.show();
}