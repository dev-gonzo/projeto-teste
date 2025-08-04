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
