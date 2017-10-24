export class LinkHandler {
  constructor (code) {
    this.code = code;
  }

  build () {
    if (this.code.length === 11) {
      // add class
      document.getElementById('screen').classList.add('screen');
      const link = 'https://www.youtube.com/embed/' + this.code;
      const iframe = `<iframe src="${link}" frameborder="0" allowfullscreen></iframe>`;
      document.querySelector('#play').innerHTML = iframe;
    } else {
      const imgSrc = './img/meme.png';
      const errorImg = `<h4><span class="alert">! Invalid video id !<span></h4> <img src="${imgSrc}" alt="meme" width="30%" height="30%">`;
      document.querySelector('#play').innerHTML = errorImg;
    };
  }
}
