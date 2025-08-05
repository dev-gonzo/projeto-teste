import { UnidadeOperacional } from "../../shared/models";
import { separarTelefone } from "../../shared/utils/telefone.utils";

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
