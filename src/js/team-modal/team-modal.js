import dmytro1x from '../../images/team/faint/dmytro@1x.png';
import dmytro2x from '../../images/team/faint/dmytro@2x.png';
import dmytro4x from '../../images/team/faint/dmytro@4x.png';
import iryna1x from '../../images/team/faint/iryna@1x.png';
import iryna2x from '../../images/team/faint/iryna@2x.png';
import iryna4x from '../../images/team/faint/iryna@4x.png';
import mykola1x from '../../images/team/faint/mykola@1x.png';
import mykola2x from '../../images/team/faint/mykola@2x.png';
import mykola4x from '../../images/team/faint/mykola@4x.png';
import oleksandr1x from '../../images/team/faint/oleksandr@1x.png';
import oleksandr2x from '../../images/team/faint/oleksandr@2x.png';
import oleksandr4x from '../../images/team/faint/oleksandr@4x.png';
import serhii1x from '../../images/team/faint/serhii@1x.png';
import serhii2x from '../../images/team/faint/serhii@2x.png';
import serhii4x from '../../images/team/faint/serhii@4x.png';
import svitlana1x from '../../images/team/faint/svitlana@1x.png';
import svitlana2x from '../../images/team/faint/svitlana@2x.png';
import svitlana4x from '../../images/team/faint/svitlana@4x.png';
import taras1x from '../../images/team/faint/taras@1x.png';
import taras2x from '../../images/team/faint/taras@2x.png';
import taras4x from '../../images/team/faint/taras@4x.png';
import tetiana1x from '../../images/team/faint/tetiana@1x.png';
import tetiana2x from '../../images/team/faint/tetiana@2x.png';
import tetiana4x from '../../images/team/faint/tetiana@4x.png';
import teamlogo from '../../images/svg/teamlogo.svg';

import creatorCardTpl from '../../templates/creator-card.hbs';
import creatorsTpl from '../../templates/creators.hbs';

import { modalCall } from '../modal/modalCall';

const triggeredModalButton = document.querySelector('.footer__link');
const data = {
  creators: [
    {
      id: 'serhii',
      name: 'Serhii Rybak',
      position: 'team lead',
      imagefaint1xURL: serhii1x,
      imagefaint2xURL: serhii2x,
      imagefaint4xURL: serhii4x,
      github: 'https://github.com/serg-rsv',
      linkdIn: 'https://www.linkedin.com/in/serhii-rybak-aaa300231/',
      mail: 'rybaksw@gmail.com',
    },
    {
      id: 'mykola',
      name: 'Mykola Tymoshchuk',
      position: 'scrum master',
      imagefaint1xURL: mykola1x,
      imagefaint2xURL: mykola2x,
      imagefaint4xURL: mykola4x,
      github: 'https://github.com/Nikolay-Tymoshchuk',
      linkdIn: 'https://www.linkedin.com/in/nikolay-timoshchuk-153384240/',
      mail: 'nikolaytymoshchuk@gmail.com',
    },
    {
      id: 'svitlana',
      name: 'Svitlana Fedorenko',
      position: 'developer',
      imagefaint1xURL: svitlana1x,
      imagefaint2xURL: svitlana2x,
      imagefaint4xURL: svitlana4x,
      github: 'https://github.com/Svetlana493',
      linkdIn: 'https://www.linkedin.com/in/svetlana-fedorenko-35a479231/',
      mail: 'fedorenkosvitlana726@gmail.com',
    },
    {
      id: 'dmytro',
      name: 'Dmytro Prokoptsov',
      position: 'developer',
      imagefaint1xURL: dmytro1x,
      imagefaint2xURL: dmytro2x,
      imagefaint4xURL: dmytro4x,
      github: 'https://github.com/ProkoptsovD',
      linkdIn: 'https://www.linkedin.com/in/prokoptsovd',
      mail: 'fenderman1992@gmail.com',
    },
    {
      id: 'tetiana',
      name: 'Tetiana Mykhailenko',
      position: 'developer',
      imagefaint1xURL: tetiana1x,
      imagefaint2xURL: tetiana2x,
      imagefaint4xURL: tetiana4x,
      github: 'https://github.com/Tata-git ',
      linkdIn: 'https://www.linkedin.com/in/tetiana-mykhailenko-goit',
      mail: 'fsd.tetiana@gmail.com',
    },
    {
      id: 'iryna',
      name: 'Iryna Honchar',
      position: 'developer',
      imagefaint1xURL: iryna1x,
      imagefaint2xURL: iryna2x,
      imagefaint4xURL: iryna4x,
      github: 'https://github.com/irinaog',
      linkdIn: 'https://www.linkedin.com/in/irina-gonchar-170850241/',
      mail: 'goncharirina08@gmail.com',
    },
    {
      id: 'oleksandr',
      name: 'Oleksandr Kaplunenko',
      position: 'developer',
      imagefaint1xURL: oleksandr1x,
      imagefaint2xURL: oleksandr2x,
      imagefaint4xURL: oleksandr4x,
      github: 'https://github.com/Kaplynenko',
      linkdIn: 'https://www.linkedin.com/',
      mail: 's.kaplynenko@gmail.com',
    },
    {
      id: 'taras',
      name: 'Taras Bondar',
      position: 'developer',
      imagefaint1xURL: taras1x,
      imagefaint2xURL: taras2x,
      imagefaint4xURL: taras4x,
      github: 'https://github.com/strelezzzz',
      linkdIn: 'https://www.linkedin.com/in/taras-bondar-468131119',
      mail: 'strelezzzz@gmai.com',
    },
  ],
  teamlogo,
};

//Добавляем слушателя на кнопку открытия модального окна команды
triggeredModalButton.addEventListener('click', e => {
  // Создаем разметку для модального окна команды
  modalCall(creatorsTpl(data), '#team-close-button');

  // Находим элемент, при полной загрузке которого будет вешаться класс, разрешающий начало анимации
  const startAnimatingElement = document.querySelector('.person-image');

  // Навешиваем прослушку на событие полной загрузки элемента
  startAnimatingElement.addEventListener('load', onLoad);

  // Когда элемент загрузился, добавляем класс active для разрешения запуска анимации
  function onLoad() {
    const boxRequestedAnimationClass = document.querySelector('.thereisnospoon');
    boxRequestedAnimationClass.classList.add('active');

    // Снимаем слушателя с элемената, на который навешивали прослушку и выходим
    startAnimatingElement.removeEventListener('load', onLoad);
    return;
  }

  // Начинаем прослушку элементов формы и им отрисовку при наведении
  startListenEndRenderModalElements();
});

// Функция для прослушки элементов формы и им отрисовки при наведении
function startListenEndRenderModalElements() {
  // Находим массив элементов, на каждый из которых добавляем прослушку события наведения мышки
  const searchIdItem = document.querySelectorAll('.team-list__image');
  searchIdItem.forEach(item => item.addEventListener('mouseenter', onImageHover));

  // Функция отрисовки контента при наведении мышки
  function onImageHover(e) {
    // Находим дата атрибут name целевого элемента чтоб выполнить поиск по данным в объекте data
    const creatorCardinModal = document.querySelector('.person-card');
    const name = e.target.dataset.name;

    //Сопоставляем дата атрибут name с id объекта в data и на основе этих данным отрисовываем контент модального окна
    const markup = creatorCardTpl(data.creators.find(item => item.id === name));
    creatorCardinModal.innerHTML = markup;
  }
}
