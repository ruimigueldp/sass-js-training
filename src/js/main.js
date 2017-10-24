import { MoviesCollection } from './likes';
import { LinkHandler } from './link';

const hours = new Date().getHours();
const min = new Date().getMinutes();
const contentH = hours > 12 ? `at ${hours} pm` : `at ${hours} am`;
const contentM = ` and ${min} minutes`;

document.querySelector('#minutes').innerHTML = contentM;
document.querySelector('#year').innerHTML = contentH;

function getCode () {
  const youtubecode = document.querySelector('.input-link').value;
  new LinkHandler(youtubecode).build();
}

document.getElementById('Btn').onclick = getCode();

// functions
function loadProfiles (userNames) {
  for (let i in userNames) {
    const output = 'Fetched for ' + userNames[i];
    console.log(output);
  }
}

loadProfiles(['porto', 'sporting', 'benfica']);
// es6 string methods
const heading = 'Another TEST';
console.log(
  `${'>='.repeat(5)} ${heading} ${'=<'.repeat(5)}`
);
// classes
new MoviesCollection(['pulp fiction', 'godfather', 'uelele', 'batman']).dump();
