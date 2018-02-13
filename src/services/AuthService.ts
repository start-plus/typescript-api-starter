import * as HTTPError from 'http-errors';
import * as Joi from 'joi';
import { service, validate, schema } from 'ts-service';
import * as crypto from 'mz/crypto';
import * as config from 'config';
import { createPasswordHash } from '../common/security';
import { User } from '../models';

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
   * @param {String} email
   * @param {String} password
   * @returns {User} the user instance
   */
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
