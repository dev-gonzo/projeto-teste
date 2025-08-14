import { UnidadeOperacional } from "../models";

export interface TelefoneFormatado {
  ddd: string;
  numero: string;
}

export function separarTelefone(telefone: string, dddLength = 2): TelefoneFormatado {
  if (!telefone || telefone.length <= dddLength) {
    return { ddd: '', numero: telefone || '' };
  }

  const ddd = telefone.substring(0, dddLength);
  const numero = telefone.substring(dddLength);

  return { ddd, numero };
}

export function transformarTelefones(value: UnidadeOperacional): UnidadeOperacional {
  const numeroTelefonePrincipalTransformado = value.numeroTelefonePrincipal
    ? separarTelefone(value.numeroTelefonePrincipal)
    : null;

  const numeroTelefoneSecundarioTransformado = value.numeroTelefoneSecundario
    ? separarTelefone(value.numeroTelefoneSecundario)
    : null;

  return {
    ...value,
    ...(numeroTelefonePrincipalTransformado && {
      numeroTelefonePrincipal: numeroTelefonePrincipalTransformado.numero,
      telefoneDDD: numeroTelefonePrincipalTransformado.ddd,
    }),
    ...(numeroTelefoneSecundarioTransformado && {
      numeroTelefoneSecundario: numeroTelefoneSecundarioTransformado.numero,
      telefoneSecundarioDDD: numeroTelefoneSecundarioTransformado.ddd,
    }),
  };
}
