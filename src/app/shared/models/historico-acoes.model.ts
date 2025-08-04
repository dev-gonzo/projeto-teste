import { Usuario } from '.';

export interface HistoricoAcoes {
  idLog: number;
  nomeUsuario?: string;
  ip: string;
  descricao: string;
  dataHoraLog?: string;
  dataAcao?: string;
  horaAcao?: string;
  operacao?: string;
  usuario?: Usuario;
}
