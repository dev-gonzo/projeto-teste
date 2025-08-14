import { AbstractModel } from '.';

export interface Cargo extends AbstractModel<number> {
  id: number;
  descricao: string;
}
