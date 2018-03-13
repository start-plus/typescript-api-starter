import * as HTTPError from 'http-errors';
import * as Joi from 'joi';
import { service, validate, schema } from 'ts-service';
import * as crypto from 'mz/crypto';
import * as config from 'config';
import { createPasswordHash } from '../common/security';
import { User, BearerToken } from '../models';

// const s = Joi.object()
//   .keys({
//     password: Joi.string().required(),
//     email: Joi.string()
//       .email()
//       .required(),
//   })
//   .required();

// const a = Joi.string().required();

type CustomObject<T> = {};

const obj = {
  foo: Joi.string(),
  optionalString: Joi.string().optional(),
  bar: Joi.number(),
  innerObject: Joi.object().keys({
    innerA: Joi.string(),
    innerB: Joi.number(),
  }),
  myArray: Joi.array().items(Joi.number()),
  nestedArray: Joi.array().items(
    Joi.object().keys({
      arr1: Joi.string(),
      arr2: Joi.number(),
    }),
  ),
  myDate: Joi.date(),
  multiNested: Joi.object().keys({
    foo1: Joi.string(),
    level1: Joi.object().keys({
      foo2: Joi.string(),
      // level2: Joi.object().keys({
      //   foo3: Joi.string(),
      //   level3: Joi.object().keys({
      //     foo4: Joi.string(),
      //   }),
      // }),
    }),
  }),
};

function extractType<T>(obj2: T): ExtractObject<T> {
  return obj2 as any;
}

type ConvertType3<T> = T extends JoiPrimitiveSchema ? ExtractPrimitive<T> : T;

type ConvertType2<T> = T extends JoiPrimitiveSchema
  ? ExtractPrimitive<T>
  : T extends Joi.ArraySchema<infer K>
    ? Array<
        K extends Joi.ObjectSchema<infer P>
          ? ExtractObject3<P>
          : ConvertType3<K>
      >
    : T extends Joi.ObjectSchema<infer K> ? ExtractObject3<K> : T;

type ExtractObject2<T> = { [K in keyof T]: ConvertType2<T[K]> };
type ExtractObject3<T> = { [K in keyof T]: ConvertType3<T[K]> };

type JoiPrimitiveSchema =
  | Joi.StringSchema
  | Joi.NumberSchema
  | Joi.BooleanSchema
  | Joi.DateSchema;

type ExtractPrimitive<T> = T extends Joi.StringSchema<infer S_REQ>
  ? (S_REQ extends true ? string : (string | undefined))
  : T extends Joi.NumberSchema
    ? number
    : T extends Joi.BooleanSchema
      ? boolean
      : T extends Joi.DateSchema ? Date : T;

type ConvertType<T> = T extends JoiPrimitiveSchema
  ? ExtractPrimitive<T>
  : T extends Joi.ArraySchema<infer K>
    ? Array<
        K extends Joi.ObjectSchema<infer P>
          ? ExtractObject2<P>
          : ConvertType2<K>
      >
    : T extends Joi.ObjectSchema<infer K> ? ExtractObject2<K> : T;

// type t = ValueOf<typeof obj>;

type ExtractObject<T> = { [K in keyof T]: ConvertType<T[K]> };

// type GetJoiType<T> = T extends Joi.StringSchema
//   ? string
//   : T extends CustomObject<infer U> ? ExtractObject<U> : 'object';

// type Sample = CustomObject<{
//   foo: Joi.StringSchema;
//   bar: Joi.NumberSchema;
// }>;

type A = ExtractObject<typeof obj>;

const a = extractType(obj);

const foo = {} as A;

console.log(foo.innerObject.innerA);

interface Params<
  ARG1 extends string,
  T extends { [key in ARG1]: Joi.SchemaLike },
  R
> {
  def: T;
  params: [ARG1];
  handler: (arg1: ConvertType<T[ARG1]>) => R;
}

interface Params2<
  ARG1 extends string,
  ARG2 extends string,
  T extends { [key in ARG1 | ARG2]: Joi.SchemaLike },
  R
> {
  def: T;
  params: [ARG1, ARG2];
  handler: (arg1: ConvertType<T[ARG1]>, arg2: ConvertType<T[ARG2]>) => R;
}

// interface Params2<T extends Joi.SchemaMap, R> {
//   def: T;
//   handler: (arg1: ExtractObject<T>) => R;
// }

// function createMethod<T extends Joi.SchemaMap, R>(params: Params<T, R>);
function createMethod<
  ARG1 extends string,
  T extends { [key in ARG1]: Joi.SchemaLike },
  R
>(params: Params<ARG1, T, R>) {
  return '';
}
function createMethod2<
  ARG1 extends string,
  ARG2 extends string,
  T extends { [key in ARG1 | ARG2]: Joi.SchemaLike },
  R
>(params: Params2<ARG1, ARG2, T, R>) {
  return '';
}

createMethod({
  def: {
    id: Joi.string(),
    // values: Joi.object().keys({
    //   firstName: Joi.string(),
    //   lastName: Joi.string(),
    // }),
  },
  params: ['id'],
  handler: id => {
    return 2;
  },
});

const myFn = createMethod2({
  def: {
    id: Joi.string(),
    values: Joi.object().keys({
      firstName: Joi.string(),
      lastName: Joi.string().optional(),
    }),
  },
  params: ['id', 'values'],
  handler: (id, values) => {
    return 2;
  },
});

// type A = GetJoiType<typeof a>;

// type ReturnType<T> = T extends (...args: any[]) => infer R ? R : T;

// type Unpacked<T> = T extends (infer U)[]
//   ? U
//   : T extends (...args: any[]) => infer U
//     ? U
//     : T extends Promise<infer U> ? U : T;

@schema(
  Joi.object()
    .keys({
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
    })
    .required(),
)
class RegisterValues {
  password: string;
  email: string;
}

@schema(
  Joi.object()
    .keys({
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
    })
    .required(),
)
class LoginValues {
  password: string;
  email: string;
}

@service
class AuthService {
  /**
   * Register a new user
   * @param values the values to create
   * @returns the created user
   */
  @validate
  async register(values: RegisterValues) {
    const existing = await User.findOne({
      email_lowered: values.email.toLowerCase(),
    });
    if (existing) {
      throw new HTTPError.BadRequest('Email address is already registered');
    }
    const salt = await crypto
      .randomBytes(config.SECURITY.SALT_LENGTH)
      .then(ret => ret.toString('hex'));
    const password = await createPasswordHash(values.password, salt);

    return User.create({
      ...values,
      salt,
      password,
      email_lowered: values.email.toLowerCase(),
    });
  }

  /**
   * Login with email and password
   * @param values the auth data
   * @returns the user instance
   */
  @validate
  async login(values: LoginValues) {
    const { email, password } = values;
    const errorMsg = 'Invalid email or password';
    const user = await User.findOne({ email_lowered: email.toLowerCase() });
    if (!user) {
      throw new HTTPError.Unauthorized(errorMsg);
    }
    const hash = await createPasswordHash(password, user.salt);
    if (hash !== user.password) {
      throw new HTTPError.Unauthorized(errorMsg);
    }
    return user;
  }
}

export const authService = new AuthService();
