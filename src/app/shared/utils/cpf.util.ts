export class CpfUtils {
  static CPF_PATTERN = '###.###.###-##';

  static INVALID_VALUES = [
    '00000000000',
    '11111111111',
    '22222222222',
    '33333333333',
    '44444444444',
    '55555555555',
    '66666666666',
    '77777777777',
    '88888888888',
    '99999999999',
  ];

  static format(value: string): string {
    const newValue = value && value.trim();
    if (!newValue && newValue.length !== length) {
      return value;
    }

    let formatted: string = CpfUtils.CPF_PATTERN;
    for (let i = 0, l = newValue.length; i < l; i++) {
      formatted = formatted.replace('#', newValue[i]);
    }

    return formatted;
  }

  static validate(cpf: string): boolean {
    if (!cpf) {
      return true;
    }

    const value = typeof cpf === 'string' ? cpf.replace(/[^\d]+/g, '') : cpf;
    if (value.length !== 11 || CpfUtils.INVALID_VALUES.includes(value)) {
      return false;
    }

    let add = 0;

    for (let i = 0; i < 9; i++) {
      add += parseInt(value.charAt(i)) * (10 - i);
    }

    let rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
      rev = 0;
    }

    if (rev !== parseInt(value.charAt(9))) {
      return false;
    }

    add = 0;

    for (let i = 0; i < 10; i++) {
      add += parseInt(value.charAt(i)) * (11 - i);
    }

    rev = 11 - (add % 11);
    if (rev === 10 || rev === 11) {
      rev = 0;
    }

    if (rev !== parseInt(value.charAt(10))) {
      return false;
    }

    return true;
  }
}
