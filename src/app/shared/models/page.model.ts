import { UnidadeOperacional } from "./unidade-operacional.model";

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

export interface UnidadeOperacionalPageResponse {
  _embedded?: {
    unidadeOperacionalDTOList: UnidadeOperacional[];
  };
  page?: {
    size: number;
    totalElements: number;
    totalPages: number;
    number: number;
  };
  _links?: any;
}
