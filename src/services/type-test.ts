// const obj = {
//   foo: 'string?' as 'string?',
//   bar: 'string' as 'string',
//   custom: 'custom' as 'custom',
// };

// type Dummy<T> = T | null;

// type ConvertType<T> = T extends 'string'
//   ? string
//   : T extends 'string?' ? (string | undefined | null) : T;

// type ExtractType<T> = {
//   [K in keyof T]: (ConvertType<T[K]>) extends 'custom'
//     ? never
//     : ConvertType<T[K]>
// };

// type B = ConvertType<'string'>;
// type C = ConvertType<'string?'>;
// type D = ConvertType<number | null>;
// type E = Dummy<number | null> | null;

// type A = ExtractType<typeof obj>;

// const a = {} as A;

// const B: B = undefined;
