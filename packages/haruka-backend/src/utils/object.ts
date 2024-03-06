export function convertNullToUndefined(obj: any): { [key: string]: any } {
  if (typeof obj !== 'object' || obj === null) {
    return obj;
  }

  for (const key in obj) {
    if (obj[key] === null) {
      obj[key] = undefined;
    }
  }
  return obj;
}
