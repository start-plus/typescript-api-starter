// type ConvertType3<T> = T extends JoiPrimitiveSchema ? ExtractPrimitive<T> : T;
// import * as Joi from 'joi';

// type ConvertType2<T> = T extends JoiPrimitiveSchema
//   ? ExtractPrimitive<T>
//   : T extends Joi.ArraySchema<infer K>
//     ? Array<
//         K extends Joi.ObjectSchema<infer P>
//           ? ExtractObject3<P>
//           : ConvertType3<K>
//       >
//     : T extends Joi.ObjectSchema<infer K> ? ExtractObject3<K> : T;

// type ExtractObject2<T> = { [K in keyof T]: ConvertType2<T[K]> };
// type ExtractObject3<T> = { [K in keyof T]: ConvertType3<T[K]> };

// type JoiPrimitiveSchema =
//   | Joi.StringSchema
//   | Joi.NumberSchema
//   | Joi.BooleanSchema
//   | Joi.DateSchema;

// type ExtractPrimitive<T> = T extends Joi.StringSchema<infer S_REQ>
//   ? (S_REQ extends true ? string : (string | undefined))
//   : T extends Joi.NumberSchema
//     ? number
//     : T extends Joi.BooleanSchema
//       ? boolean
//       : T extends Joi.DateSchema ? Date : T;

// export type ConvertType<T> = T extends JoiPrimitiveSchema
//   ? ExtractPrimitive<T>
//   : T extends Joi.ArraySchema<infer K>
//     ? Array<
//         K extends Joi.ObjectSchema<infer P, infer REQ>
//           ? (REQ extends true
//               ? ExtractObject2<P>
//               : (ExtractObject2<P> | undefined))
//           : ConvertType2<K>
//       >
//     : T extends Joi.ObjectSchema<infer K, infer REQ>
//       ? (REQ extends true ? ExtractObject2<K> : (ExtractObject2<K> | undefined))
//       : T;

// export type ExtractObject<T> = { [K in keyof T]: ConvertType<T[K]> };

// export function contract<
//   ARG1 extends string,
//   ARG2 extends string,
//   T extends { [key in ARG1 | ARG2]: Joi.SchemaLike },
//   R,
//   FN extends (arg1: ConvertType<T[ARG1]>, arg2: ConvertType<T[ARG2]>) => R
// >(params: [ARG1, ARG2], schema: T, fn: FN): FN;

// export function contract<
//   ARG1 extends string,
//   T extends { [key in ARG1]: Joi.SchemaLike },
//   R,
//   FN extends (arg1: ConvertType<T[ARG1]>) => R
// >(params: [ARG1], schema: T, fn: FN): FN;

// export function contract(params: any, schema: any, fn: any): any {
//   return 2;
// }
