import { Usuario } from '.';

export interface HistoricoAcoes {
  idLog: number;
  nomeUsuario?: string;
  ipMaquina: string;
  descricao: string;
  dataHoraLog?: string;
  dataLog?: string;
  horaLog?: string;
  operacao?: string;
  usuario?: Usuario;
}
