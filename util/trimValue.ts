export const trimFormValues = <T>(values: T): T => {
  const trimmedValues: T = {} as T;
  for (const key in values) {
    if (Object.hasOwnProperty.call(values, key)) {
      let value = values[key];

      if (value === undefined) {
        value = null as T[Extract<keyof T, string>];
      } else if (typeof value === "string") {
        value = value.trim() as T[Extract<keyof T, string>];
      }

      trimmedValues[key] = value;
    }
  }
  return trimmedValues;
};
