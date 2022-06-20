// import teamCardTpl from '../../templates/team-card.hbs';
import creatorCardTpl from '../../templates/creator-card.hbs';
import { modalCall } from '../modal/modalCall';

const searchIdItem = document.querySelectorAll('.team-list__image');
const creatorCardinModal = document.querySelector('.person-card');
const itemForHide = document.querySelector('.person-data');
const data = [
  {
    id: 'serhii',
    name: 'Serhii Rybak',
    position: 'team lead',
    imagesolar1xURL: 'https://i.ibb.co/xst44J2/sergiy-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/dJBfH4W/sergiy-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/tqxd92y/sergiy-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/8P0jJF5/sergiy-2x.png',
    github: 'https://github.com/serg-rsv',
    linkdIn: 'https://www.linkedin.com/in/serhii-rybak-aaa300231/',
    mail: 'rybaksw@gmail.com',
  },
  {
    id: 'mykola',
    name: 'Mykola Tymoshchuk',
    position: 'scrum master',
    imagesolar1xURL: 'https://i.ibb.co/pLq8RhN/mykola-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/yfkLn1F/mykola-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/8jZdGG9/mykola-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/jrvrf52/mykola-2x.png',
    github: 'https://github.com/Nikolay-Tymoshchuk',
    linkdIn: 'https://www.linkedin.com/in/nikolay-timoshchuk-153384240/',
    mail: 'nikolaytymoshchuk@gmail.com',
  },
  {
    id: 'svitlana',
    name: 'Svitlana Fedorenko',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/b3V73BW/svetlana-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/HqK719x/svetlana-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/94XfySt/svetlana-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/0XvBsyj/svetlana-2x.png',
    github: 'https://github.com/Svetlana493',
    linkdIn: 'https://www.linkedin.com/in/svetlana-fedorenko-35a479231/',
    mail: 'fedorenkosvitlana726@gmail.com',
  },
  {
    id: 'dmytro',
    name: 'Dmytro Prokoptsov',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/dQHnGkY/dmytro-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/5TcNc29/dmytro-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/0mv7H0S/dmytro-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/WzRwSB0/dmytro-2x.png',
    github: 'https://github.com/ProkoptsovD',
    linkdIn: 'https://www.linkedin.com/in/prokoptsovd',
    mail: 'fenderman1992@gmail.com',
  },
  {
    id: 'tetiana',
    name: 'Tetiana Mykhailenko',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/dLX5vx6/tetyana-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/mbX3H3k/tetyana-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/HXsW5c8/tetyana-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/qDySKmv/tetyana-2x.png',
    github: 'https://github.com/Tata-git ',
    linkdIn: 'https://www.linkedin.com/',
    mail: 'fsd.tetiana@gmail.com',
  },
  {
    id: 'ivan',
    name: 'Ivan Skliar',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/VY9x9GH/ivan-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/3YVsxbz/ivan-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/CbgTNBW/ivan-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/k95yLTB/ivan-2x.png',
    github: '  https://github.com/IvanSkliar',
    linkdIn: 'linkedin.com/in/ivan-skliar-404119228     ',
    mail: 'skliariv91@gmail.com ',
  },
  {
    id: 'iryna',
    name: 'Iryna Honchar',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/HGtzmv4/iryna-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/TWxq9Km/iryna-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/J5H77xw/iryna-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/rHb9MY8/iryna-2x.png',
    github: 'https://github.com/irinaog',
    linkdIn: 'https://www.linkedin.com/in/irina-gonchar-170850241/',
    mail: 'goncharirina08@gmail.com',
  },
  {
    id: 'oleksandr',
    name: 'Oleksandr Kaplunenko',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/6XcfX6L/oleksandr-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/fSxPBwK/oleksandr-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/sP3xBwX/oleksandr-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/jZDMd1z/oleksandr-2x.png',
    github: 'https://github.com/Kaplynenko',
    linkdIn: 'https://www.linkedin.com/',
    mail: 's.kaplynenko@gmail.com',
  },
  {
    id: 'taras',
    name: 'Taras Bondar',
    position: 'developer',
    imagesolar1xURL: 'https://i.ibb.co/vPqXLRc/taras-1x.png',
    imagesolar2xURL: 'https://i.ibb.co/7vmrbQV/taras-2x.png',
    imagecolorized1xURL: 'https://i.ibb.co/whfzsTN/taras-1x.png',
    imagecolorized2xURL: 'https://i.ibb.co/VS27G5n/taras-2x.png',
    github: 'https://github.com/strelezzzz',
    linkdIn: 'https://www.linkedin.com/in/taras-bondar-468131119',
    mail: 'strelezzzz@gmai.com',
  },
];

export function startListenModal(stopper) {
  searchIdItem.forEach(item => item.addEventListener('mouseenter', onImageHover));
  if (stopper) {
    searchIdItem.forEach(item => item.removeEventListener('mouseenter', onImageHover));
  }

  function onImageHover(e) {
    const name = e.target.dataset.name;
    const markup = creatorCardTpl(data.find(item => item.id === name));
    creatorCardinModal.innerHTML = markup;
  }
}
