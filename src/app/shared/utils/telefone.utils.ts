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
  const telefonePrincipalTransformado = value.telefonePrincipal
    ? separarTelefone(value.telefonePrincipal)
    : null;

  const telefoneSecundarioTransformado = value.telefoneSecundario
    ? separarTelefone(value.telefoneSecundario)
    : null;

  return {
    ...value,
    ...(telefonePrincipalTransformado && {
      telefonePrincipal: telefonePrincipalTransformado.numero,
      telefoneDDD: telefonePrincipalTransformado.ddd,
    }),
    ...(telefoneSecundarioTransformado && {
      telefoneSecundario: telefoneSecundarioTransformado.numero,
      telefoneSecundarioDDD: telefoneSecundarioTransformado.ddd,
    }),
  };
}
