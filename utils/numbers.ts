export function convertStringToNumber(str: string): number {
  if (typeof str === 'number') {
    return str;
  }

  return parseFloat(str.replace('%', '').replace(/,/g, ''));
}

export function isStringNumber(str: string): boolean {
  return typeof str === 'string' && !isNaN(convertStringToNumber(str));
}
