import * as mongoose from 'mongoose';
import * as HttpError from 'http-errors';
import BearerTokenSchema, { BearerTokenModel } from './BearerToken';
import UserSchema, { UserModel } from './User';

/**
 * Initialize model and add helper method `findByIdOrError`
 * @param {Object} schema the schema
 * @param {String} name the model name
 * @returns {Object} the mongoose model
 */
function createModel<T extends mongoose.Document>(
  schema: mongoose.Schema,
  name: string,
): mongoose.Model<T> {
  schema.statics.findByIdOrError = async function findByIdOrError(
    id: string,
    projection: any,
    options: any,
  ) {
    const item = await this.findById(id, projection, options);
    if (!item) {
      throw new HttpError.NotFound(`${name} not found with id=${id}`);
    }
    return item;
  };
  const model = mongoose.model<T>(name, schema);

  model.schema.set('minimize', false);
  model.schema.set('toJSON', {
    transform: (doc: mongoose.Document, ret: mongoose.Document) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
  return model;
}

export const User = createModel<UserModel>(UserSchema, 'User');
export const BearerToken = createModel<BearerTokenModel>(
  BearerTokenSchema,
  'BearerToken',
);
