export class LinkHandler {
  constructor (code) {
    this.code = code;
  }

  build () {
    let link = 'https://www.youtube.com/embed/' + this.code;
    let iframe = `<iframe src="${link}" frameborder="0" allowfullscreen></iframe>`;
    document.querySelector('#play').innerHTML = iframe;
  }
}
