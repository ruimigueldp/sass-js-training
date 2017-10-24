export class MoviesCollection {
  constructor (movies = []) {
    this.movies = movies;
  }

  dump () {
    console.log(this.movies);
  }
}
