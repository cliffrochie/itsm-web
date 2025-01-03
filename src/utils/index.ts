export function isNumeric(value: string) {
  return /^-?\d+$/.test(value);
}

export function capitalizeFirstLetter(val: string) {
  return String(val).charAt(0).toUpperCase() + String(val).slice(1);
}


