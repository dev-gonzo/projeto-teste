import { Usuario } from '.';

export interface HistoricoAcoes {
  idLog: number;
  nomeUsuario?: string;
  ip: string;
  descricao: string;
  dataHoraLog?: string;
  dataHoraCompleta?: string;
  operacao?: string;
  usuario?: Usuario;
}
