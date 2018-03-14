import { Document } from 'mongoose';

type ConvertType<T> = T extends StringConstructor
  ? string
  : T extends NumberConstructor
    ? number
    : T extends BooleanConstructor
      ? boolean
      : T extends DateConstructor ? Date : T;

type Optional<T> = T | undefined;

type SchemaProp<T, R> = { type: T; required: R };

type ConvertEnum<T> = T extends Array<infer E> ? E : T;

type ConvertOptional<T, R> = R extends true
  ? ConvertType<T>
  : Optional<ConvertType<T>>;

type ConvertProp<T> = T extends {
  type: infer V;
  required?: infer R;
  enum: infer E;
}
  ? ConvertEnum<E>
  : T extends { type: infer V; required: infer R }
    ? ConvertOptional<V, R>
    : T extends { type: infer V }
      ? Optional<ConvertType<V>>
      : Optional<ConvertType<T>>;

export type ExtractMongoose<T> = { [K in keyof T]: ConvertProp<T[K]> } &
  Document;

export const typeDefinition = <
  K extends { required?: true | false },
  T extends {
    [key: string]: K;
  }
>(
  definition: T,
) => definition;
