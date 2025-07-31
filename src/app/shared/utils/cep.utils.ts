export class CepUtils {
  static CEP_REGEX: RegExp = /^([\d]{5})\-*([\d]{3})/;

  static format(value: string): string {
    const newValue = value && value.trim();
    if (!newValue || newValue.length !== 8) {
      return value;
    }

    return CepUtils.CEP_REGEX.test(newValue) ? newValue.replace(CepUtils.CEP_REGEX, '$1-$2') : newValue;
  }

  static validate(value: string): boolean {
    return CepUtils.CEP_REGEX.test(value);
  }
}
