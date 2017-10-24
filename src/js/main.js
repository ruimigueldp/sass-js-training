import { MoviesCollection } from './likes';
import { LinkHandler } from './link';

const hero = document.querySelector('.content-title');
const text = hero.querySelector('h1');
const walk = 25; // 100px
// shadow function
function shadow (e) {
  const { offsetWidth: width, offsetHeight: height } = hero;
  let { offsetX: x, offsetY: y } = e;

  if (this !== e.target) {
    x = x + e.target.offsetLeft;
    y = y + e.target.offsetTop;
  };

  const xWalk = Math.round((x / width * walk) - (walk / 2));
  const yWalk = Math.round((y / height * walk) - (walk / 2));
  // .textShadow
  text.style.textShadow = `${xWalk}px ${yWalk}px 0 grey`;
};

hero.addEventListener('mousemove', shadow);
hero.addEventListener('mouseout', function () {
  text.style.textShadow = `none`;
});

const hours = new Date().getHours();
const min = new Date().getMinutes();
const contentH = hours > 12 ? `at ${hours} pm` : `at ${hours} am`;
const contentM = ` and ${min} minutes`;

document.querySelector('#minutes').innerHTML = contentM;
document.querySelector('#year').innerHTML = contentH;

const getCode = function () {
  const youtubecode = document.querySelector('.input-link').value;
  new LinkHandler(youtubecode).build();
};

document.getElementById('Btn').onclick = getCode;

// functions
function loadProfiles (userNames) {
  for (let i in userNames) {
    const output = 'Fetched for ' + userNames[i];
    console.log(output);
  }
};

loadProfiles(['porto', 'sporting', 'benfica']);
// es6 string methods
const heading = 'Another TEST';
console.log(
  `${'>='.repeat(5)} ${heading} ${'=<'.repeat(5)}`
);
// classes
new MoviesCollection(['pulp fiction', 'godfather', 'uelele', 'batman']).dump();
