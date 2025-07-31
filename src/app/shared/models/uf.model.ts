import { AbstractModel } from '.';

export interface Uf extends AbstractModel<number> {
  codigoIbge: number;
  nome: string;
  sigla: string;
}
