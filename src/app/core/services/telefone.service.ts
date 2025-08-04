import { UnidadeOperacional } from "../../shared/models";
import { separarTelefone } from "../../shared/utils/telefone.utils";

export function transformarTelefones(value: UnidadeOperacional): UnidadeOperacional {
  if (value.telefonePrincipal) {
    const { ddd, numero } = separarTelefone(value.telefonePrincipal);
    value.telefoneDDD = ddd;
    value.telefonePrincipal = numero;
  }

  if (value.telefoneSecundario) {
    const { ddd, numero } = separarTelefone(value.telefoneSecundario);
    value.telefoneSecundarioDDD = ddd;
    value.telefoneSecundario = numero;
  }

  return value;
}