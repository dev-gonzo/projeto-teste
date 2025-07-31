import { AbstractModel, Uf } from '.';

export interface Municipio extends AbstractModel<number> {
  codigoIbge: number;
  nome: string;
  uf: Uf;
}
