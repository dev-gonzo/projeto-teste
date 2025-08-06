export interface Page<T> {
  data: T[];
  count: number;
}

export class PageImpl<T> implements Page<T> {
  constructor(public data: T[], public count: number) {}

  static of<T>(data: T[], count?: number): Page<T> {
    const total = count === undefined ? data.length : count;
    return new PageImpl<T>(data, total);
  }
}

export interface PageResponse<T> {
  content: T[];
  totalElements: number;
}