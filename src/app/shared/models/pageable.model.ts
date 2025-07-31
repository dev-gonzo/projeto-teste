export class Pageable {
  static DEFAULT = new Pageable();

  constructor(public pageNumber = 1, public pageSize = 5) {}
}
