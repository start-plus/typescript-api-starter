import * as HTTPError from 'http-errors';
// import * as Joi from 'joi';
import * as crypto from 'mz/crypto';
import * as config from 'config';
import { createPasswordHash } from '../common/security';
import { User } from '../models';
import { contract, Joi } from 'ts-contract';

export const register = contract(
  ['values'],
  {
    values: Joi.object({
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
    }).required(),
  },
  /**
   * Register a new user
   * @param values the values to create
   * @returns the created user
   */
  async values => {
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
  },
);

export const login = contract(
  ['values'],
  {
    values: Joi.object({
      password: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
    }).required(),
  },

  /**
   * Login with email and password
   * @param values the auth data
   * @returns the user instance
   */
  async values => {
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
  },
);
