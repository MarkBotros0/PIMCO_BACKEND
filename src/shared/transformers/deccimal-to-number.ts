export const DecimalToNumberTransformer = {
  to: (value: number) => value,
  from: (value: string) => parseFloat(value)
};
